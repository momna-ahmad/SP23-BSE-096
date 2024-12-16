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
  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
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

router.get("/sort-lowtohigh", async(req,res)=>{
  let products = await Product.find().sort({ price: 1 });
  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
    products
  })
} )

router.get("/sort-hightolow", async(req,res)=>{
  let products = await Product.find().sort({ price: -1 });
  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
    products
  })
} )


module.exports = router;