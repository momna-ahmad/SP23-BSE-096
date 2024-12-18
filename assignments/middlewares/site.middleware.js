let User = require("../models/user.model");

module.exports = async function (req, res, next) {
  let defaultUser = await User.findOne({ email: "momina@momina.com" });

  if (defaultUser) {
    // Dynamically assign role based on email
    if (defaultUser.email === "momina@momina.com") {
      console.log("executed");
      defaultUser.role = "admin";  // Assign 'admin' role for this specific user
    } else {
      console.log("user") ;
      defaultUser.role = "user";   // Default role for all other users
    }

    // Set the user with the correct role in session
    req.session.user = defaultUser;  // Store the whole user object in session
    res.locals.user = req.session.user;  // Pass user info to views (if needed)
    req.user = req.session.user;  // Store in req.user for easier access
  }

  next();
};
