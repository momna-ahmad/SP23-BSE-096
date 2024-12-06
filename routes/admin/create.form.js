const express = require("express");
let router = express.Router();
const multer = require('multer');
let Product = require("../../models/product.model");



// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});

const upload = multer({ storage: storage });


//form is fetched
router.get('/views/admin/create', (req,res)=> {
  return res.render("admin/create",{
      layout: "formLayout" 
  }) ;
});

//form submission handled here
router.post("/views/admin/create", upload.single("file"), async (req, res) => {
  let data = req.body;
  console.log(data) ;
  let newProduct = new Product(data);
  
  if (req.file) {
    newProduct.picture = req.file.filename;
  }
  await newProduct.save();
  
  // we will send data to model to save in db

    
    return res.redirect("/admin/products");

  // return res.send(newProduct);
  // return res.render("admin/product-form", { layout: "adminlayout" });
});

module.exports = router;