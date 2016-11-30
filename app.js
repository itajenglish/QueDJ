//Require NPM Packages
var express = require('express'),
  app = express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  db = pgp(process.env.DATABASE || "postgres:tajenglish@localhost:5432/quedj"),
  methodOverride = require('method-override'),
  bdPars = require('body-parser'),
  bcrypt = require('bcrypt'),
  session = require('express-session');

//configure express and related packages
app.engine('html', mustache());
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(methodOverride('_method')); //method override
app.use(bdPars.urlencoded({
  extended: false
})); //body parser
app.use(bdPars.json()); //body parser

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

//start the server
var port = 3000;
app.listen(port, function() {
  console.log('Server running on port ' + port + '!');
});

// Define Routes
//Home Route
app.get('/', function(req, res) {
  var logged_in;
  var email;
  var user = req.session.user;

  if (user) {
    if (user.type === "fan") {
      console.log(user.type);
      res.redirect('/userboard');
    } else if (user.type === "dj") {
      res.redirect("/djboard");
    }
  }
  res.render('home/index');
});

//Register Route
app.post('/register', function(req, res) {
  var data = req.body;
  var fname = data.first_name.toUpperCase(0);
  var lname = data.last_name.toUpperCase(0);
  if (data.accountPicker === "dj") {
    bcrypt.hash(data.password, 10, function(err, hash) {
      db.none("INSERT INTO djs (First_Name,Last_Name,type,email,location,password) VAlUES ($1,$2,$3,$4,$5,$6)",
      [fname, lname, data.accountPicker, data.email, data.location, hash]).then(function(data) {
        console.log(data);
        res.redirect("/");
      });
    });
  } else {
    bcrypt.hash(data.password, 10, function(err, hash) {
      db.none("INSERT INTO fans (First_Name,Last_Name,type,email,location,password) VAlUES ($1,$2,$3,$4,$5,$6)",
      [data.first_name, data.last_name, data.accountPicker, data.email, data.location, hash]).then(function(data) {
        console.log(data);
        res.redirect("/");
      });
    });
  }
});

//Login Routes
app.get('/login', function(req, res) {
  res.render('home/login');
});


app.post('/login', function(req, res) {
  var data = req.body;
  console.log(data);

  db.one(
    "(SELECT * FROM fans where email = $1) UNION (SELECT * FROM djs where email = $1)", [data.email])
    .then(function(user) {
    console.log(user);
    console.log(user.password);
    console.log(data.password);
    bcrypt.compare(data.password, user.password, function(err, cmp) {
      if (cmp) {
        req.session.user = user;
        res.redirect('/');
      } else {
        res.send('Email/Password not found.');
      }
    });
  }).catch(function() {
    res.send('Email/Password not found.');
  })
})
//Dashboard Routes

app.get('/djboard', function(req, res) {
  var email;
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/');
  } else {
    res.render('dashboards/djboard', data);
  }
});

app.get('/userboard', function(req, res) {
  var email;
  var user = req.session.user;
  var data = {data:user};

  if (user === undefined) {
    res.redirect('/');
  } else {
    res.render('dashboards/userboard', data);
  }
});

//Api Routes

app.get('/api',function(req,res){
db.any('SELECT id,first_name,last_name,image FROM djs')
.then(function(data){
  var data = JSON.stringify(data);
  res.send(data);
});
});

app.get('/search',function(req,res){
db.any('SELECT id,first_name,last_name,image FROM djs')
.then(function(data){
  var obj = {};
  var data2 = data.forEach(function(value,index,arry){
    var fname = value.first_name;
    var lname = value.last_name;
    obj[fname + " "  + lname] = null;
  })
  res.send(obj);
  });
});

app.get('/api/:name',function(req,res){
  var name = req.params.name
  name = name.replace('%20',' ')
  name = name.split(' ')
  db.any('SELECT id,first_name,last_name,image FROM djs WHERE first_name = $1 OR last_name = $2', [name[0],name[1]])
  .then(function(data){
    console.log(data)
    res.send(data);
  });
})

// app.get('/api/:fname/:lname',function(req,res){
// db.any('SELECT id,first_name,last_name,image FROM djs WHERE first_name = $1 OR last_name = $2', [req.params.fname,req.params.lname])
// .then(function(data){
//   console.log(data)
//   res.send(data);
// });
// });
