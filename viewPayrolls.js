// // Firebase config
// const firebaseConfig = {
//   apiKey: "",
//   authDomain: "",
//   databaseURL: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: ""
// };

// firebase.initializeApp(firebaseConfig);
// const db = firebase.database();

// const employeeFilter = document.getElementById("employeeFilter");
// const searchInput = document.getElementById("searchInput");
// const dateFilter = document.getElementById("dateFilter");
// const payrollContainer = document.getElementById("payrollContainer");
// const printAllBtn = document.getElementById("printAllBtn");
// const paginationControls = document.getElementById("paginationControls");

// let allPayrolls = [];
// let currentPage = 1;
// const pageSize = 4;

// function formatCurrency(value) {
//   return parseFloat(value || 0).toFixed(2);
// }

// function createPayrollCardHTML(payroll) {
//   return `
//     <div class="payroll-card">
//       <h3>PAY VOUCHER: ${payroll.voucherNumber || "—"}</h3>
//       <table>
//         <tr><td><strong>DATE RELEASED:</strong></td><td>${payroll.dateReleased || ""}</td></tr>
//         <tr><td><strong>EMPLOYEE NAME:</strong></td><td>${payroll.employeeName || ""}</td></tr>
//         <tr><td><strong>ID NO:</strong></td><td>${payroll.employeeID || ""}</td></tr>
//         <tr><td><strong>DATE COVERED:</strong></td><td>${payroll.dateCovered || ""}</td></tr>
//         <tr><td><strong>RATE PER DAY:</strong></td><td>${formatCurrency(payroll.ratePerDay)}</td></tr>
//         <tr><td><strong>NUMBER OF DAYS:</strong></td><td>${formatCurrency(payroll.daysWorked)}</td></tr>
//         <tr><td><strong>SUB-TOTAL SALARY:</strong></td><td>${formatCurrency(payroll.subTotal)}</td></tr>
//         <tr><td><strong>ADD ONS:</strong></td><td>
//           Sunday: ${formatCurrency(payroll.sunday)}<br>
//           Overtime: ${formatCurrency(payroll.overtime)}<br>
//           Holiday: ${formatCurrency(payroll.holiday)}<br>
//           Site Allowance: ${formatCurrency(payroll.siteAllowance)}<br>
//           Food Allowance: ${formatCurrency(payroll.foodAllowance)}
//         </td></tr>
//         <tr><td><strong>DEDUCTIONS:</strong></td><td>
//           PhilHealth: ${formatCurrency(payroll.philHealth)}<br>
//           PAG-IBIG: ${formatCurrency(payroll.pagibig)}<br>
//           SSS: ${formatCurrency(payroll.sss)}<br>
//           Loan: ${formatCurrency(payroll.loan)}<br>
//           Cash Advance: ${formatCurrency(payroll.cashAdvance)}<br>
//           Under Time: ${formatCurrency(payroll.underTime)}<br>
//           Late: ${formatCurrency(payroll.late)}
//         </td></tr>
//         <tr><td><strong>TOTAL SALARY:</strong></td><td>${formatCurrency(payroll.totalSalary)}</td></tr>
//         <tr><td><strong>TOTAL DEDUCTIONS:</strong></td><td>${formatCurrency(payroll.totalDeductions)}</td></tr>
//         <tr><td><strong>NET SALARY:</strong></td><td>${formatCurrency(payroll.netSalary)}</td></tr>
//         <tr><td><strong>REMARKS:</strong></td><td>${payroll.remarks || ""}</td></tr>
//         <div class="card-actions"></div>
//       </table>
//     </div>
//   `;
// }

// function updatePagination(totalItems) {
//   paginationControls.innerHTML = "";
//   const totalPages = Math.ceil(totalItems / pageSize);
//   if (totalPages <= 1) return;

//   for (let i = 1; i <= totalPages; i++) {
//     const btn = document.createElement("button");
//     btn.textContent = i;
//     btn.className = i === currentPage ? "active" : "";
//     btn.addEventListener("click", () => {
//       currentPage = i;
//       filterAndDisplayPayrolls();
//     });
//     paginationControls.appendChild(btn);
//   }
// }

// function displayPayrolls(dataArray) {
//   payrollContainer.innerHTML = "";

//   const start = (currentPage - 1) * pageSize;
//   const pageItems = dataArray.slice(start, start + pageSize);

//   pageItems.forEach(payroll => {
//     const div = document.createElement("div");
//     div.className = "payroll-card";
//     div.innerHTML = createPayrollCardHTML(payroll);
//     payrollContainer.appendChild(div);
//   });

//   updatePagination(dataArray.length);
// }

// function populateFilterOptions(data) {
//   const employeeIDs = Object.keys(data);
//   employeeFilter.innerHTML = `<option value="all">All Employees</option>`;
//   employeeIDs.forEach(empID => {
//     const sample = Object.values(data[empID])[0];
//     const name = sample?.employeeName || empID;
//     const option = document.createElement("option");
//     option.value = empID;
//     option.textContent = name;
//     employeeFilter.appendChild(option);
//   });
// }

// function filterAndDisplayPayrolls() {
//   const filterID = employeeFilter.value;
//   const searchTerm = searchInput.value.toLowerCase();
//   const selectedDate = dateFilter.value;

//   let filtered = [...allPayrolls];

//   if (filterID !== "all") {
//     filtered = filtered.filter(p => p.employeeID === filterID);
//   }

//   if (searchTerm) {
//     filtered = filtered.filter(p =>
//       p.employeeName?.toLowerCase().includes(searchTerm) ||
//       p.employeeID?.toLowerCase().includes(searchTerm) ||
//       p.remarks?.toLowerCase().includes(searchTerm) ||
//       p.voucherNumber?.toLowerCase().includes(searchTerm)
//     );
//   }

//   if (selectedDate) {
//     filtered = filtered.filter(p => p.dateReleased === selectedDate);
//   }

//   if (currentPage > Math.ceil(filtered.length / pageSize)) {
//     currentPage = 1;
//   }

//   displayPayrolls(filtered);
// }

// function loadPayrolls() {
//   db.ref("payrolls").on("value", snapshot => {
//     const data = snapshot.val() || {};
//     populateFilterOptions(data);
//     allPayrolls = [];

//     Object.entries(data).forEach(([empID, payrolls]) => {
//       Object.entries(payrolls).forEach(([key, payroll]) => {
//         allPayrolls.push({
//           ...payroll,
//           employeeID: empID,
//           firebaseKey: key
//         });
//       });
//     });

//     allPayrolls.sort((a, b) => {
//       const aNum = parseInt((a.voucherNumber || "PV-00000").replace("PV-", ""), 10);
//       const bNum = parseInt((b.voucherNumber || "PV-00000").replace("PV-", ""), 10);
//       return aNum - bNum;
//     });

//     filterAndDisplayPayrolls();
//   }, error => {
//     console.error("Error loading payrolls:", error);
//     payrollContainer.innerHTML = "<p>Error loading payrolls.</p>";
//   });
// }

// function printAllVouchers() {
//   const container = document.createElement("div");
//   const chunkSize = 2;

//   for (let i = 0; i < allPayrolls.length; i += chunkSize) {
//     const page = document.createElement("div"); 
//     page.className = "print-page";
//     page.style.cssText = "display: flex; flex-wrap: wrap; justify-content: space-between; width: 277mm; height: 190mm; padding: 10mm; background: white; page-break-after: always;";

//     allPayrolls.slice(i, i + chunkSize).forEach(payroll => {
//       const card = document.createElement("div");
//       card.className = "printable-card";
//       card.innerHTML = createPayrollCardHTML(payroll);
//       card.style.cssText = "width: 133mm; height: 100%; box-sizing: border-box; background: white; font-size: 10pt; padding: 8mm;";
//       page.appendChild(card);
//     });

//     container.appendChild(page);
//   }

//   html2pdf().from(container).set({
//     margin: 0,
//     filename: "Payroll_Vouchers_Landscape.pdf",
//     jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
//     pagebreak: { mode: ['avoid-all'] }
//   }).save();
// }


// function printPayrollsByDateReleased() {
//   const selectedDate = dateFilter.value;
//   if (!selectedDate) return alert("Please select a date.");

//   const filtered = allPayrolls.filter(p => p.dateReleased === selectedDate);
//   if (!filtered.length) return alert("No records found for the selected date.");

//   const container = document.createElement("div");
//   const chunkSize = 2;

//   for (let i = 0; i < filtered.length; i += chunkSize) {
//     const page = document.createElement("div");
//     page.className = "print-page";
//     page.style.cssText = "display: flex; flex-wrap: wrap; justify-content: space-between; width: 277mm; height: 190mm; padding: 10mm; background: white; page-break-after: always;";

//     filtered.slice(i, i + chunkSize).forEach(payroll => {
//       const card = document.createElement("div");
//       card.className = "printable-card";
//       card.innerHTML = createPayrollCardHTML(payroll);
//       card.style.cssText = "width: 133mm; height: 100%; box-sizing: border-box; background: white; font-size: 10pt; padding: 8mm;";
//       page.appendChild(card);
//     });

//     container.appendChild(page);
//   }

//   html2pdf().from(container).set({
//     margin: 0,
//     filename: `Payroll_By_Date_${selectedDate}.pdf`,
//     jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
//     pagebreak: { mode: ['avoid-all'] }
//   }).save();
// }

// document.addEventListener("DOMContentLoaded", () => {
//   loadPayrolls();
//   employeeFilter.addEventListener("change", () => { currentPage = 1; filterAndDisplayPayrolls(); });
//   searchInput.addEventListener("input", () => { currentPage = 1; filterAndDisplayPayrolls(); });
//   dateFilter.addEventListener("change", () => { currentPage = 1; filterAndDisplayPayrolls(); });
//   printAllBtn.addEventListener("click", printAllVouchers);
//   document.getElementById("printByDateBtn").addEventListener("click", printPayrollsByDateReleased);
// });

// Firebase config
// Firebase config
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const employeeFilter = document.getElementById("employeeFilter");
const searchInput = document.getElementById("searchInput");
const dateFilter = document.getElementById("dateFilter");
const payrollContainer = document.getElementById("payrollContainer");
const printAllBtn = document.getElementById("printAllBtn");
const paginationControls = document.getElementById("paginationControls");

let allPayrolls = [];
let currentPage = 1;
const pageSize = 4;

// Update the formatCurrency function
function formatCurrency(value, isNetPay = false) {
  const num = parseFloat(value || 0);
  // Format with commas and 2 decimal places
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const pesoSign = isNetPay ? "₱" : "";
  return `<span style="font-weight: bold; float: right; margin-right:10px;">${pesoSign}${formatted}</span>`;
}


function createPayrollCardHTML(payroll, forPrint = false) {
  // Get custom labels or use defaults
  const addonLabels = [
    payroll.addon1Label || "Sunday",
    payroll.addon2Label || "Overtime",
    payroll.addon3Label || "Holiday",
    payroll.addon4Label || "Site Allowance",
    payroll.addon5Label || "Food Allowance"
  ];
  
  const deductionLabels = [
    payroll.deduction1Label || "PhilHealth",
    payroll.deduction2Label || "PAG-IBIG",
    payroll.deduction3Label || "SSS",
    payroll.deduction4Label || "Loan",
    payroll.deduction5Label || "Cash Advance",
    payroll.deduction6Label || "Under Time",
    payroll.deduction7Label || "Late"
  ];

  return `
    <div class="payroll-card">
      <h3>PAY VOUCHER: ${payroll.voucherNumber || "—"}</h3>
      <table>
        <tr><td><strong>DATE RELEASED:</strong></td><td>${payroll.dateReleased || ""}</td></tr>
        <tr><td><strong>EMPLOYEE NAME:</strong></td><td>${payroll.employeeName || ""}</td></tr>
        <tr><td><strong>ID NO:</strong></td><td>${payroll.employeeID || ""}</td></tr>
        <tr><td><strong>DATE COVERED:</strong></td><td>${payroll.dateCovered || ""}</td></tr>
        <tr><td><strong>RATE PER DAY:</strong></td><td>${formatCurrency(payroll.ratePerDay)}</td></tr>
        <tr><td><strong>NUMBER OF DAYS:</strong></td><td>${formatCurrency(payroll.daysWorked)}</td></tr>
        <tr><td><strong>SUB-TOTAL SALARY:</strong></td><td>${formatCurrency(payroll.subTotal)}</td></tr>
        <tr><td><strong>ADD ONS:</strong></td><td>
          <div>${addonLabels[0]}: ${formatCurrency(payroll.sunday)}</div>
          <div>${addonLabels[1]}: ${formatCurrency(payroll.overtime)}</div>
          <div>${addonLabels[2]}: ${formatCurrency(payroll.holiday)}</div>
          <div>${addonLabels[3]}: ${formatCurrency(payroll.siteAllowance)}</div>
          <div>${addonLabels[4]}: ${formatCurrency(payroll.foodAllowance)}</div>
        </td></tr>
        <tr><td><strong>DEDUCTIONS:</strong></td><td>
          <div>${deductionLabels[0]}: ${formatCurrency(payroll.philHealth)}</div>
          <div>${deductionLabels[1]}: ${formatCurrency(payroll.pagibig)}</div>
          <div>${deductionLabels[2]}: ${formatCurrency(payroll.sss)}</div>
          <div>${deductionLabels[3]}: ${formatCurrency(payroll.loan)}</div>
          <div>${deductionLabels[4]}: ${formatCurrency(payroll.cashAdvance)}</div>
          <div>${deductionLabels[5]}: ${formatCurrency(payroll.underTime)}</div>
          <div>${deductionLabels[6]}: ${formatCurrency(payroll.late)}</div>
        </td></tr>
        <tr><td><strong>TOTAL SALARY:</strong></td><td>${formatCurrency(payroll.totalSalary)}</td></tr>
        <tr><td><strong>TOTAL DEDUCTIONS:</strong></td><td>${formatCurrency(payroll.totalDeductions)}</td></tr>
        <tr><td><strong>NET SALARY:</strong></td><td>${formatCurrency(payroll.netSalary, true)}</td></tr>
        <tr><td><strong>REMARKS:</strong></td><td>${payroll.remarks || ""}</td></tr>
      </table>
      ${!forPrint ? `
        <div class="card-actions">
          <button onclick="editPayroll('${payroll.employeeID}','${payroll.firebaseKey}')">✏ Edit</button>
          <button onclick="deletePayroll('${payroll.employeeID}', '${payroll.firebaseKey}', '${payroll.employeeName}')">🗑 Delete</button>
        </div>` : ""}
    </div>
  `;
}

function editPayroll(employeeID, key) {
  window.location.href = `payroll.html?employeeID=${encodeURIComponent(employeeID)}&key=${encodeURIComponent(key)}`;
}

function deletePayroll(employeeID, key, employeeName) {
  if (!confirm(`Are you sure you want to delete the payroll record for ${employeeName}? This action cannot be undone.`)) {
    return;
  }

  const confirmation = prompt(`To confirm, please type the employee's name exactly:\n\n${employeeName}`);
  if (confirmation !== employeeName) {
    alert("Deletion cancelled. The name did not match.");
    return;
  }

  db.ref(`payrolls/${employeeID}/${key}`).remove()
    .then(() => {
      alert("Payroll deleted successfully.");
      loadPayrolls();
    })
    .catch(err => {
      console.error("Error deleting payroll:", err);
      alert("Error deleting payroll. Please try again.");
    });
}

function updatePagination(totalItems) {
  paginationControls.innerHTML = "";
  const totalPages = Math.ceil(totalItems / pageSize);
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.addEventListener("click", () => {
      currentPage = i;
      filterAndDisplayPayrolls();
    });
    paginationControls.appendChild(btn);
  }
}

function displayPayrolls(dataArray) {
  payrollContainer.innerHTML = "";

  const start = (currentPage - 1) * pageSize;
  const pageItems = dataArray.slice(start, start + pageSize);

  pageItems.forEach(payroll => {
    const div = document.createElement("div");
    div.className = "payroll-card";
    div.innerHTML = createPayrollCardHTML(payroll);
    payrollContainer.appendChild(div);
  });

  updatePagination(dataArray.length);
}

function populateFilterOptions(data) {
  const employeeIDs = Object.keys(data);
  employeeFilter.innerHTML = `<option value="all">All Employees</option>`;
  employeeIDs.forEach(empID => {
    const sample = Object.values(data[empID])[0];
    const name = sample?.employeeName || empID;
    const option = document.createElement("option");
    option.value = empID;
    option.textContent = name;
    employeeFilter.appendChild(option);
  });
}

function filterAndDisplayPayrolls() {
  const filterID = employeeFilter.value;
  const searchTerm = searchInput.value.toLowerCase();
  const selectedDate = dateFilter.value;

  let filtered = [...allPayrolls];

  if (filterID !== "all") {
    filtered = filtered.filter(p => p.employeeID === filterID);
  }

  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.employeeName?.toLowerCase().includes(searchTerm) ||
      p.employeeID?.toLowerCase().includes(searchTerm) ||
      p.remarks?.toLowerCase().includes(searchTerm) ||
      p.voucherNumber?.toLowerCase().includes(searchTerm)
    );
  }

  if (selectedDate) {
    filtered = filtered.filter(p => p.dateReleased === selectedDate);
  }

  if (currentPage > Math.ceil(filtered.length / pageSize)) {
    currentPage = 1;
  }

  displayPayrolls(filtered);
}

function loadPayrolls() {
  db.ref("payrolls").on("value", snapshot => {
    const data = snapshot.val() || {};
    populateFilterOptions(data);
    allPayrolls = [];

    Object.entries(data).forEach(([empID, payrolls]) => {
      Object.entries(payrolls).forEach(([key, payroll]) => {
        allPayrolls.push({
          ...payroll,
          employeeID: empID,
          firebaseKey: key
        });
      });
    });

    allPayrolls.sort((a, b) => {
      const aNum = parseInt((a.voucherNumber || "PV-00000").replace("PV-", ""), 10);
      const bNum = parseInt((b.voucherNumber || "PV-00000").replace("PV-", ""), 10);
      return aNum - bNum;
    });

    filterAndDisplayPayrolls();
  }, error => {
    console.error("Error loading payrolls:", error);
    payrollContainer.innerHTML = "<p>Error loading payrolls.</p>";
  });
}

function printAllVouchers() {
  const container = document.createElement("div");
  container.style.cssText = "width: 100%;";

  for (let i = 0; i < allPayrolls.length; i += 2) {
    const page = document.createElement("div");
    page.className = "print-page";
    page.style.cssText = `
      display: flex;
      justify-content: space-between;
      width: 277mm;
      height: 190mm;
      padding: 8mm;
      box-sizing: border-box;
      page-break-after: always;
    `;

    if (allPayrolls[i]) {
      const card1 = createCompactPrintableCard(allPayrolls[i]);
      card1.style.cssText = `
        width: 125mm;
        height: 174mm;
        border: 1px solid #000;
        padding: 4mm;
        font-family: Arial, sans-serif;
        font-size: 9pt;
        overflow: hidden;
        box-sizing: border-box;
      `;
      page.appendChild(card1);
    }

    if (allPayrolls[i + 1]) {
      const card2 = createCompactPrintableCard(allPayrolls[i + 1]);
      card2.style.cssText = `
        width: 125mm;
        height: 174mm;
        border: 1px solid #000;
        padding: 4mm;
        font-family: Arial, sans-serif;
        font-size: 9pt;
        overflow: hidden;
        box-sizing: border-box;
      `;
      page.appendChild(card2);
    }

    container.appendChild(page);
  }

  html2pdf().from(container).set({
    margin: 0,
    filename: "Payroll_Vouchers.pdf",
    jsPDF: { 
      unit: "mm", 
      format: "a4", 
      orientation: "landscape"
    },
    pagebreak: { 
      mode: ['css'], 
      avoid: '.printable-card' 
    }
  }).save();
}

function createCompactPrintableCard(payroll) {
  // Get custom labels or use defaults
  const addonLabels = [
    payroll.addon1Label || "Sunday",
    payroll.addon2Label || "Overtime",
    payroll.addon3Label || "Holiday",
    payroll.addon4Label || "Site Allowance",
    payroll.addon5Label || "Food Allowance"
  ];
  
  const deductionLabels = [
    payroll.deduction1Label || "PhilHealth",
    payroll.deduction2Label || "PAG-IBIG",
    payroll.deduction3Label || "SSS",
    payroll.deduction4Label || "Loan",
    payroll.deduction5Label || "Cash Advance",
    payroll.deduction6Label || "Under Time",
    payroll.deduction7Label || "Late"
  ];

// Update the formatCurrencyForPrint function (inside createCompactPrintableCard)
const formatCurrencyForPrint = (value, isNetPay = false) => {
  const num = parseFloat(value || 0);
  // Format with commas and 2 decimal places
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const pesoSign = isNetPay ? "₱" : "";
  return `<span style="font-weight: bold; text-align: right; float: right; margin-right: 50px;">${pesoSign}${formatted}</span>`;
};

  const card = document.createElement("div");
  card.style.cssText = `
    border: 1px solid #007bff;
    padding: 4mm;
    height: 174mm;
    box-sizing: border-box;
  `;
  
  card.innerHTML = `
    <div style="display: flex; align-items: center; margin-bottom: 3mm; border-bottom: 1px solid rgb(0, 0, 0); padding-bottom: 2mm;">
      <img src="ravi_logo.png" style="height: 25mm; width: auto; margin-right: 5mm;">
      <div>
        <div style="font-size: 11pt; font-weight: bold; margin-bottom: 1mm; color: #007bff;">PAY VOUCHER: ${payroll.voucherNumber || "—"}</div>
        <div style="font-size: 10pt; color: #333;">DATE RELEASED: ${payroll.dateReleased || ""}</div>
      </div>
    </div>
    
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">EMPLOYEE NAME:</strong> ${payroll.employeeName || ""}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">ID NO:</strong> ${payroll.employeeID || ""}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">DATE COVERED:</strong> ${payroll.dateCovered || ""}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">RATE PER DAY:</strong> ${formatCurrencyForPrint(payroll.ratePerDay)}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">NUMBER OF DAYS:</strong> ${formatCurrencyForPrint(payroll.daysWorked)}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">SUB-TOTAL SALARY:</strong> ${formatCurrencyForPrint(payroll.subTotal)}
    </div>
    
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">ADD ONS:</strong><br>
      <div style="margin-left: 8mm;">
        <div>${addonLabels[0]}: ${formatCurrencyForPrint(payroll.sunday)}</div>
        <div>${addonLabels[1]}: ${formatCurrencyForPrint(payroll.overtime)}</div>
        <div>${addonLabels[2]}: ${formatCurrencyForPrint(payroll.holiday)}</div>
        <div>${addonLabels[3]}: ${formatCurrencyForPrint(payroll.siteAllowance)}</div>
        <div>${addonLabels[4]}: ${formatCurrencyForPrint(payroll.foodAllowance)}</div>
      </div>
    </div>
    
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">DEDUCTIONS:</strong><br>
      <div style="margin-left: 8mm;">
        <div>${deductionLabels[0]}: ${formatCurrencyForPrint(payroll.philHealth)}</div>
        <div>${deductionLabels[1]}: ${formatCurrencyForPrint(payroll.pagibig)}</div>
        <div>${deductionLabels[2]}: ${formatCurrencyForPrint(payroll.sss)}</div>
        <div>${deductionLabels[3]}: ${formatCurrencyForPrint(payroll.loan)}</div>
        <div>${deductionLabels[4]}: ${formatCurrencyForPrint(payroll.cashAdvance)}</div>
        <div>${deductionLabels[5]}: ${formatCurrencyForPrint(payroll.underTime)}</div>
        <div>${deductionLabels[6]}: ${formatCurrencyForPrint(payroll.late)}</div>
      </div>
    </div>
    
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">TOTAL SALARY:</strong> ${formatCurrencyForPrint(payroll.totalSalary)}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">TOTAL DEDUCTIONS:</strong> ${formatCurrencyForPrint(payroll.totalDeductions)}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">NET SALARY:</strong> ${formatCurrencyForPrint(payroll.netSalary, true)}
    </div>
    <div style="margin-bottom: 2mm; color: #444;">
      <strong style="color:rgb(0, 0, 0);">REMARKS:</strong> ${payroll.remarks || ""}
    </div>
  `;
  return card;
}

function printPayrollsByDateReleased() {
  const selectedDate = dateFilter.value;
  if (!selectedDate) return alert("Please select a date.");

  const filtered = allPayrolls.filter(p => p.dateReleased === selectedDate);
  if (!filtered.length) return alert("No records found for the selected date.");

  const container = document.createElement("div");
  container.style.cssText = "width: 100%;";

  for (let i = 0; i < filtered.length; i += 2) {
    const page = document.createElement("div");
    page.className = "print-page";
    page.style.cssText = `
      display: flex;
      justify-content: space-between;
      width: 277mm;
      height: 190mm;
      padding: 8mm;
      box-sizing: border-box;
      page-break-after: always;
    `;

    if (filtered[i]) {
      const card1 = createCompactPrintableCard(filtered[i]);
      card1.style.cssText = `
        width: 125mm;
        height: 174mm;
        border: 1px solid #000;
        padding: 4mm;
        font-family: Arial, sans-serif;
        font-size: 9pt;
        overflow: hidden;
        box-sizing: border-box;
      `;
      page.appendChild(card1);
    }

    if (filtered[i + 1]) {
      const card2 = createCompactPrintableCard(filtered[i + 1]);
      card2.style.cssText = `
        width: 125mm;
        height: 174mm;
        border: 1px solid #000;
        padding: 4mm;
        font-family: Arial, sans-serif;
        font-size: 9pt;
        overflow: hidden;
        box-sizing: border-box;
      `;
      page.appendChild(card2);
    }

    container.appendChild(page);
  }

  html2pdf().from(container).set({
    margin: 0,
    filename: `Payroll_Vouchers_${selectedDate}.pdf`,
    jsPDF: { 
      unit: "mm", 
      format: "a4", 
      orientation: "landscape"
    },
    pagebreak: { 
      mode: ['css'], 
      avoid: '.printable-card' 
    }
  }).save();
}

document.addEventListener("DOMContentLoaded", () => {
  loadPayrolls();
  employeeFilter.addEventListener("change", () => { currentPage = 1; filterAndDisplayPayrolls(); });
  searchInput.addEventListener("input", () => { currentPage = 1; filterAndDisplayPayrolls(); });
  dateFilter.addEventListener("change", () => { currentPage = 1; filterAndDisplayPayrolls(); });
  printAllBtn.addEventListener("click", printAllVouchers);
  document.getElementById("printByDateBtn").addEventListener("click", printPayrollsByDateReleased);
});