import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, set, remove, onValue } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

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
const employeesRef = ref(db, 'employees');

// DOM elements
const employeeForm = document.getElementById('employeeForm');
const nameInput = document.getElementById('name');
const idInput = document.getElementById('id');
const rateInput = document.getElementById('rate');
const sssInput = document.getElementById('sss');
const siteAllowanceInput = document.getElementById('siteAllowance');
const foodAllowanceInput = document.getElementById('foodAllowance');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const employeeTable = document.getElementById('employeeTable').getElementsByTagName('tbody')[0];
const notification = document.getElementById('notification');

let currentEmployeeId = null;

function showNotification(message, isSuccess) {
  notification.textContent = message;
  notification.className = `notification ${isSuccess ? 'success' : 'error'}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 5000);
}

function loadEmployees(searchTerm = '') {
  onValue(employeesRef, (snapshot) => {
    employeeTable.innerHTML = '';
    const employees = snapshot.val() || {};

    Object.keys(employees).forEach(id => {
      const employee = employees[id];
      if (searchTerm &&
        !employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !employee.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return;
      }
      const row = employeeTable.insertRow();
      row.insertCell(0).textContent = employee.name;
      row.insertCell(1).textContent = employee.id;
      row.insertCell(2).textContent = `₱${employee.rate.toFixed(2)}`;
      const actionCell = row.insertCell(3);
      actionCell.className = 'action-buttons';

      const editBtn = document.createElement('button');
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => editEmployee(id, employee));

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'btn-danger';
      deleteBtn.addEventListener('click', () => deleteEmployee(id));

      actionCell.appendChild(editBtn);
      actionCell.appendChild(deleteBtn);
    });
  });
}

function editEmployee(id, employee) {
  currentEmployeeId = id;
  nameInput.value = employee.name;
  idInput.value = employee.id;
  rateInput.value = employee.rate;
  sssInput.value = employee.sss;
  siteAllowanceInput.value = employee.siteAllowance;
  foodAllowanceInput.value = employee.foodAllowance;
  saveBtn.textContent = 'Update Employee';
  window.scrollTo(0, 0);
}

function deleteEmployee(id) {
  if (confirm('Are you sure you want to delete this employee?')) {
    remove(ref(db, `employees/${id}`))
      .then(() => showNotification('Employee deleted successfully!', true))
      .catch(error => showNotification('Error deleting employee: ' + error.message, false));
  }
}

function clearForm() {
  employeeForm.reset();
  currentEmployeeId = null;
  saveBtn.textContent = 'Save Employee';
}

employeeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const employee = {
    name: nameInput.value.trim(),
    id: idInput.value.trim(),
    rate: parseFloat(rateInput.value),
    sss: parseFloat(sssInput.value) || 0,
    siteAllowance: parseFloat(siteAllowanceInput.value) || 0,
    foodAllowance: parseFloat(foodAllowanceInput.value) || 0
  };

  if (!employee.name || !employee.id || isNaN(employee.rate)) {
    showNotification('Please fill in all required fields with valid data', false);
    return;
  }

  const employeeId = currentEmployeeId || employee.id;

  set(ref(db, `employees/${employeeId}`), employee)
    .then(() => {
      showNotification(`Employee ${currentEmployeeId ? 'updated' : 'added'} successfully!`, true);
      clearForm();
    })
    .catch(error => showNotification('Error saving employee: ' + error.message, false));
});

clearBtn.addEventListener('click', clearForm);

cancelEditBtn.addEventListener('click', () => {
  clearForm();
  showNotification('Edit cancelled. Form reset.', true);
});


// Instead of waiting for Enter, search on every input
searchInput.addEventListener('input', () => {
  loadEmployees(searchInput.value.trim());
});

// Keep the Search button if you want
searchBtn.addEventListener('click', () => {
  loadEmployees(searchInput.value.trim());
});

loadEmployees();
