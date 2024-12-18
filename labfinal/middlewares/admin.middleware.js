module.exports = async function (req, res, next) {
  if (!req.session.user?.role || req.session.user.role !== "admin") {
    console.log('Not an admin or no role found, redirecting to login');
    return res.redirect("/login");
  }
  console.log('Admin user detected, proceeding to admin page');
  next();
};
