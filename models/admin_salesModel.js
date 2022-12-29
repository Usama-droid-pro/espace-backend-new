
const mongoose = require("mongoose");

const admin_salesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    referral_id:String,
    invited_user_id:String,
    day:String,
    year:String,
    month:String,
    referral_exist:Boolean,
    date_created:{
        type:Date,
        default:new Date(Date.now()),
    },
    transaction_id:String,   
    product_price :String,
    user_current_rank:String,
    admin_profit:String,
    user_commission:String,
})

module.exports = mongoose.model("admin_sale" , admin_salesSchema)

