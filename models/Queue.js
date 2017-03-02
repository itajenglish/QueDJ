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

// Adds songs to users que in database
const addToQueue = (req, res, next) => {
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
    console.log(err);
    res.send('Ohh oh something went wrong with adding your song to the queue!');
  })
}

const deleteSongFromQue = (req, res, next) => {
  const userID = req.session.user.id;
  const songID = req.body.songID;
  console.log(req.body.songID);

  db.none('DELETE FROM que WHERE id = $1 AND djs_id = $2', [songID, userID])
  .then(() => {
    console.log("Song Deleted");
    next();
  })
  .catch((err) => {
    console.log(err);
    res.send('Oh oh something went wrog with deleting your song from the queue!')
  })
}

module.exports = {
  getOneQueue,
  addToQueue,
  deleteSongFromQue
};
