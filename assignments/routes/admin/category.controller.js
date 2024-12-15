const express = require("express");
let router = express.Router();



const Category = require("../../models/category.model") ;

router.get("/admin/category" , async(req,res)=> {
    let categories = await Category.find() ;
    return res.render("admin/category" , {categories , layout : 'adminLayout' , pageTitle : "Manage your categories" } ) ;
})

router.get("/views/admin/create-category", (req,res)=>{
    return res.render("admin/create-category" , {layout : 'formLayout'}) ;
})

router.post("/views/admin/create-category" , (req,res)=>{
    
    let data = req.body ;
    
    let category = new Category(data) ;
    category.save() ;
    return res.redirect("/admin/category") ;
});

router.get("/admin/categories/delete/:id" , async (req,res)=>{
    
  await Category.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/category");
})

router.get("/admin/categories/edit/:id" , async(req,res)=>{
    let category = await Category.findById(req.params.id);
  return res.render("admin/edit-category", {
    layout: "adminlayout",
    category,
  });
})

router.post("/admin/categories/edit/:id" , async(req,res)=>{
    let category = await Category.findById(req.params.id);
  category.title = req.body.title;
  category.description = req.body.description;
  category.price = req.body.price;
  await category.save();
  return res.redirect("/admin/category");
})

module.exports = router ;