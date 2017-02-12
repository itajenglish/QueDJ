const express = require('express');
const router = express.Router();
const { authenticate } = require('../models/User.js');

//USER#NEW
router.get('/login', (req, res, next) => {
  res.render('home/login');
});

//USER#CREATE
router.post('/login', authenticate, (req, res, next) => {
  res.redirect('/');
});

//USER#DESTORY
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
