const express = require('express');
const router = express.Router();
const { getOneQueue } = require('../models/Queue');

router.get('/',  getOneQueue, (req, res, next) => {
  const queue = req.user;
  console.log(queue);
  res.send(queue);
});

router.post('/', function(req, res) {
  const data = req.body;
  const id = data.djID;
  const Title = data.Title;
  const Artist = data.Artist;
  const Album = data.Album;
  const Image = data.Image;
  const userID = req.session.user.id;

  db.none('INSERT INTO QUE (title,artist,album,img,djs_id,fans_id) VALUES ($1,$2,$3,$4,$5,$6)', [Title, Artist, Album, Image, id, userID])
  .then(() => {
    next();
  })
  .catch((err) => {
    console.log(err)
    res.send('Ohh oh something went wrong!')
  })

});

router.delete('/', function(req, res) {
  const user = req.session.user.id;
  const songID = req.body.songID;
  console.log(req.body.songID);
  db.none('DELETE FROM que WHERE id = $1 AND djs_id = $2', [songID, user]).then(function() {
    console.log("Song Deleted");
  });
});

module.exports = router;
