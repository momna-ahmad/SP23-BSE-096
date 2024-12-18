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