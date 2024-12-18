module.exports = async function (req, res, next) {
    if (!req.session.user)
      {
        console.log('auth middleware') ;
        return res.redirect("/login");
      }
    else next();
  };