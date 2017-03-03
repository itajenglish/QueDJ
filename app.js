//Require NPM Packages
const express = require('express'),
  app = express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  methodOverride = require('method-override'),
  session = require('express-session'),
  bdPars = require('body-parser'),
  morgan = require('morgan');


//configure express and related packages
app.engine('html', mustache());
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(methodOverride('__method')); //method override
app.use(morgan('dev')); // Log All Requests
app.use(bdPars.urlencoded({
  extended: false
})); //body parser
app.use(bdPars.json()); //body parser


app.use(session({
  secret: 'quedj',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

const checkSession = require('./lib/helpers/checkSession');

//Redirects any user that is not logged in when visiting /users
app.all(['/users*','/queue*'], checkSession)

//Controllers
const USERS_ROUTER = require('./controllers/Users');
const SESSIONS_ROUTER = require('./controllers/Sessions');
const HOME_ROUTER = require('./controllers/Home');
const DASHBOARDS_ROUTER = require('./controllers/Dashboards');
const QUEUE_ROUTER = require('./controllers/Queue');
const API_ROUTER = require('./controllers/Api');

// Define All Routes
app.use(HOME_ROUTER);
app.use(SESSIONS_ROUTER);
app.use(DASHBOARDS_ROUTER);
app.use('/Users', USERS_ROUTER);
app.use('/Queue', QUEUE_ROUTER);
app.use('/Api', API_ROUTER);

//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server running on port ' + PORT + '!');
});
