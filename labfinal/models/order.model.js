const mongoose = require("mongoose");

let orderSchema = mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,  // Refers to the Customer model
        required: true,
        ref: 'user', 
      },
      date: {
        type: Date,
        default: Date.now,  // Sets the default to the current time
        required: true,
      },
      items : [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Product' ,
        required : true 
      }],
      total: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered'],  // Valid statuses for an order
        default: 'Pending',  // Default to 'Pending' if no status is provided
      },
      location: {
        type: String ,
        required : true
      }
});

let orderModel = mongoose.model("order", orderSchema);

module.exports = orderModel;