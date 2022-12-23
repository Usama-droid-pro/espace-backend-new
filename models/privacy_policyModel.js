
const mongoose = require("mongoose")

const privacyPolicySchema = new mongoose.Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    text:String
  },
  {
    timestamps: true,
  }
);

const privacyPolicyModel = mongoose.model("privacy_policy", privacyPolicySchema);
module.exports=privacyPolicyModel

