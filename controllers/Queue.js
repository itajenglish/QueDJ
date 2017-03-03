const express = require('express');
const router = express.Router();
const { getOneQueue, addToQueue, deleteSongFromQue } = require('../models/Queue');

router.get('/',  getOneQueue, (req, res, next) => {
  const queue = req.user;
  console.log(queue);
  res.send(queue);
});

router.post('/', addToQueue, (req, res, next) => {
  res.send('Song Added!')
});

router.delete('/', deleteSongFromQue, (req, res, next) => {
res.send('Song Delete')

});

module.exports = router;
