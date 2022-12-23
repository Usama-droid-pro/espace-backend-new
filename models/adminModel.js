const { string } = require("joi");
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
_id:mongoose.Schema.Types.ObjectId,
  user_name:String,
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },

  password: {
    type: String,
    required: true,
    max: 2048,
    min: 6,
  },
  paypal_email:String,
  img:String,
} 
);
module.exports = mongoose.model("admin", adminSchema);