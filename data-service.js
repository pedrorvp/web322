const fs = require('fs');
const { INTEGER } = require('sequelize');

const Sequelize = require('sequelize');
const sequelize = new Sequelize('d55m4arsd1gpg5', 'zpgxkvriejzvpj', '69925e52af58a33ccab7cab8c02b54bed9e073c6b390d17749f87cdd035fe38c', {
 host: 'ec2-52-20-194-52.compute-1.amazonaws.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: { rejectUnauthorized: false }
 }
});

sequelize
  .authenticate()
  .then(function() {
      console.log('Connection has been established successfully.');
  })
  .catch(function(err) {
      console.log('Unable to connect to the database:', err);
  });

const Employee = sequelize.define('employee', {
  employeeId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },  
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  SSN: Sequelize.STRING,
  addressStreet: Sequelize.STRING,
  addressCity: Sequelize.STRING,
  addressState: Sequelize.STRING,
  addressPostal: Sequelize.STRING,
  martialStatus: Sequelize.STRING,
  isManager: Sequelize.BOOLEAN,
  employeeManagerNum: Sequelize.INTEGER,
  status: Sequelize.STRING,
  hireDate: Sequelize.STRING,
});

const Department = sequelize.define('department', {
  departmentId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true 
  },
  departmentName: Sequelize.STRING
});

Department.hasMany(Employee, {foreignKey: 'department'});

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(function () {
      resolve('synced successfully!')
    }).catch(function() {
      reject("unable to sync the database");
    });
  });
};

module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    Employee.findAll().then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      resolve(dt);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.getManagers = function () {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        isManager: true
      }
    }).then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      resolve(dt);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.addDepartment = function (departmentData) {
  return new Promise((resolve, reject) => {
    
    for([key, value] of Object.entries(departmentData)) {
      if(value == '') {
        departmentData[key] = null;
      }
    }

    console.log(departmentData)

    Department.create(departmentData).then(function(){ 
      resolve();
    }).catch(function() {
      reject("Unable to create department");
    });

  });
};

module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    Department.findAll().then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      resolve(dt);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.getDepartmentById = function (id) {
  return new Promise((resolve, reject) => {
    Department.findAll({
      where: {
        departmentId: id
      }
    }).then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      resolve(dt);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.updateDepartment = function (departmentData) {
  return new Promise((resolve, reject) => {
    
    for([key, value] of Object.entries(departmentData)) {
      if(value == '') {
        departmentData[key] = null;
      }
    }

    Department.update(departmentData, {
      where: {
        departmentId: departmentData.departmentId
      }
    }).then(function(){ 
      resolve();
    }).catch(function() {
      reject("Unable to update department");
    });

  });
};

module.exports.deleteDepartmentById = function (id) {
  return new Promise((resolve, reject) => {
    Department.destroy({
      where: {
        departmentId: id
      }
    }).then(function() {
      resolve("succesfully deleted!");
    }).catch(function() {
      reject("Unable to delete.");
    })
  });
};

module.exports.addEmployee = function (employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.isManager = (employeeData.isManager) ? true : false;
    if(employeeData.employeeManagerNum !== '') {
      employeeData.employeeManagerNum = parseInt(employeeData.employeeManagerNum);
    }

    for([key, value] of Object.entries(employeeData)) {
      if(value == '') {
        employeeData[key] = null;
      }
    }

    console.log(employeeData);

    Employee.create(employeeData).then(function(){ 
      resolve();
    }).catch(function(e) {
      console.error(e);
      reject("Unable to create employee");
    });

  });
};

module.exports.getEmployeesByStatus = function (status) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        status: status
      }
    }).then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      resolve(dt);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.getEmployeesByDepartment = function (department) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        department: department
      }
    }).then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      resolve(dt);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.getEmployeesByManager = function (manager) {
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeManagerNum: manager
      }
    }).then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      resolve(dt);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.getEmployeeByNum = function (num) {
  console.log(num);
  return new Promise((resolve, reject) => {
    Employee.findAll({
      where: {
        employeeId: num
      }
    }).then(function(data) {
      const jsonData = JSON.stringify(data);
      const dt = JSON.parse(jsonData);
      console.log(dt);
      resolve(dt[0]);
    }).catch(function() {
      reject("no results returned");
    })
  });
};

module.exports.updateEmployee = function(employeeData) {
  return new Promise((resolve, reject) => {
    employeeData.employeeId = parseInt(employeeData.employeeId);
    employeeData.isManager = employeeData.isManager === 'on' ? true : false;
    if(employeeData.employeeManagerNum === '/')
      employeeData.employeeManagerNum = null
    
    for([key, value] of Object.entries(employeeData)) {
      if(value == '') {
        employeeData[key] = null;
      }
    }

    Employee.update(employeeData, {
      where: {
        employeeId: employeeData.employeeId
      }
    }).then(function() {
      resolve();
    }).catch(function() {
      reject("Unable to update employee");
    });

  });
};

module.exports.deleteEmployeeByNum = function (num) {
  return new Promise((resolve, reject) => {
    Employee.destroy({
      where: {
        employeeId: num
      }
    }).then(function() {
      resolve("succesfully deleted!");
    }).catch(function() {
      reject("Unable to delete.");
    })
  });
};