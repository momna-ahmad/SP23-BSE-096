const express = require("express");
const mongoose = require("mongoose");


var expressLayouts = require("express-ejs-layouts");
let server = express();
server.set("view engine", "ejs");
server.use(expressLayouts);


//expose public folder for publically accessible static files
server.use(express.static("public"));


// add support for fetching data from request body
server.use(express.urlencoded({ extended: true }));


let adminProductsRouter = require("./routes/admin/product.controller");
server.use(adminProductsRouter);

let createform = require("./routes/admin/create.form") ;
server.use(createform) ;


server.get("/about-me", (req, res) => {
  return res.render("about-me");
});
server.get("/", (req, res) => {
  return res.render("homepage");
});

let connectionString = "mongodb://localhost/alexandermcqueen";
mongoose
  .connect(connectionString)
  .then(() => console.log("Connected to Mongo DB Server: " + connectionString))
  .catch((error) => console.log(error.message));

server.listen(5000, () => {
  console.log(`Server Started at localhost:5000`);
});