const express = require("express");
let router = express.Router();

const Product = require("../../models/product.model") ;


router.get("/admin/products", async (req, res) => {
  
let products =  await Product.find().populate('category') ;

  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});

router.get("/shop-now" , async(req, res) => {
  let products =  await Product.find() ;
  return res.render("partials/mainMenu" , {
   stylesheet : 'css/mainMenuStyles' ,
      layout: 'index' ,
    products
  })
})

router.get("/admin/products/delete/:id" , async(req, res) =>{
  let params = req.params;
  let product = await Product.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/products");
})

router.get("/admin/products/edit/:id" , async(req,res)=> {
  let product = await Product.findById(req.params.id);
  return res.render("admin/edit-product", {
    layout: "adminlayout",
    product,
  });
})

router.post("/admin/products/edit/:id" , async(req,res)=>{
  let product = await Product.findById(req.params.id);
  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  await product.save();
  return res.redirect("/admin/products");
})


module.exports = router;