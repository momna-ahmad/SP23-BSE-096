const mongoose = require("mongoose");
const categoryModel = require("./category.model");

let productSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  picture : String,
  category : {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Category',
    required : true 
  }
});

let ProductModel = mongoose.model("Product", productSchema);

module.exports = ProductModel;