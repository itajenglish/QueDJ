const db = require('../lib/db');
const bcrypt = require('bcrypt');
const capitalName = require('../lib/helpers/capitalName');


//Checks Database for user and sets session to user object
const authenticate = (req, res, next) => {

  const data = req.body;

  db.one("(SELECT * FROM fans where email = $1) UNION (SELECT * FROM djs where email = $1)", [data.email])
    .then((user) => {

      bcrypt.compare(data.password, user.password, (err, cmp) => {
        if (cmp) {
          req.session.user = user;
          delete req.session.user.password;
          next();
        } else {
          res.send('Email/Password not found.');
        }
      });
    })
    .catch(() => {
      res.send('Email/Password not found.');
    })
};

//Sends User Data into the Database
const register = (req, res, next) => {

  const data = req.body;
  const fname = capitalName(data.first_name);
  const lname = capitalName(data.last_name);
  const image = "images/Music-Dj-icon.png"

  //Based on account type user selects puts it into the right table
  if (data.accountPicker === "dj") {

    bcrypt.hash(data.password, 10, (err, hash) => {
      db.none("INSERT INTO djs (First_Name,Last_Name,type,email,image,location,password) VAlUES ($1,$2,$3,$4,$5,$6,$7)", [fname, lname, data.accountPicker, data.email, image, data.location, hash])
      .then((data) => {
        console.log(data);
        next();
      })
      .catch((err) => {
        res.send('Something went wrong!')
        console.log(err);
      })
    });

  } else {

    bcrypt.hash(data.password, 10, (err, hash) => {
      db.none("INSERT INTO fans (First_Name,Last_Name,type,email,image,location,password) VAlUES ($1,$2,$3,$4,$5,$6,$7)", [fname, lname, data.accountPicker, data.email, image, data.location, hash])
      .then((data) => {
        console.log(data);
        next();
      })
      .catch((err) => {
        res.send('Something went wrong!');
        console.log(err);
      })
    });
  }
}

//Gets all users in the daabase
const getAllUsers = (req, res , next) => {

  db.any('SELECT id,first_name,last_name,image,location FROM djs')
  .then((users) => {
    req.user = users;
    next();
  })
  .catch((err) => {
    console.log(err);
    res.send('Ohh oh something went wrong!');
  })
}

//Get Specfic User by first and last name
const getUserByName = (req, res, next) => {
  const fname = capitalName(req.params.fname);
  const lname = capitalName(req.params.lname);

  db.one('SELECT * FROM djs WHERE first_name = $1 AND last_name = $2', [fname, lname])
  .then((data) => {
    delete data.password
    req.user = data;
    next();
  })
  .catch((err) => {
      res.send('Something went wrong!');
      console.log(err);
    })
}

//Updates User in the database
const updateUser = (req, res, next) => {

  const data = req.body;
  const userID = req.session.user.id;
  const fname = capitalName(data.first_name);
  const lname = capitalName(data.last_name);
  const loc = data.location;
  const bio = data.bio;

  console.log(data);

  db.one('UPDATE djs SET (first_name,last_name,location,bio) = ($1,$2,$3,$4) WHERE id = $5 returning id,first_name,last_name,type', [fname, lname, loc, bio, userID])
    .then((user) => {
      req.user = user;
      req.session.user = user;
      console.log(user)
      next();
    })
    .catch((err) => {
      res.send('Something went wrong!');
      console.log(err);
    })
}

module.exports = {
  authenticate,
  register,
  getUserByName,
  getAllUsers,
  updateUser
};
