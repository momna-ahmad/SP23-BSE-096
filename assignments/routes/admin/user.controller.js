const express = require("express");
const bcrypt = require('bcryptjs');

let router = express.Router();
const User  = require("../../models/user.model") ;

router.get('/register', (req , res) => {
    return res.render("partials/register" , {layout: "formLayout"  }) ;
})

router.post("/register", async(req,res)=>{
    let data = req.body ; 
    newUser = new User(data) ;
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt)
    await newUser.save(); 
    return res.redirect("/login") ;
})

router.get("/login" , (req,res)=>{
  return res.render('partials/login', { layout : "formLayout", successMessage:"registeration successful" });
})

router.post("/login" , async(req,res)=>{
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // If user does not exist
        if (!user) {
           let successMessage = "User not found";
            return res.redirect('/login');  // Redirect back to login page
        }

        // Compare the password provided by the user with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            let successMessage = "Wrong password" ;
            return res.redirect('/login');  // Redirect back to login page
        }

        // If the password matches, you can set a session or a token
        // For example, using sessions:
        req.session.userId = user._id;  // Set the session with userId
        let successMessage = "login successful" ;
        return res.render("partials/mcqueenbody", {layout : "index"});  // Redirect to the dashboard or home page

    } catch (error) {
        console.error(error);
        let successMessage = "server error" ;
        res.redirect('/login');  // Redirect back to login page on error
    }

} )

module.exports = router;