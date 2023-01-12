
const mongoose = require("mongoose")
const user_salesSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    referral_id:String,
    total_sales:Number,
    year:String,
    month:String,
    rank_id:String,
    transaction_id:String,
    commissions:String,
    bonus:String,
    payout_status:String,
    payout_amount:String,
    date_of_payout:String,
    date_created:{
        type:Date
    }
})

module.exports = mongoose.model('user_sale' , user_salesSchema);

