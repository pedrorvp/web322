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
var app = express();

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

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/home.html'));
});

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/managers', function (req, res) {
  dataService.getManagers().then((data) => {
    res.json(data);
  });
});

app.get('/departments', function (req, res) {
  dataService.getDepartments().then((data) => {
    res.json(data);
  });
});

app.get('/employees', function (req, res) {
  if(req.query.status) {
    dataService.getEmployeesByStatus(req.query.status).then((data) => {
      res.json(data);
    }).catch((data) => {
      res.json(data);
    })
  }

  if(req.query.department) {
    dataService.getEmployeesByDepartment(parseInt(req.query.department)).then((data) => {
      res.json(data);
    }).catch((data) => {
      res.json(data);
    })
  }

  if(req.query.manager !== undefined) {
    console.log('In!')
    dataService.getEmployeesByManager(parseInt(req.query.manager)).then((data) => {
      console.log(data);
      res.json(data);
    }).catch((data) => {
      res.json(data);
    })
  }

  dataService.getAllEmployees().then((data) => {
    res.json(data);
  });
});

app.get('/employees/add', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addEmployee.html'));
});

app.get('/employees/:num', function (req, res) {
  dataService.getEmployeeByNum(parseInt(req.params.num)).then((data) => {
    res.json(data);
  }).catch((data) => {
    res.json(data);
  })
});

app.post("/employees/add", function(req, res) {
  dataService.addEmployee(req.body).then(() => {
    res.redirect( "/employees" );
  })
});

app.get('/images/add', function (req, res) {
  res.sendFile(path.join(__dirname, '/views/addImage.html'));
});

app.post("/images/add", upload.single("imageFile"), (req, res) => {
  res.redirect('/images');
});

app.get("/images", function (req, res) {
  const files = fs.readdirSync(path.join(__dirname, '/public/images/uploaded'))
  res.json({
    images: files
  });
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
