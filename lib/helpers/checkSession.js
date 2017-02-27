module.exports = (req, res, next) => {
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
}
