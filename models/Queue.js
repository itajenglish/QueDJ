const db = require('../lib/db');

//Get Queue from database that belongs to the logged in User
const getOneQueue = (req, res, next) => {
  const userID = req.session.user.id;

  db.any('SELECT * FROM que WHERE djs_id = $1', [userID])
  .then((queue) => {
    req.user = queue;
    next();
  })
  .catch((err) => {
    console.log(err);
    res.send('Oh oh something went wrong!')
  })
}

// TODO Finish addToQueue route
const addToQueue

module.exports = { getOneQueue };
