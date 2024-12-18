const express = require("express");
const bcrypt = require('bcryptjs');
const session = require('express-session');
const cookieParser = require("cookie-parser"); 
let router = express.Router();
const User  = require("../../models/user.model") ;



router.use(cookieParser());
// Session middleware setup (required for flash messages)
router.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
    }));

router.get('/register', (req , res) => {
    return res.render("partials/register" , {layout: "formLayout"  }) ;
});

router.post("/register", async(req,res)=>{
    let data = req.body ; 
    newUser = new User(data) ;
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt)
    await newUser.save(); 
    res.redirect("/login") ;
});

router.get("/login" , (req,res)=>{
  return res.render('partials/login', { layout : "formLayout", successMessage:"registeration successful" });
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
      // Find the user by email
      const user = await User.findOne({ email });

      // If user does not exist
      if (!user) {
          return res.redirect("/login");  // Redirect back to login page
      }

      // Compare the password provided by the user with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.redirect("/login");  // Redirect back to login page on incorrect password
      }

      // Set user session (ensure the role is correctly assigned)
      //req.session.user = user;  // Store the whole user object in session

      // Ensure the role is properly checked and set
    
      req.session.user = user;
      if (req.session.user.role === "admin" || user.role[0] === 'admin') {
        req.session.user.role = 'admin' ;
          return res.redirect("/admin/homepage");  // Admin redirected to admin homepage
      } else {
        req.session.user.role = 'user' ;
          return res.redirect("/?btn=partials/logout-tag");  // Regular user redirected to homepage
      }

  } catch (error) {
      console.error(error);
      return res.redirect("/login");  // Redirect back to login page on error
  }
});

router.get('/logout', (req, res) => {
  console.log('logging out')
  req.session.user = null;
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Failed to log out');
      }
  
      // Clear the session cookie
      res.clearCookie('connect.sid');  // Default cookie name for sessions
      res.redirect('/') ;
    });
  });


module.exports = router;