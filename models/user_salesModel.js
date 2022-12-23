
const mongoose = require("mongoose")
const user_salesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    invited_user_id:mongoose.Schema.Types.ObjectId,
    sale_user_id:mongoose.Schema.Types.ObjectId,
    year:String,
    month:String,
    year:String,
    transaction_id:String,
    referral_code:String,
    date_created:{
        type:Date,
        default:new Date(Date.now())
    }
})

module.exports = mongoose.model('user_sale' , user_salesSchema);

