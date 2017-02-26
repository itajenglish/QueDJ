const db = require('../lib/db');

const getAllDjs = (req, res, next) => {

  db.any('SELECT first_name,last_name,bio,image,location FROM djs')
  .then((data) => {
    //Set Djs to user object to be accesible in Home Controller
    req.user = data;
    next();
  })
  .catch((err) => {
    console.log(err);
  })
}

module.exports = { getAllDjs };
