//Require NPM Packages
var express = require('express'),
app = express(),
mustache = require('mustache-express'),
pgp = require('pg-promise')(),
db = pgp("postgres:tajenglish@localhost:5432/"),
methodOverride = require('method-override'),
bdPars = require('body-parser');

//configure express and related packages
  app.engine('html',mustache());
  app.set('view engine','html');
  app.use(express.static(__dirname+'/public'));
  app.set('views',__dirname+'/views');
  app.use(methodOverride('_method')); //method override
  app.use(bdPars.urlencoded({ extended: false })); //body parser
  app.use(bdPars.json()); //body parser

//start the server
  var port = 3000;
  app.listen(port, function(){
    console.log('Server running on port '+ port +'!');
  });

// Define Routes
  app.get('/',function(req,res){
    res.render('home/index');
  });
