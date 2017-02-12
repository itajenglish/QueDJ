const express = require('express');
const router = express.Router();
const { authenticate, register } = require('../models/User.js');

//Get Routes
router.get('/login', (req, res, next) => {
  res.render('home/login');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

//Post Routes
router.post('/login', authenticate, (req, res, next) => {
  res.redirect('/');
});

router.post('/register', register, (req, res, next) => {
  res.redirect('/');
});


module.exports = router;
