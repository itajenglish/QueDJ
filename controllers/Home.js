const express = require('express');
const router = express.Router();
const { getAllDjs } = require('../models/Home');

//Checks for user session and what type of user you are to show currect view.
router.all('/', (req, res, next) => {
  const user = req.session.user;
  console.log(user)
  if (user) {
    if (user.type === "fan") {
      res.redirect('/userboard');
    } else if (user.type === "dj") {
      res.redirect("/djboard");
    }
  } else {
    next();
  }
})

// Home#Show
router.get('/', getAllDjs, (req, res, next) => {
    const djs = req.user;
    res.render('home/index', { djs });
});

module.exports = router;
