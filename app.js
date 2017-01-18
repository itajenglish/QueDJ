//Require NPM Packages
var express = require('express'),
  app = express(),
  mustache = require('mustache-express'),
  pgp = require('pg-promise')(),
  methodOverride = require('method-override'),
  bdPars = require('body-parser'),
  bcrypt = require('bcrypt'),
  session = require('express-session'),
  fetch = require('node-fetch');
var db = pgp(process.env.DATABASE_URL || 'postgres://tajenglish@localhost:5432/quedj');



//configure express and related packages
app.engine('html', mustache());
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(methodOverride('__method')); //method override
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
var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log('Server running on port ' + PORT + '!');
});

// Define Routes
//Home Route
app.get('/', function(req, res) {
  var user = req.session.user;

  if (user) {
    if (user.type === "fan") {
      console.log(user.type);
      res.redirect('/userboard');
    } else if (user.type === "dj") {
      res.redirect("/djboard");
    }
  } else {
    db.any('SELECT first_name,last_name,bio,image,location FROM djs')
      .then(function(data) {
        res.render('home/index', {
          data: data
        });
      })
  }
});

//Register Route
app.post('/register', function(req, res) {
  function capitalFunc(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  var data = req.body;
  var fname = capitalFunc(data.first_name);
  var lname = capitalFunc(data.last_name);
  var image = "images/Music-Dj-icon.png"
  if (data.accountPicker === "dj") {
    bcrypt.hash(data.password, 10, function(err, hash) {
      db.none("INSERT INTO djs (First_Name,Last_Name,type,email,image,location,password) VAlUES ($1,$2,$3,$4,$5,$6,$7)", [fname, lname, data.accountPicker, data.email, image, data.location, hash]).then(function(data) {
        console.log(data);
        res.redirect("/login");
      });
    });
  } else {
    bcrypt.hash(data.password, 10, function(err, hash) {
      db.none("INSERT INTO fans (First_Name,Last_Name,type,email,image,location,password) VAlUES ($1,$2,$3,$4,$5,$6,$7)", [fname, lname, data.accountPicker, data.email, image, data.location, hash]).then(function(data) {
        console.log(data);
        res.redirect("/login");
      });
    });
  }
});

//Update Info Route
app.put('/updateInfo', function(req, res) {
  function capitalFunc(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  var data = req.body;
  var userID = req.session.user.id;
  var fname = capitalFunc(data.first_name);
  var lname = capitalFunc(data.last_name);
  var loc = data.location;
  var bio = data.bio;
  console.log(data);
  db.one('UPDATE djs SET (first_name,last_name,location,bio) = ($1,$2,$3,$4) WHERE id = $5 returning first_name,last_name', [fname, lname, loc, bio, userID]).then(function(dataReturn) {
    console.log(dataReturn)
    res.redirect('/dj/' + dataReturn.first_name + '-' + dataReturn.last_name);
  });

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

app.get('/logout', function(req, res) {
  req.session.destroy();
  res.redirect('/');
});

//Dashboard Routes
app.get('/djboard', function(req, res) {
  var email;
  var user = req.session.user;

  if (user === undefined) {
    res.redirect('/');
  } else if (user.type === 'dj') {
    res.render('dashboards/djboard', {
      'user': user
    });
  }
});

app.get('/userboard', function(req, res) {
  var email;
  var user = req.session.user;
  var data = {
    data: user
  };

  if (user === undefined) {
    res.redirect('/');
  } else if (user.type === 'fan') {
    res.render('dashboards/userboard', data);
  } else {
    res.send('neither clause met');
  }
});

//Profile Routes
app.get('/user/:fname-:lname', function(req, res) {
  function capitalFunc(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  var fname = capitalFunc(req.params.fname);
  var lname = capitalFunc(req.params.lname)
  db.one('SELECT * FROM djs WHERE first_name = $1 AND last_name = $2', [fname, lname])
    .then(function(data) {
      console.log(data);
      var dbData = {
        dj: data
      };
      res.render('profiles/userprofile', dbData);
    });
});

app.get('/dj/:fname-:lname', function(req, res) {
  var user = req.session.user;
  if (user === undefined) {
    res.redirect('/login');

  } else if (user.type === 'dj') {
    var capitalFunc = function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    var fname = capitalFunc(req.params.fname);
    var lname = capitalFunc(req.params.lname);


    db.one('SELECT * FROM djs WHERE first_name = $1 AND last_name = $2', [fname, lname])
      .then(function(data) {
        console.log(data);
        var dbData = {
          dj: data
        };
        res.render('profiles/djprofile', dbData);
      });
  } else if (user.type === 'fan') {
    res.redirect('/userboard');
  }
});

//Api Routes

app.get('/api', function(req, res) {
  db.any('SELECT id,first_name,last_name,image,location FROM djs')
    .then(function(data) {
      var data = JSON.stringify(data);
      res.send(data);
    });
});

app.get('/api?:name&')
app.get('/api/:name', function(req, res) {
  var name = req.params.name
  name = name.replace('%20', ' ')
  name = name.split(' ')
  db.any('SELECT id,first_name,last_name,image,location,bio FROM djs WHERE first_name = $1 OR last_name = $2', [name[0], name[1]])
    .then(function(data) {
      console.log(data)
      res.send(data);
    });
})

app.get('/search', function(req, res) {
  db.any('SELECT id,first_name,last_name,image,location FROM djs')
    .then(function(data) {
      var obj = {};
      var data2 = data.forEach(function(value, index, arry) {
        var fname = value.first_name;
        var lname = value.last_name;
        var loc = value.location
        obj[fname + " " + lname] = null;
        // obj[location] = loc;
      })
      res.send(obj);
    });
});

app.post('/itunes', function(req, res) {
  var body = req.body;
  fetch("https://itunes.apple.com/search?term=" + body.title)
    .then(function(res2) {
      return res2.json();
    }).then(function(json) {
      res.json(json);
    })

});

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
