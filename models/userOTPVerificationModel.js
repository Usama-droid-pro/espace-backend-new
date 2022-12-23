const mongoose=require("mongoose")
const Schema= mongoose.Schema

const userOTPVerificationSchema = new mongoose.Schema({
    userId:mongoose.Schema.Types.ObjectId,
    otp : String,
    email : String,
})
const UserOTPVerificationModel= mongoose.model("userOTPVerification" , userOTPVerificationSchema)
module.exports=UserOTPVerificationModel;