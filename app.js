//Require NPM Packages
var express = require('express'),
  app = express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  db = pgp("postgres:tajenglish@localhost:5432/quedj"),
  methodOverride = require('method-override'),
  bdPars = require('body-parser');
bcrypt = require('bcrypt');

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

//start the server
var port = 3000;
app.listen(port, function() {
  console.log('Server running on port ' + port + '!');
});

// Define Routes
app.get('/', function(req, res) {
  res.render('home/index');
});

app.post('/register', function(req, res) {
  var data = req.body;
  console.log(data);
  bcrypt.hash(data.password, 10, function(err, hash) {
    db.none("INSERT INTO users (first_name,last_name,type,email,location,password) VAlUES ($1,$2,$3,$4,$5,$6)",
    [data.first_name, data.last_name, data.accountPicker, data.email, data.location, hash]).then(function(data) {
      res.send('Data post sucess!');
    });
  });

});
