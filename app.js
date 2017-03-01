//Require NPM Packages
const express = require('express'),
  app = express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  methodOverride = require('method-override'),
  bdPars = require('body-parser'),
  bcrypt = require('bcrypt'),
  session = require('express-session'),
  morgan = require('morgan');
var db = pgp(process.env.DATABASE_URL || 'postgres://tajenglish@localhost:5432/quedj');

//Controllers
const USERS_ROUTER = require('./controllers/Users');
const SESSIONS_ROUTER = require('./controllers/Sessions');
const HOME_ROUTER = require('./controllers/Home');
const DASHBOARDS_ROUTER = require('./controllers/Dashboards');
const API_ROUTER = require('./controllers/API');

const checkSession = require('./lib/helpers/checkSession');

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
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

//Redirects any user that is not logged in when visiting /users
app.all(['/users*'], checkSession)

//start the server
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Server running on port ' + PORT + '!');
});


app.use('/', HOME_ROUTER);
app.use('/', SESSIONS_ROUTER);
app.use('/', DASHBOARDS_ROUTER);
app.use('/Users', USERS_ROUTER);
app.use('/Api', API_ROUTER);


app.post('/saveQueData', function(req, res) {
  data = req.body;
  var id = data.djID;
  var Title = data.Title;
  var Artist = data.Artist;
  var Album = data.Album;
  var Image = data.Image;
  var userID = req.session.user.id;
  db.none('INSERT INTO QUE (title,artist,album,img,djs_id,fans_id) VALUES ($1,$2,$3,$4,$5,$6)', [Title, Artist, Album, Image, id, userID]).then(function() {
    res.send("Song Added!")
  })

});

app.delete('/deleteQueData', function(req, res) {
  var user = req.session.user.id;
  var songID = req.body.songID;
  console.log(req.body.songID);
  db.none('DELETE FROM que WHERE id = $1 AND djs_id = $2', [songID, user]).then(function() {
    console.log("Song Deleted");
  });
});

app.get('/queData', function(req, res) {
  var userID = req.session.user.id;
  db.any('SELECT * FROM que WHERE djs_id = $1', [userID])
    .then(function(data) {
      res.send(data);
    })
});
