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
  
  
  await newProduct.save();
  
  // we will send data to model to save in db

    
    return res.redirect("/admin/products");

  // return res.send(newProduct);
  // return res.render("admin/product-form", { layout: "adminlayout" });
});



router.get("/admin/products", (req, res) => {
  let products = [
    {
      title: "IPhone",
      price: "One Kidney",
      description: "Sweet Dreams",
      _id: 1,
    },
    {
      title: "Nokia",
      price: "Half Kidney",
      description: "Sweet Dreams/2",
      _id: 1,
    },
  ];
  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});





module.exports = router;