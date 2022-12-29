
const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    from:{
        type:String,
        enum:["admin" , "trader" , "system"]
    },
    to:{
        type:String,
    },
    message: String,
    notification_type:{
        type:String,
        enum:[
         "new_trade" ,"trade_update" , "new_sale" , "sale_target_achieved" , "rank_update" , "payment_received"
        ]
    }
  },
  {
    timestamps: true,
  }
);

const privacyPolicyModel = mongoose.model("notification", notificationSchema);
module.exports=privacyPolicyModel

