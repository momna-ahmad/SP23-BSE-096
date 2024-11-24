const express = require("express");
let router = express.Router();
let Product = require("../../models/product.model");

//form is fetched
router.get('/views/admin/create', (req,res)=> {
    return res.render("admin/create",{
        layout: "formLayout" 
    }) ;
  });

//form submission handled here
  router.post("/views/admin/create", async (req, res) => {
    let data = req.body;
    console.log(data) ;
    let newProduct = new Product(data);
    newProduct.title = data.title;
    await newProduct.save();
    return res.redirect("/admin/products");
    // we will send data to model to save in db
  
    // return res.send(newProduct);
    // return res.render("admin/product-form", { layout: "adminlayout" });
  });

  module.exports = router;