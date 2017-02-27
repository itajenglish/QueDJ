const db = require('../lib/db');
const capitalName = require('../lib/helpers/capitalName');

const getUserByFnameOrLname = (req, res, next) => {
  const fname = capitalName(req.params.fname);
  const lname = capitalName(req.params.lname);

  db.any('SELECT id,first_name,last_name,image,location,bio FROM djs WHERE first_name = $1 OR last_name = $2', [fname, lname])
  .then((user) => {
    console.log(user)
    req.user = user;
    next();
  })
  .catch((err) => {
    console.log(err);
    res.send('Ohh oh something went wrong!');
  })
}

const getAllSearchUsers = (req, res, next) => {
  db.any('SELECT id,first_name,last_name,image,location FROM djs')
    .then((users) => {
      let obj = {};

      //Auto Complete Requires names to be keys.
       users.forEach(function(value, index, arry) {
        const fname = value.first_name;
        const lname = value.last_name;
        obj[fname + " " + lname] = null;
      });

      req.user = obj;
      next();
    })
    .catch((err) => {
      console.log(err)
      res.send('Ohh oh something went wrong!')
    })
}

module.exports = { getUserByFnameOrLname, getAllSearchUsers };
