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

module.exports = { getUserByFnameOrLname };
