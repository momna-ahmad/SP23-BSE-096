const express = require("express");
const mongoose = require("mongoose");
const session = require('express-session');


const cookieParser = require("cookie-parser"); 
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();



const app = express();

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

// Session middleware setup (required for flash messages)
server.use(session({
  secret: 'your-secret-key',  // Replace with a strong secret key
  resave: false,
  saveUninitialized: true
}));



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


let adminProductsRouter = require("./routes/admin/product.controller");
let createform = require("./routes/admin/create.form") ;

app.use(cookieParser());
app.use(session({
  secret: "Shh, it's a secret!",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }
}));
server.use(adminProductsRouter);


server.use(createform) ;


server.use(adminCategoryController) ;

let userController = require("./routes/admin/user.controller") ;
server.use(userController) ;


const Category = require("./models/category.model") ;


server.get("/about-me", (req, res) => {
  return res.render("about-me");
});
server.get("/", (req, res) => {
  
  return res.render("homepage");
});

server.get('/admin/homepage', (req,res)=>{
  return res.render("partials/mcqueenbody" , {
    layout : "index",
    stylesheet : '/css/styles.css'
  }) ;
})

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


server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});