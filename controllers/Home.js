const express = require('express');
const router = express.Router();
const { getAllDjs } = require('../models/Home');

router.all('/', (req, res, next) => {
  const user = req.session.user;
  if (user) {
    if (user.type === "fan") {
      console.log(user.type);
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
