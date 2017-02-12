s;const express = require('express');
const router = express.Router();
const { authenticate, register } = require('../models/User')

router.get('/login', (req, res, next) => {
  res.render('home/login');
});

router.post('/login', authenticate, (req, res, next) => {
  res.redirect('/');
});

router.post('/register', register, (req, res, next) => {
  res.redirect("/login");

});

module.exports = router;
