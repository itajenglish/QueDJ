const express = require('express');
const router = express.Router();

router.post('/saveQueData', function(req, res) {
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

router.delete('/deleteQueData', function(req, res) {
  var user = req.session.user.id;
  var songID = req.body.songID;
  console.log(req.body.songID);
  db.none('DELETE FROM que WHERE id = $1 AND djs_id = $2', [songID, user]).then(function() {
    console.log("Song Deleted");
  });
});

router.get('/queData', function(req, res) {
  var userID = req.session.user.id;
  db.any('SELECT * FROM que WHERE djs_id = $1', [userID])
    .then(function(data) {
      res.send(data);
    })
});
