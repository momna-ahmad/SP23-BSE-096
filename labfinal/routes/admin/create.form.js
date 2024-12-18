const express = require("express");
let router = express.Router();
let multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Directory to store files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  },
});
const upload = multer({ storage: storage });
let Product = require("../../models/product.model");
const categoryModel = require("../../models/category.model");




//form is fetched
router.get('/views/admin/create', async(req,res)=> {
  let categories = await categoryModel.find() ;
  
  return res.render("admin/create",{
      layout: "formLayout",
      categories
  }) ;
});

//form submission handled here
router.post("/views/admin/create", upload.single("file"), async (req, res) => {
  let data = req.body;
  let newProduct = new Product(data);
  newProduct.title = data.title;
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