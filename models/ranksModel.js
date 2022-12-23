
const mongoose = require("mongoose");

const ranksModel = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    unique_id:{
        type:String,
        enum:["BP1RG" , "BP2RD" , "BP3RR"]
    },
    name:String,
    commission:Number,
});

module.exports = mongoose.model("rank" , ranksModel)