//Require NPM Packages
var express = require('express'),
  app = express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  db = pgp("postgres:tajenglish@localhost:5432/quedj"),
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
app.get('/', function(req, res) {
  res.render('home/index');
});

app.get('/login', function(req, res) {
  res.render('home/login');
});


app.post('/login', function(req, res) {
  var data = req.body;
  console.log(data);

  db.one(
    "(SELECT * FROM fans where email = $1) UNION (SELECT * FROM djs where email = $1)", [data.email]).catch(function() {
    res.send('Email/Password not found.');
  }).then(function(user) {
    console.log(user);
     console.log(user.password);
      console.log(data.password);
    bcrypt.compare(data.password, user.password, function(err, cmp) {
      if (cmp) {
        req.session.user = user;
        res.redirect('/index');
      } else {
        res.send('Email/Password not found.');
      }
    });
  });
});


app.post('/register', function(req, res) {
  var data = req.body;
  console.log(data);
  if(data.accountPicker === "dj"){
  bcrypt.hash(data.password, 10, function(err, hash) {
    db.none("INSERT INTO djs (First_Name,Last_Name,type,email,location,password) VAlUES ($1,$2,$3,$4,$5,$6)",
    [data.first_name, data.last_name, data.accountPicker, data.email, data.location, hash]).then(function(data) {
      console.log(data);
      res.redirect("/");
      });
  });
}else{
  bcrypt.hash(data.password, 10, function(err, hash) {
    db.none("INSERT INTO fans (First_Name,Last_Name,type,email,location,password) VAlUES ($1,$2,$3,$4,$5,$6)",
    [data.first_name, data.last_name, data.accountPicker, data.email, data.location, hash]).then(function(data) {
      console.log(data);
      res.redirect("/");
      });
  });
}

});
