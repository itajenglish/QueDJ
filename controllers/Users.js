const express = require('express');
const router = express.Router();
const { register, updateUser } = require('../models/User');

//User#Create
router.post('/users', register, (req, res, next) => {
  res.redirect('/login');
});

//User#Put
router.put('users/:id/', updateUser, (req, res, next) => {
  res.redirect(`/dj/ ${user.first_name}-${user.last_name}`);
});

module.exports = router;
