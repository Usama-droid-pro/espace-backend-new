const mongoose = require("mongoose");

const stopLossSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    trade_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"trade"
    },
    stop_loss_name: {
        type:String
    },
    amount:String,
    pips:String,
})

module.exports = mongoose.model("stop_loss" , stopLossSchema)