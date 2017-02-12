const db = require('../lib/db');
const bcrypt = require('bcrypt');
const capitalName = require('../lib/helpers/capitalName');


//Checks Database for user and sets session to user object
const authenticate = (req, res, next) => {

  const data = req.body;

  db.one(
      "(SELECT * FROM fans where email = $1) UNION (SELECT * FROM djs where email = $1)", [data.email])
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
    }).catch(() => {
      res.send('Email/Password not found.');
    })
};

//Sends User Data into the Database
const register = (req, res, next) => {

  const data = req.body;
  const fname = capitalName(data.first_name);
  const lname = capitalName(data.last_name);
  const image = "images/Music-Dj-icon.png"

  if (data.accountPicker === "dj") {

    bcrypt.hash(data.password, 10, (err, hash) => {
      db.none("INSERT INTO djs (First_Name,Last_Name,type,email,image,location,password) VAlUES ($1,$2,$3,$4,$5,$6,$7)", [fname, lname, data.accountPicker, data.email, image, data.location, hash]).then(function(data) {
        console.log(data);
        next();
      });
    });

  } else {

    bcrypt.hash(data.password, 10, (err, hash) => {
      db.none("INSERT INTO fans (First_Name,Last_Name,type,email,image,location,password) VAlUES ($1,$2,$3,$4,$5,$6,$7)", [fname, lname, data.accountPicker, data.email, image, data.location, hash])
      .then((data) => {
        console.log(data);
        next();
      });
    });
  }
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

  db.one('UPDATE djs SET (first_name,last_name,location,bio) = ($1,$2,$3,$4) WHERE id = $5 returning first_name,last_name', [fname, lname, loc, bio, userID])
    .then((user) => {
      console.log(user)
      next();
    });

}
module.exports = {
  authenticate,
  register,
  updateUser
};
