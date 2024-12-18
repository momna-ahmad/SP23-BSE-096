const express = require("express");
const mongoose = require("mongoose");

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();
const session = require('express-session');
const cookieParser = require("cookie-parser"); 




// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Configure Multer with Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg'], // Restrict file types
  },
});

const upload = multer({ storage: storage });


var expressLayouts = require("express-ejs-layouts");
let server = express();


server.use(cookieParser())
server.use(session({ secret: "My session secret" }));



server.set("view engine", "ejs");
server.use(expressLayouts);




let connectionString = "mongodb://localhost/alexandermcqueen";
mongoose
  .connect(connectionString)
  .then( async () =>
    {
      console.log("Connected to Mongo DB Server: " + connectionString);
    } )
  .catch((error) => console.log(error.message));


//expose public folder for publically accessible static files
server.use(express.static("public"));


// add support for fetching data from request body
server.use(express.urlencoded());

let siteMiddleware = require("./middlewares/site.middleware");
let authMiddleware = require("./middlewares/auth.middleware");
let adminMiddleware = require("./middlewares/admin.middleware");
server.use(siteMiddleware);



let adminProductsRouter = require("./routes/admin/product.controller");
let createform = require("./routes/admin/create.form") ;
let adminCategoryController = require("./routes/admin/category.controller");
let userController = require("./routes/admin/user.controller") ;
let orderController = require("./routes/admin/order.controller") ;

server.use(userController) ;
server.use(adminProductsRouter);
server.use(createform) ;
server.use(adminCategoryController) ;
server.use(orderController) ;





const Category = require("./models/category.model") ;


server.get("/about-me", (req, res) => {
  return res.render("about-me");
});
server.get("/admin/homepage", (req, res) => {
  
  return res.render("homepage");
});

server.get('/', (req,res)=>{


    let btn ;
    
    if(req.query.btn)
    {
      btn = req.query.btn;
      console.log(btn) ;
    }
      
    else
    {
      btn = "partials/login-tag" ;
    }
    
    // If not an admin, render the main menu or a regular page
    return res.render("partials/mcqueenbody", {
      layout: "index", 
      btn,
      stylesheet: "/css/styles.css"
    });

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
          return res.redirect("/admin/homepage");  // Admin redirected to admin homepage
      } else {
          return res.redirect("/?btn=partials/logout-tag");  // Regular user redirected to homepage
      }

  } catch (error) {
      console.error(error);
      return res.redirect("/login");  // Redirect back to login page on error
  }
});



//route to handle category form submission
server.post("/views/admin/create-category", upload.single('image') , async(req,res)=>{

  if (req.file) {
    console.log('File uploaded successfully! ');
  } else {
    console.log('File upload failed.');
  }
  let data = req.body;
  data.image = req.file.path;
  console.log(data) ;
    let category = new Category(data) ;
  
    await category.save() ;
    return res.redirect("/admin/category" ) ;
    
});

server.use("/", authMiddleware, adminMiddleware, adminProductsRouter);



server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});