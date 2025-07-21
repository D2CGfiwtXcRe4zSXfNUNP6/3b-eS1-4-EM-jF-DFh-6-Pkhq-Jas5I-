import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
  const tbody = document.querySelector("#employeeTable tbody");
  const searchBox = document.getElementById("searchBox");
  const employeeCount = document.getElementById("employeeCount"); // ✅ counter span
  let employees = [];

  function createPayroll(name, id) {
    localStorage.setItem("selectedEmployeeName", name);
    localStorage.setItem("selectedEmployeeID", id);
    window.location.href = "payroll.html";
  }

  function renderEmployeeTable(list) {
    tbody.innerHTML = "";
    list.forEach(employee => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = employee.name;

      const idCell = document.createElement("td");
      idCell.textContent = employee.id;

      const actionCell = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = "Create Payroll";
      btn.className = "action-btn create-btn";
      btn.addEventListener("click", () => {
        createPayroll(employee.name, employee.id);
      });

      actionCell.appendChild(btn);
      row.appendChild(nameCell);
      row.appendChild(idCell);
      row.appendChild(actionCell);
      tbody.appendChild(row);
    });

    // ✅ Update counter every render
    employeeCount.textContent = list.length;
  }

  // Fetch from Firebase
  const employeesRef = ref(db, 'employees');
  onValue(employeesRef, snapshot => {
    const data = snapshot.val();
    if (data) {
      employees = Object.values(data);

      // Manual order list
      const manualOrder = [
        "08012022-03", "01032024-15", "07012023-07", "01032024-14", "01032024-13",
        "01032024-17", "01032024-18", "03252025-35", "01032024-32", "01032024-33",
        "03252025-34", "06132025-36", "05302025-34", "01032024-27"
      ];

      // Sort by manual order
      employees.sort((a, b) => {
        const indexA = manualOrder.indexOf(a.id);
        const indexB = manualOrder.indexOf(b.id);
        return indexA - indexB;
      });

      renderEmployeeTable(employees);
    } else {
      // If no data, clear counter too
      employeeCount.textContent = 0;
    }
  });

  // Search filter
  searchBox.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(query)
    );
    renderEmployeeTable(filtered);
  });

  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", function () {
    window.location.href = "index.html";
  });
});
