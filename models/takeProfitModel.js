const mongoose = require("mongoose");

const takeProfitSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    trade_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"trade"
    },
    take_profit_name: {
        type:String
    },
    amount:String,
    pips:String,
})

module.exports = mongoose.model("take_profit" , takeProfitSchema)