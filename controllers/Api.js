const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { getAllUsers } = require('../models/User');
const { getUserByFnameOrLname, getAllSearchUsers } = require('../models/Api');

//Gets all users in the daabase
router.get('/', getAllUsers, (req, res, next) => {
  const users = req.user;
  res.send(users);
});

//Router Returns Specal Object for autocomplete
router.get('/search', getAllSearchUsers, (req, res, next) => {
  const results = req.user;
  res.send(results)
});

//Gets all users in the daabase
router.get('/:fname-:lname', getUserByFnameOrLname, (req, res, next) => {
  const user = req.user;
  res.send(user);
});

//Gets songs from iTunes
router.get('/itunes/:song', (req, res, next) => {
  const song = req.params.song;

  fetch(`https://itunes.apple.com/search?term=${song}`)
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      res.json(json);
    })
    .catch((err) => {
      console.log(err)
      res.send('ohh oh something went wrong!');
    })

});

module.exports = router;
