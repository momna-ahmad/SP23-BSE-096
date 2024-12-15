const mongoose = require("mongoose");

let categorySchema = mongoose.Schema({
  title: String,
  image : String,
  
});

let categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;