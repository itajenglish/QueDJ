const db = require('../lib/db');
const bcrypt = require('bcrypt');

const authenticate = (req, res, next) => {
  const data = req.body;
  db.one(
      "(SELECT * FROM fans where email = $1) UNION (SELECT * FROM djs where email = $1)", [data.email])
    .then((user) => {

      bcrypt.compare(data.password, user.password, (err, cmp) => {
        if (cmp) {
          req.session.user = user;
          next();
        } else {
          res.send('Email/Password not found.');
        }
      });
    }).catch(() => {
      res.send('Email/Password not found.');
    })
}

module.exports = authenticate;
