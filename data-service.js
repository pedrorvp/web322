const fs = require('fs');
let employees = [];
let departments = [];

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/employees.json', (err, data) => {
      if (err) {
        reject(err);
      }
      employees = JSON.parse(data);
      resolve();
    });
    fs.readFile('./data/departments.json', (err, data) => {
      if (err) {
        reject(err);
      }
      departments = JSON.parse(data);
      resolve();
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    if (employees.length == 0) {
      reject('No Employee Found!');
    }
    resolve(employees);
  });
};

module.exports.getManagers = function () {
  return new Promise((resolve, reject) => {
    var managers = [];
    for (let i = 0; i < employees.length; i++) {
      if (employees[i].isManager == true) {
        managers.push(employees[i]);
      }
    }
    if (managers.length == 0) {
      reject('No Managers Found!');
    }
    resolve(employees);
  });
};

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    if (departments.length == 0) {
      reject('No Department Found!');
    }
    resolve(departments);
  });
};

module.exports.addEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    if (employeeData.isManager === undefined) {
      employeeData.isManager = false;
    } else {
      employeeData.isManager = true;    
    }

    employeeData.employeeNum = employees.length + 1;
    employees.push(employeeData);
    resolve();
  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise((resolve, reject) => {
    console.log('here!!')
    const filteredEmployees = employees.filter((employee) => (employee.status === status))
    console.log(filteredEmployees.length)
    if(filteredEmployees.length === 0)
      reject({ message: 'No employees found.' });
    
    resolve(filteredEmployees);
  });
};

module.exports.getEmployeesByDepartment = function (department) {
  return new Promise((resolve, reject) => {
    const filteredEmployees = employees.filter((employee) => (employee.department === department))
    
    console.log(filteredEmployees.length)
    if(filteredEmployees.length === 0)
      reject({ message: 'No employees found.' });
    
    resolve(filteredEmployees);
  });
};

module.exports.getEmployeesByManager = function (manager) {
  return new Promise((resolve, reject) => {
    const filteredEmployees = employees.filter((employee) => (employee.employeeManagerNum === manager))
    
    console.log(filteredEmployees.length)
    if(filteredEmployees.length === 0)
      reject({ message: 'No employees found.' });
    
    resolve(filteredEmployees);
  });
};

module.exports.getEmployeeByNum = function (num) {
  return new Promise((resolve, reject) => {
    const filteredEmployees = employees.filter((employee) => (employee.employeeNum === num))
    
    console.log(filteredEmployees.length)
    if(filteredEmployees.length === 0)
      reject({ message: 'No employees found.' });
    
    resolve(filteredEmployees);
  });
};