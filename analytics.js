const firebaseConfig = {
  apiKey: "AIzaSyAI1Qh4eL5xS5w6_cqKA1iN8fFaCrddw8o",
  authDomain: "ravi-payroll.firebaseapp.com",
  databaseURL: "https://ravi-payroll-default-rtdb.firebaseio.com",
  projectId: "ravi-payroll",
  storageBucket: "ravi-payroll.appspot.com",
  messagingSenderId: "228526283867",
  appId: "1:228526283867:web:39cc6d842bb2b991be737e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// DOM Elements
const filterMode = document.getElementById('filterMode');
const fromDate = document.getElementById('fromDate');
const toDate = document.getElementById('toDate');
const employeeSelect = document.getElementById('employeeSelect');
const applyFilter = document.getElementById('applyFilter');
const payrollCount = document.getElementById('payrollCount');
const totalGross = document.getElementById('totalGross');
const totalDeductions = document.getElementById('totalDeductions');
const totalNet = document.getElementById('totalNet');
const totalReleased = document.getElementById('totalReleased');
const mainContent = document.querySelector('.main-content');

// Chart Contexts
const lineCtx = document.getElementById('lineChart').getContext('2d');
const employeeLineCtx = document.getElementById('employeeLineChart').getContext('2d');
const pieCtx = document.getElementById('pieChart').getContext('2d');

// Initialize date pickers
flatpickr("#fromDate", { dateFormat: "Y-m-d" });
flatpickr("#toDate", { dateFormat: "Y-m-d" });

// Chart instances
let lineChart, employeeLineChart, pieChart;
let cachedPayrollData = null;

// Loading state UI
function showLoading() {
  mainContent.classList.add('loading');
}

function hideLoading() {
  mainContent.classList.remove('loading');
}

// Error handling
function showError(message) {
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  document.querySelector('.filters').after(errorEl);
  setTimeout(() => errorEl.remove(), 5000);
}

// Date validation
function validateDates() {
  if (filterMode.value !== 'cutoff' && fromDate.value && toDate.value) {
    if (new Date(toDate.value) < new Date(fromDate.value)) {
      showError('End date must be after start date');
      return false;
    }
  }
  return true;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP'
  }).format(amount);
}

// Load employees with caching
function loadEmployees() {
  if (cachedPayrollData) {
    populateEmployeeDropdown(cachedPayrollData);
    return;
  }

  showLoading();
  
  db.ref('payrolls').once('value')
    .then(snapshot => {
      cachedPayrollData = snapshot;
      populateEmployeeDropdown(snapshot);
      hideLoading();
    })
    .catch(error => {
      console.error("Error loading employees:", error);
      showError("Failed to load employee data. Please try again.");
      hideLoading();
    });
}

function populateEmployeeDropdown(snapshot) {
  // Clear existing options except "All Employees"
  while (employeeSelect.options.length > 1) {
    employeeSelect.remove(1);
  }

  const unique = new Set();
  snapshot.forEach(empSnap => {
    empSnap.forEach(paySnap => {
      unique.add(paySnap.val().employeeName);
    });
  });

  unique.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    employeeSelect.appendChild(opt);
  });
}

// Export functionality
function setupExportButtons() {
  const exportContainer = document.createElement('div');
  exportContainer.className = 'export-container';
  exportContainer.innerHTML = `
    <button id="exportCSV" class="export-btn">Export Data as CSV</button>
    <button id="exportPNG" class="export-btn">Export Charts as PNG</button>
  `;
  document.querySelector('.filters').after(exportContainer);

  document.getElementById('exportCSV').addEventListener('click', exportToCSV);
  document.getElementById('exportPNG').addEventListener('click', exportChartsToPNG);
}

function exportToCSV() {
  if (!lineChart) return;
  
  let csvContent = "Date,Net Salary\n";
  lineChart.data.labels.forEach((label, i) => {
    csvContent += `${label},${lineChart.data.datasets[0].data[i]}\n`;
  });
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'payroll_data.csv');
  link.click();
}

function exportChartsToPNG() {
  [lineChart, employeeLineChart, pieChart].forEach((chart, i) => {
    if (!chart) return;
    
    const link = document.createElement('a');
    link.download = `chart_${i+1}.png`;
    link.href = chart.toBase64Image();
    link.click();
  });
}

// Process and display data with debouncing
let filterTimeout;
function applyFilters() {
  if (!validateDates()) return;
  
  clearTimeout(filterTimeout);
  showLoading();
  
  filterTimeout = setTimeout(() => {
    const mode = filterMode.value;
    const from = fromDate.value;
    const to = toDate.value;
    const emp = employeeSelect.value;

    let count = 0, gross = 0, deduct = 0, net = 0, released = 0;
    const lineLabels = [], lineData = [];
    const pieData = {};
    const empLineData = {};

    const processData = (snapshot) => {
      const grouped = {};
      snapshot.forEach(empSnap => {
        empSnap.forEach(paySnap => {
          const data = paySnap.val();
          const releasedDate = data.dateReleased;
          const name = data.employeeName;

          if (mode === 'cutoff' && releasedDate !== from) return;
          if ((mode === 'monthly' || mode === 'annual') && (releasedDate < from || releasedDate > to)) return;
          if (emp !== 'all' && name !== emp) return;

          count++;
          gross += Number(data.totalSalary || 0);
          deduct += Number(data.totalDeductions || 0);
          net += Number(data.netSalary || 0);
          released += Number(data.netSalary || 0);

          grouped[releasedDate] = (grouped[releasedDate] || 0) + Number(data.netSalary || 0);
          pieData[name] = (pieData[name] || 0) + Number(data.netSalary || 0);

          empLineData[name] = empLineData[name] || {};
          empLineData[name][releasedDate] = (empLineData[name][releasedDate] || 0) + Number(data.netSalary || 0);
        });
      });

      // Update summary cards
      payrollCount.textContent = count;
      totalGross.textContent = formatCurrency(gross);
      totalDeductions.textContent = formatCurrency(deduct);
      totalNet.textContent = formatCurrency(net);
      totalReleased.textContent = formatCurrency(released);

      // Prepare chart data
      Object.keys(grouped).sort().forEach(date => {
        lineLabels.push(date);
        lineData.push(grouped[date]);
      });

      renderCharts(lineLabels, lineData, empLineData, pieData);
      hideLoading();
    };

    if (cachedPayrollData) {
      processData(cachedPayrollData);
    } else {
      db.ref('payrolls').once('value')
        .then(processData)
        .catch(error => {
          console.error("Error loading payroll data:", error);
          showError("Failed to load payroll data. Please try again.");
          hideLoading();
        });
    }
  }, 300); // 300ms debounce
}

// Render all charts
function renderCharts(lineLabels, lineData, empLineData, pieData) {
  // Destroy existing charts if they exist
  if (lineChart) lineChart.destroy();
  if (employeeLineChart) employeeLineChart.destroy();
  if (pieChart) pieChart.destroy();

  // Show empty state if no data
  if (lineLabels.length === 0) {
    showEmptyState();
    return;
  }

  // Line Chart - Overall Net Salary
  lineChart = new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: lineLabels,
      datasets: [{
        label: 'Overall Net Salary',
        data: lineData,
        borderColor: '#FFD700',
        backgroundColor: '#FFD70033',
        fill: true,
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: '#FFD700'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => formatCurrency(context.raw)
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          }
        }
      }
    }
  });

  // Bar Chart - Employee Salary Comparison (sorted by highest)
  const empBarData = [];
  const empNames = Object.keys(empLineData);

  // Calculate total salary per employee
  empNames.forEach(name => {
    const totalSalary = Object.values(empLineData[name]).reduce((sum, val) => sum + val, 0);
    empBarData.push({
      name: name,
      total: totalSalary,
      // Get the most recent salary for color intensity
      recentSalary: Object.values(empLineData[name]).pop() || 0
    });
  });

  // Sort by highest total salary
  empBarData.sort((a, b) => b.total - a.total);

  // Prepare data for chart
  const barLabels = empBarData.map(emp => emp.name);
  const barData = empBarData.map(emp => emp.total);
  const barColors = empBarData.map(emp => {
    // Create gradient color based on salary amount
    const intensity = Math.min(0.2 + (emp.recentSalary / Math.max(...barData) * 0.8, 1));
    return `rgba(255, 215, 0, ${intensity})`; // Gold with varying opacity
  });

  employeeLineChart = new Chart(employeeLineCtx, {
    type: 'bar',
    data: {
      labels: barLabels,
      datasets: [{
        label: 'Total Net Salary',
        data: barData,
        backgroundColor: barColors,
        borderColor: '#FFD700',
        borderWidth: 1,
        borderRadius: 4,
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y', // Horizontal bars
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => formatCurrency(context.raw)
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrency(value)
          },
          grid: {
            color: '#333'
          }
        },
        y: {
          grid: {
            color: '#333'
          }
        }
      }
    }
  });

  // Pie Chart - Breakdown by Employee
  const pieLabels = Object.keys(pieData);
  const pieValues = Object.values(pieData);
  
  pieChart = new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: pieLabels,
      datasets: [{
        data: pieValues,
        backgroundColor: generateDistinctColors(pieLabels.length),
        borderColor: '#111',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.raw || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: ${formatCurrency(value)} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

// Generate distinct colors for charts
function generateDistinctColors(count) {
  const colors = [];
  const hueStep = 360 / count;
  
  for (let i = 0; i < count; i++) {
    const hue = i * hueStep;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  
  return colors;
}

// Show empty state when no data is available
function showEmptyState() {
  const emptyState = document.createElement('div');
  emptyState.className = 'empty-state';
  emptyState.innerHTML = `
    <div class="empty-icon">📊</div>
    <h3>No Data Available</h3>
    <p>Try adjusting your filters to see payroll data</p>
  `;
  
  // Insert after the summary section
  document.getElementById('summary').after(emptyState);
  
  // Remove any existing empty states
  setTimeout(() => {
    const existing = document.querySelector('.empty-state');
    if (existing) existing.remove();
  }, 5000);
}

// Event Listeners
filterMode.addEventListener('change', () => {
  // Clear both date inputs when filter mode changes
  fromDate.value = '';
  toDate.value = '';
  
  // Disable toDate for cutoff mode
  toDate.disabled = (filterMode.value === 'cutoff');
});

applyFilter.addEventListener('click', applyFilters);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadEmployees();
  setupExportButtons();
  // Clear dates on initial load
  fromDate.value = '';
  toDate.value = '';
  filterMode.dispatchEvent(new Event('change'));
});