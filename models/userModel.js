
const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user_name:String,
    email:String,
    password:String,
    blockStatus:{
        type:Boolean,
        default:false,
    },
    device_token:String,
    photo :String,
    paypal_email:String,
    refferal_code:String,
    user_type:{
        type:String,
        enum:["customer" , "trader"]
    },
    is_payable:Boolean,
    can_create_trade:Boolean,
    current_rank:{
        type:String,
        enum:["BP1RG" , "BP2RD" , "BP3RR"],
        default:"BP1RG"
    },
    
})

module.exports=mongoose.model("user" , userSchema);

