
const mongoose = require("mongoose");

const tradeModel = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    addedBy :{
        type:String,
        enum: ['admin' ,'trader']
    },
    addedBy_id:{
        type:String,
    },
    trade_type:{
        type:String,
        enum: ["short" , "long" , "medium"]
    },
    currency1_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"currency"
    },
    currency2_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"currency"
    },
    buy_price :{
        type: String,
    },
    current_price:{
        type: String,

    },
    pips:String,
    rir:{
        type: String,
        enum: ["fair" , "good" , "excellent" ,"poor"]
    },
    trade_status:{
        type: String,
        enum:["active" , "closed"],
        default:"active"
    },
    takeProfit:Array,
    stopLoss:Array,
    date_of_trade:{
        type:Date,
    }
    
})

module.exports =mongoose.model ("trade" , tradeModel)