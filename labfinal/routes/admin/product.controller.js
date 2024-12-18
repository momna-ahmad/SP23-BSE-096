const express = require("express");
let router = express.Router();


const Product = require("../../models/product.model") ;


router.get("/admin/products", async (req, res) => {
  console.log(req.session.userId) ;
let products =  await Product.find().populate('category') ;

  return res.render("admin/products", {
    layout: "adminlayout",
    pageTitle: "Manage Your Products",
    products,
  });
});


router.get("/shop-now/:page?", async (req, res) => {
  let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find()
    .limit(pageSize)
    .skip((page - 1) * pageSize);

    const stylesheets = [ '/css/styles.css' , '/css/products-page.css']

  return res.render("partials/mainMenu", {
    layout: 'index',
    stylesheet :  stylesheets,
    pageTitle: "Manage Your Products",
    products,
    page,
    pageSize,
    totalPages,
    totalRecords,
  });
});



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

router.get("/sort-lowtohigh/:page?", async(req,res)=>{
  let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find().sort({ price: 1 })
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
    products,
    page,
    pageSize,
    totalPages,
    totalRecords,
  })
} )

router.get("/sort-hightolow/:page?", async(req,res)=>{
  let page = req.params.page;
  page = page ? Number(page) : 1;
  let pageSize = 6;
  let totalRecords = await Product.countDocuments();
  let totalPages = Math.ceil(totalRecords / pageSize);
  // return res.send({ page });
  let products = await Product.find().sort({ price: -1 })
    .limit(pageSize)
    .skip((page - 1) * pageSize);

  const stylesheets = [ '/css/styles.css' , '/css/products-page.css']
  return res.render("partials/mainMenu" , {
    layout: 'index' ,
   stylesheet :  stylesheets,
    products,
    page,
    pageSize,
    totalPages,
    totalRecords,
  })
} )
 

//routes for cart functionality
router.get("/add-to-cart/:id" , (req,res)=>{
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  res.redirect("/shop-now") ;
});

router.get("/cart", async(req,res)=>{
  let cart = req.cookies.cart;
  cart = cart ? cart : [];
  let products = await Product.find({ _id: { $in: cart } });
  let stylesheet = ["/css/styles" , "/css/mainMenuStyles"] ;
  return res.render("partials/cart", { products , stylesheet, layout:"index" });
}) ;

module.exports = router;