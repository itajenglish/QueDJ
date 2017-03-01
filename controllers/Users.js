const express = require('express');
const router = express.Router();
const { register, getUserByName, updateUser } = require('../models/User');

//User#Get
router.get('/:fname-:lname', getUserByName, (req, res, next) => {
  const accountType = req.session.user.type
  const user = req.user;

  //Renders the correct profile based on account type.
  if (accountType === 'dj'){
    res.render('profiles/djprofile', { user });
  } else {
    res.render('profiles/userprofile', { user })
  }

});

//User#Create
router.post('/', register, (req, res, next) => {
  res.redirect('/login');
});

//User#Put
router.put('/:id', updateUser, (req, res, next) => {
  const user = req.user;
  res.redirect(`/users/${user.first_name}-${user.last_name}`);
});




module.exports = router;
