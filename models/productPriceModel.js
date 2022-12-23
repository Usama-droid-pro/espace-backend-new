
const mongoose = require("mongoose");

const productPriceModel = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    unique_id:String,
    price:String,
})

module.exports = mongoose.model("productPrice" , productPriceModel)