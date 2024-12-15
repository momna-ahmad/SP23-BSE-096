const express = require("express");
const mongoose = require("mongoose");



var expressLayouts = require("express-ejs-layouts");
let server = express();
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
server.use(adminProductsRouter);

let createform = require("./routes/admin/create.form") ;
server.use(createform) ;

let adminCategoryController = require("./routes/admin/category.controller");
server.use(adminCategoryController) ;



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

server.get("/admin/mainmenu", async (req, res) => {
  let Product = require("./models/product.model");
  let products = await Product.find();
  return res.render("partials/mainMenu",
     {
      stylesheet: '/css/mainMenuStyles.css',
      layout: 'index' ,
      
      products
     });
});





server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});