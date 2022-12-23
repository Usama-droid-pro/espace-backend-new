
const mongoose = require('mongoose');

const bonusPlanModel = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    rank_uniq_id:{
        type:String
    },
    sales_no:String,
    bonus_price:String
});

module.exports = mongoose.model ('bonus_plan' , bonusPlanModel);