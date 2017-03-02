const db = require('../lib/db');

const getOneQueue = (req, res, next) => {
  const userID = req.session.user.id;

  db.any('SELECT * FROM que WHERE djs_id = $1', [userID])
  .then(function(data) {
    res.send(data);
  })
  .catch((err) => {
    console.log(err);
    res.send('Oh oh something went wrong!')
  })
}
