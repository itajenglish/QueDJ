const express = require('express');
const router = express.Router();


router.all(['/djboard','/userboard'], (req, res, next) => {
  const user = req.session.user;

  //Checks for user session and validates user to render the currect view.
  if (user) {
    if (user.type === "dj") {

      //Render view with fan data
      res.render('dashboards/djboard', { user });

    } else if (user.type === "fan") {

      //Render view with dj data
      res.render('dashboards/userboard', {'data': user});    }

  } else {

    //If user doesn't exisit redirect to login.
    res.redirect('/login')
  }

});


module.exports = router;
