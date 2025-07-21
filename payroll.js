// document.addEventListener("DOMContentLoaded", function () {
//   const employeeName = localStorage.getItem("selectedEmployeeName") || "";
//   const employeeID = localStorage.getItem("selectedEmployeeID") || "";

//   const employees = [
//     { name: "MELVIN TAYTAYON", id: "08012022-03", rate: 961.54, sss: 900.00, siteAllowance: 600.00, foodAllowance: 700.00 },
//     { name: "BARTOLOME BANTOG", id: "01032024-15", rate: 769.93, sss: 720.00, siteAllowance: 400.00, foodAllowance: 700.00 },
//     { name: "RONNIE ROCHA", id: "07012023-07", rate: 769.93, sss: 720.00, siteAllowance: 0.00, foodAllowance: 700.00 },
//     { name: "ENRIQUE JAVIER JR", id: "01032024-14", rate: 650.00, sss: 720.00, siteAllowance: 0.00, foodAllowance: 700.00 },
//     { name: "CARLO CASTRO", id: "01032024-13", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 700.00 },
//     { name: "JESSIE LOZADA", id: "01032024-17", rate: 769.23, sss: 720.00, siteAllowance: 200.00, foodAllowance: 700.00 },
//     { name: "MARVIN ROCHA", id: "01032024-18", rate: 650.93, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
//     { name: "FRENCES CARPIO", id: "03252025-35", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
//     { name: "ANGELITO VALMORIA", id: "01032024-32", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
//     { name: "EUGENE TAYTAYON", id: "01032024-33", rate: 769.23, sss: 0.00, siteAllowance: 0.00, foodAllowance: 770.00 },
//     { name: "NOLI ESCATE", id: "03252025-34", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
//     { name: "DOLAND ROCHA", id: "06132025-36", rate: 692.31, sss: 0.00, siteAllowance: 0.00, foodAllowance: 770.00 },
//     { name: "DOMINIC RAMOS", id: "01032024-27", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 }
//   ];

//   document.getElementById("employeeName").value = employeeName;
//   document.getElementById("idNumber").value = employeeID;

//   const selectedEmployee = employees.find(emp => emp.name === employeeName && emp.id === employeeID);
//   if (selectedEmployee) {
//     document.getElementById("ratePerDay").value = selectedEmployee.rate.toFixed(2);
//     document.getElementById("sss").value = selectedEmployee.sss.toFixed(2);
//     document.getElementById("siteAllowance").value = selectedEmployee.siteAllowance.toFixed(2);
//     document.getElementById("foodAllowance").value = selectedEmployee.foodAllowance.toFixed(2);
//   }

//   document.querySelectorAll("input").forEach(input => {
//     input.addEventListener("input", calculatePayroll);
//   });

//   function calculatePayroll() {
//     const rate = parseFloat(document.getElementById("ratePerDay").value) || 0;
//     const daysWorked = parseFloat(document.getElementById("daysWorked").value) || 0;
//     const sunday = parseFloat(document.getElementById("sunday").value) || 0;
//     const overtime = parseFloat(document.getElementById("overtime").value) || 0;
//     const holiday = parseFloat(document.getElementById("holiday").value) || 0;
//     const siteAllowance = parseFloat(document.getElementById("siteAllowance").value) || 0;
//     const foodAllowance = parseFloat(document.getElementById("foodAllowance").value) || 0;

//     const philHealth = parseFloat(document.getElementById("philHealth").value) || 0;
//     const pagibig = parseFloat(document.getElementById("pagibig").value) || 0;
//     const sss = parseFloat(document.getElementById("sss").value) || 0;
//     const loan = parseFloat(document.getElementById("loan").value) || 0;
//     const cashAdvance = parseFloat(document.getElementById("cashAdvance").value) || 0;
//     const underTime = parseFloat(document.getElementById("underTime").value) || 0;
//     const late = parseFloat(document.getElementById("late").value) || 0;

//     const subTotal = rate * daysWorked;
//     const totalSalary = subTotal + sunday + overtime + holiday + siteAllowance + foodAllowance;
//     const totalDeductions = philHealth + pagibig + sss + loan + cashAdvance + underTime + late;
//     const netSalary = totalSalary - totalDeductions;

//     document.getElementById("subTotal").value = subTotal.toFixed(2);
//     document.getElementById("totalSalary").value = totalSalary.toFixed(2);
//     document.getElementById("totalDeductions").value = totalDeductions.toFixed(2);
//     document.getElementById("netSalary").value = netSalary.toFixed(2);
//   }

//   document.getElementById("payrollForm").addEventListener("submit", function (e) {
//     e.preventDefault();

//     const payrollData = {
//       employeeName: document.getElementById("employeeName").value,
//       employeeID: document.getElementById("idNumber").value,
//       dateCovered: document.getElementById("dateCovered").value,
//       dateReleased: document.getElementById("dateReleased").value,
//       ratePerDay: parseFloat(document.getElementById("ratePerDay").value),
//       daysWorked: parseFloat(document.getElementById("daysWorked").value),
//       subTotal: parseFloat(document.getElementById("subTotal").value),
//       sunday: parseFloat(document.getElementById("sunday").value) || 0,
//       overtime: parseFloat(document.getElementById("overtime").value) || 0,
//       holiday: parseFloat(document.getElementById("holiday").value) || 0,
//       siteAllowance: parseFloat(document.getElementById("siteAllowance").value) || 0,
//       foodAllowance: parseFloat(document.getElementById("foodAllowance").value) || 0,
//       philHealth: parseFloat(document.getElementById("philHealth").value) || 0,
//       pagibig: parseFloat(document.getElementById("pagibig").value) || 0,
//       sss: parseFloat(document.getElementById("sss").value) || 0,
//       loan: parseFloat(document.getElementById("loan").value) || 0,
//       cashAdvance: parseFloat(document.getElementById("cashAdvance").value) || 0,
//       underTime: parseFloat(document.getElementById("underTime").value) || 0,
//       late: parseFloat(document.getElementById("late").value) || 0,
//       totalSalary: parseFloat(document.getElementById("totalSalary").value),
//       totalDeductions: parseFloat(document.getElementById("totalDeductions").value),
//       netSalary: parseFloat(document.getElementById("netSalary").value),
//       remarks: document.getElementById("remarks").value
//     };

//     const counterRef = firebase.database().ref("voucherCounter");
//     const employeeID = payrollData.employeeID;
//     const employeePayrollRef = firebase.database().ref("payrolls/" + employeeID);

//     counterRef.transaction(current => (current || 0) + 1).then(result => {
//       const newVoucherNum = result.snapshot.val();
//       payrollData.voucherNumber = `PV-${String(newVoucherNum).padStart(5, "0")}`;
//       return employeePayrollRef.push(payrollData);
//     }).then(() => {
//       alert("Payroll saved successfully.");
//       window.location.href = "dashboard.html";
//     }).catch(err => {
//       console.error("Error saving payroll:", err);
//       alert("Error saving payroll. Please try again.");
//     });
//   });

//   flatpickr("#dateCovered", {
//     mode: "range",
//     dateFormat: "F j, Y",
//     onClose: function (selectedDates, dateStr, instance) {
//       if (selectedDates.length === 2) {
//         const start = selectedDates[0];
//         const end = selectedDates[1];
//         const formatted = `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} to ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
//         instance.input.value = formatted;
//       }
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", function () {
  // Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyAI1Qh4eL5xS5w6_cqKA1iN8fFaCrddw8o",
    authDomain: "ravi-payroll.firebaseapp.com",
    databaseURL: "https://ravi-payroll-default-rtdb.firebaseio.com",
    projectId: "ravi-payroll",
    storageBucket: "ravi-payroll.appspot.com",
    messagingSenderId: "228526283867",
    appId: "1:228526283867:web:39cc6d842bb2b991be737e"
  };
  firebase.initializeApp(firebaseConfig);

  const params = new URLSearchParams(window.location.search);
  const editEmployeeID = params.get("employeeID");
  const editKey = params.get("key");
  const isEdit = editEmployeeID && editKey;

  const employeeName = localStorage.getItem("selectedEmployeeName") || "";
  const employeeID = localStorage.getItem("selectedEmployeeID") || "";

  const employees = [
    { name: "MELVIN CUARE TAYTAYON", id: "08012022-03", rate: 961.54, sss: 900.00, siteAllowance: 600.00, foodAllowance: 700.00 },
    { name: "BARTOLOME RIVERO BANTOG JR.", id: "01032024-15", rate: 769.93, sss: 720.00, siteAllowance: 400.00, foodAllowance: 700.00 },
    { name: "REMEGIO VILLIANA ROCHA", id: "07012023-07", rate: 769.93, sss: 720.00, siteAllowance: 0.00, foodAllowance: 700.00 },
    { name: "ENRIQUE FLOR JAVIER JR.", id: "01032024-14", rate: 650.00, sss: 720.00, siteAllowance: 0.00, foodAllowance: 700.00 },
    { name: "JUAN CARLO REFORMA CASTRO", id: "01032024-13", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 700.00 },
    { name: "JESSIE VITUG LOZADA JR.", id: "01032024-17", rate: 769.23, sss: 0.00, siteAllowance: 200.00, foodAllowance: 700.00 },
    { name: "MARVIN DEL MUNDO ROCHA", id: "01032024-18", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
    { name: "FRENCES MANIPON CARPIO", id: "03252025-35", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
    { name: "ANGELITO REYES VALMORIA", id: "01032024-32", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
    { name: "EUGENE CUARE TAYTAYON", id: "01032024-33", rate: 769.23, sss: 0.00, siteAllowance: 0.00, foodAllowance: 700.00 },
    { name: "NOLI ESCOTA", id: "03252025-34", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 },
    { name: "ROLANDO VILLIANA ROCHA", id: "05302025-34", rate: 692.31, sss: 0.00, siteAllowance: 0.00, foodAllowance: 700.00 },
    { name: "DOMINIC OCTUBRE RAMOS", id: "01032024-27", rate: 650.00, sss: 0.00, siteAllowance: 0.00, foodAllowance: 0.00 }
  ];

  // Prefill form
  document.getElementById("employeeName").value = employeeName;
  document.getElementById("idNumber").value = employeeID;

  if (!isEdit) {
    // Only load default rates in create mode
    const selectedEmployee = employees.find(emp => emp.name === employeeName && emp.id === employeeID);
    if (selectedEmployee) {
      document.getElementById("ratePerDay").value = selectedEmployee.rate.toFixed(2);
      document.getElementById("sss").value = selectedEmployee.sss.toFixed(2);
      document.getElementById("siteAllowance").value = selectedEmployee.siteAllowance.toFixed(2);
      document.getElementById("foodAllowance").value = selectedEmployee.foodAllowance.toFixed(2);
    }
  } else {
    // Edit mode: load payroll data from Firebase
    firebase.database().ref(`payrolls/${editEmployeeID}/${editKey}`).once("value").then(snapshot => {
      const data = snapshot.val();
      if (data) {
        // Prefill all fields
        Object.keys(data).forEach(key => {
          const el = document.getElementById(key);
          if (el) el.value = data[key];
        });
        
        // Prefill custom labels if they exist in the data
        for (let i = 1; i <= 7; i++) {
          const labelKey = `deduction${i}Label`;
          if (data[labelKey]) {
            document.getElementById(labelKey).value = data[labelKey];
          }
        }
        for (let i = 1; i <= 5; i++) {
          const labelKey = `addon${i}Label`;
          if (data[labelKey]) {
            document.getElementById(labelKey).value = data[labelKey];
          }
        }
      }
    });
  }

  document.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", calculatePayroll);
  });

  function calculatePayroll() {
    const rate = parseFloat(document.getElementById("ratePerDay").value) || 0;
    const daysWorked = parseFloat(document.getElementById("daysWorked").value) || 0;
    const sunday = parseFloat(document.getElementById("sunday").value) || 0;
    const overtime = parseFloat(document.getElementById("overtime").value) || 0;
    const holiday = parseFloat(document.getElementById("holiday").value) || 0;
    const siteAllowance = parseFloat(document.getElementById("siteAllowance").value) || 0;
    const foodAllowance = parseFloat(document.getElementById("foodAllowance").value) || 0;
    const philHealth = parseFloat(document.getElementById("philHealth").value) || 0;
    const pagibig = parseFloat(document.getElementById("pagibig").value) || 0;
    const sss = parseFloat(document.getElementById("sss").value) || 0;
    const loan = parseFloat(document.getElementById("loan").value) || 0;
    const cashAdvance = parseFloat(document.getElementById("cashAdvance").value) || 0;
    const underTime = parseFloat(document.getElementById("underTime").value) || 0;
    const late = parseFloat(document.getElementById("late").value) || 0;

    const subTotal = rate * daysWorked;
    const totalSalary = subTotal + sunday + overtime + holiday + siteAllowance + foodAllowance;
    const totalDeductions = philHealth + pagibig + sss + loan + cashAdvance + underTime + late;
    const netSalary = totalSalary - totalDeductions;

    document.getElementById("subTotal").value = subTotal.toFixed(2);
    document.getElementById("totalSalary").value = totalSalary.toFixed(2);
    document.getElementById("totalDeductions").value = totalDeductions.toFixed(2);
    document.getElementById("netSalary").value = netSalary.toFixed(2);
  }

  document.getElementById("payrollForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // Collect all form data including custom labels
    const payrollData = {
      employeeName: document.getElementById("employeeName").value,
      employeeID: document.getElementById("idNumber").value,
      dateCovered: document.getElementById("dateCovered").value,
      dateReleased: document.getElementById("dateReleased").value,
      ratePerDay: parseFloat(document.getElementById("ratePerDay").value),
      daysWorked: parseFloat(document.getElementById("daysWorked").value),
      subTotal: parseFloat(document.getElementById("subTotal").value),
      sunday: parseFloat(document.getElementById("sunday").value) || 0,
      overtime: parseFloat(document.getElementById("overtime").value) || 0,
      holiday: parseFloat(document.getElementById("holiday").value) || 0,
      siteAllowance: parseFloat(document.getElementById("siteAllowance").value) || 0,
      foodAllowance: parseFloat(document.getElementById("foodAllowance").value) || 0,
      philHealth: parseFloat(document.getElementById("philHealth").value) || 0,
      pagibig: parseFloat(document.getElementById("pagibig").value) || 0,
      sss: parseFloat(document.getElementById("sss").value) || 0,
      loan: parseFloat(document.getElementById("loan").value) || 0,
      cashAdvance: parseFloat(document.getElementById("cashAdvance").value) || 0,
      underTime: parseFloat(document.getElementById("underTime").value) || 0,
      late: parseFloat(document.getElementById("late").value) || 0,
      totalSalary: parseFloat(document.getElementById("totalSalary").value),
      totalDeductions: parseFloat(document.getElementById("totalDeductions").value),
      netSalary: parseFloat(document.getElementById("netSalary").value),
      remarks: document.getElementById("remarks").value
    };

    // Add custom labels to the data
    for (let i = 1; i <= 7; i++) {
      payrollData[`deduction${i}Label`] = document.getElementById(`deduction${i}Label`).value;
    }
    for (let i = 1; i <= 5; i++) {
      payrollData[`addon${i}Label`] = document.getElementById(`addon${i}Label`).value;
    }

    if (isEdit) {
      // Edit mode: keep existing voucherNumber
      firebase.database().ref(`payrolls/${editEmployeeID}/${editKey}`).once("value").then(snapshot => {
        payrollData.voucherNumber = snapshot.val().voucherNumber;
        return firebase.database().ref(`payrolls/${editEmployeeID}/${editKey}`).set(payrollData);
      }).then(() => {
        alert("Payroll updated successfully.");
        window.location.href = "dashboard.html";
      }).catch(err => {
        console.error("Error updating payroll:", err);
        alert("Error updating payroll. Please try again.");
      });
    } else {
      // Create mode
      const counterRef = firebase.database().ref("voucherCounter");
      const employeeID = payrollData.employeeID;
      const employeePayrollRef = firebase.database().ref("payrolls/" + employeeID);
      counterRef.transaction(current => (current || 0) + 1).then(result => {
        const newVoucherNum = result.snapshot.val();
        payrollData.voucherNumber = `PV-${String(newVoucherNum).padStart(5, "0")}`;
        return employeePayrollRef.push(payrollData);
      }).then(() => {
        alert("Payroll saved successfully.");
        window.location.href = "dashboard.html";
      }).catch(err => {
        console.error("Error saving payroll:", err);
        alert("Error saving payroll. Please try again.");
      });
    }
  });

  flatpickr("#dateCovered", {
    mode: "range",
    dateFormat: "F j, Y",
    onClose: function (selectedDates, dateStr, instance) {
      if (selectedDates.length === 2) {
        const start = selectedDates[0];
        const end = selectedDates[1];
        const formatted = `${start.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} to ${end.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`;
        instance.input.value = formatted;
      }
    }
  });
});