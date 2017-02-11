const express = require('express');
const router = express.Router();
const authenticate = require('../models/User.js')

router.get('/login', (req, res, next) => {
  res.render('home/login');
});

router.post('/login', authenticate, (req, res, next) => {
  res.redirect('/');
})

module.exports = router;
