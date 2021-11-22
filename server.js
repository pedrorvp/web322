/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy. No part   
 *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Pedro Rosa Valente Paulino
 *  Student ID: 136256195
 *  Date: 10/10/2021
 *
 *  Online (Heroku) Link:  https://git.heroku.com/web322-pedro.git
 *
 ********************************************************************************/

var express = require('express');
var path = require('path');
var dataService = require('./data-service.js');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');

var app = express();

app.engine('.hbs', exphbs({ 
  extname: '.hbs',
  defaultLayout: 'main',
  helpers: {
    navLink: function(url, options){
      return '<li' +
      ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
      '><a href="' + url + '">' + options.fn(this) + '</a></li>';
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    }
  }
}));
app.set('view engine', '.hbs');

var HTTP_PORT = process.env.PORT || 8080;

function onHTTPStart() {
  console.log('Express http server listening on: ' + HTTP_PORT);
}

const storage = multer.diskStorage({
  destination:  "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  } 
});

const upload = multer({ storage: storage });

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req,res,next){
 let route = req.baseUrl + req.path;
 app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
 next();
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/about', function (req, res) {
  res.render('about');
});

app.get('/managers', function (req, res) {
  dataService.getManagers().then((data) => {
    res.json(data);
  });
});

app.get('/departments', function (req, res) {
  dataService.getDepartments().then((data) => {
    if(data.length === 0)
      res.render('departments', { message: "no results" });
    else res.render('departments', { departments: data });
  }).catch((data) => {
    res.render('departments', { message: data });
  });
});

app.get('/department/:departmentId', function (req, res) {
  dataService.getDepartmentById(parseInt(req.params.departmentId)).then((data) => {
    res.render('department', { department: data });
  }).catch((data) => {
    res.render('department', { message: data });
  })
});

app.get('/departments/add', function (req, res) {
  res.render('addDepartment');
});

app.post("/departments/add", function(req, res) {
  dataService.addDepartment(req.body).then(() => {
    res.redirect( "/departments" );
  }).catch(() => {
    res.status(500).json({ message: 'Unable to add' })
  })
});

app.post("/departments/update", (req, res) => {
  //console.log(req.body);
  const employeeData = req.body;
  departmentData.departmentId = parseInt(departmentData.departmentId);

  dataService.updateDepartment(employeeData).then(() => {
    res.redirect("/departments");
  }).catch((e) => {
    console.log(e);
    res.status(500).json({ message: 'Unable to update' });
  })
  //res.json({});
});

app.get('/departments/delete/:departmentId', function (req, res) {
  dataService.deleteDepartmentById(parseInt(req.params.departmentId)).then(() => {
    res.redirect("/departments");
  }).catch(() => {
    res.status(500).json({ message: "unable to remove department" })
  })
});

app.get('/employee/:num', function (req, res) {
  // initialize an empty object to store the values
  let viewData = {};
  dataService.getEmployeeByNum(parseInt(req.params.num)).then((data) => {
    if (data) {
    viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
    viewData.employee = null; // set employee to null if none were returned
    }
  })
  .catch(() => {
    viewData.employee = null; // set employee to null if there was an error
  })
  .then(dataService.getDepartments)
  .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as "departments"
    // loop through viewData.departments and once we have found the departmentId that matches
    // the employee's "department" value, add a "selected" property to the matching
    // viewData.departments object
    for (let i = 0; i < viewData.departments.length; i++) {
      if (viewData.departments[i].departmentId == viewData.employee.department) {
        viewData.departments[i].selected = true;
      }
    }
  })
  .catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
  })
  .then(() => {
    if (viewData.employee == null) { // if no employee - return an error
    res.status(404).send("Employee Not Found");
    } else {
      res.render("employee", { viewData: viewData }); // render the "employee" view
    }
  });
});

app.post("/employee/update", (req, res) => {
  //console.log(req.body);
  const employeeData = req.body;
  employeeData.employeeId = parseInt(employeeData.employeeId);
  employeeData.isManager = employeeData.isManager === 'on' ? true : false;
  if(employeeData.employeeManagerNum === '/')
    employeeData.employeeManagerNum = null

  dataService.updateEmployee(employeeData).then(() => {
    res.redirect("/employees");
  }).catch((e) => {
    console.log(e);
    res.status(500).json({ message: 'Unable to update' });
  })
  //res.json({});
});

app.get('/employees', function (req, res) {
  
  if(req.query.status) {
    dataService.getEmployeesByStatus(req.query.status).then((data) => {
      res.render('employees', { employees: data });
    }).catch((data) => {
      res.render('employees', { message: data });
    })
  }

  if(req.query.department) {
    dataService.getEmployeesByDepartment(parseInt(req.query.department)).then((data) => {
      res.render('employees', { employees: data });
    }).catch((data) => {
      res.render('employees', { message: data });
    })
  }

  if(req.query.manager !== undefined) {
    console.log('In!')
    dataService.getEmployeesByManager(parseInt(req.query.manager)).then((data) => {
      res.render('employees', { employees: data });
    }).catch((data) => {
      res.render('employees',{message: data});
    })
  }

  dataService.getAllEmployees().then((data) => {
    if(data.length === 0) {
      res.render('employees', { message: "no results" });  
    }
    else res.render('employees', { employees: data });
  }).catch((data) => {
    res.render('employees', { message: data});
  });

});

app.get('/employees/add', function (req, res) {
  //get the departments first
  dataService.getDepartments().then((data) => {
    res.render('addEmployee', { departments: data });
  }).catch(() => {
    res.render('addEmployee', { departments: [] });
  })
});


app.post("/employees/add", function(req, res) {
  dataService.addEmployee(req.body).then(() => {
    res.redirect( "/employees" );
  }).catch(() => {
    res.status(500).json("Unable to add!")
  })
});

app.get('/employees/delete/:employeeId', function (req, res) {
  dataService.deleteEmployeeByNum(parseInt(req.params.employeeId)).then(() => {
    res.redirect("/employees");
  }).catch(() => {
    res.status(500).json({ message: "unable to remove employee" })
  })
});

app.get('/images/add', function (req, res) {
  res.render('addImage');
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect('/images');
});

app.get("/images", function (req, res) {
  const files = fs.readdirSync(path.join(__dirname, '/public/images/uploaded'))
  console.log(files);
  res.render('image', { images: files });
})

app.use(function (req, res) {
  res.sendFile(path.join(__dirname, '/views/404.html'));
});

dataService
  .initialize()
  .then(function () {
    app.listen(HTTP_PORT, onHTTPStart);
  })
  .catch(function (err) {
    console.log('Failed to start!' + err);
  });
