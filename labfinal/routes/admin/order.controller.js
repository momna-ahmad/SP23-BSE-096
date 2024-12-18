const express = require("express");
let router = express.Router();
const Product = require("../../models/product.model") ;
const Order = require("../../models/order.model") ;



//user checkout form 
router.get("/check-out", async(req, res)=>{
    console.log('user credentials' + req.cookies.user) ;
    let cart = req.cookies.cart;
    cart = cart ? cart : [];
    let products = await Product.find({ _id: { $in: cart } });
    return res.render("partials/order-form" , {
        layout : 'formLayout' ,
        products
    })
  });


  //user form submission for checkout
  router.post("/check-out", async(req,res)=>{
    try {
        const { products, total, location } = req.body;

        // Create a new order instance with the form data
        const newOrder = new Order({
            products: JSON.parse(products),  // Parse the product JSON string into an array
            total: parseFloat(total),        // Ensure the total is a number
            location: location,
        });

        // Save the new order to the database
        await newOrder.save();

        // Respond with success message and order details
        res.status(201).json({
            message: 'Order placed successfully!',
            order: newOrder
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing the order' });
    }
  }) ;

  //order displayed to admin
router.get("/admin/orders" , (req,res)=>{
    let orders = Order.find().sort({ orderDate: -1 }) ;
    return res.render("admin/orders" , {layout : "adminLayout" , orders } ) ;
});

//handling order deletion for when order has been delivered or cancelled
router.get("admin/orders/delete/:id" ,async (req,res)=>
{
  let order = await Order.findByIdAndDelete(req.params.id);
  return res.redirect("/admin/orders");
});


//route to edit the status of an order
router.get("admin/orders/edit/shipped/:id" ,async (req,res)=>
    {
      let order = await Order.findByIdAndDelete(req.params.id);
      order.status = 'Shipped' ;
      await order.save()
      return res.redirect("/admin/orders");
    });

    router.get("admin/orders/edit/pending/:id" ,async (req,res)=>
      {
        let order = await Order.findByIdAndDelete(req.params.id);
        order.status = 'Pending' ;
        await order.save()
        return res.redirect("/admin/orders");
      });

      router.get("admin/orders/edit/delivered/:id" ,async (req,res)=>
        {
          let order = await Order.findByIdAndDelete(req.params.id);
          order.status = 'Delivered' ;
          await order.save()
          return res.redirect("/admin/orders");
        });

module.exports = router ;
