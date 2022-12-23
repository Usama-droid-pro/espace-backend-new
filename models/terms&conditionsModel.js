
const mongoose = require("mongoose")

const terms_conditionsSchema = new mongoose.Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    text:String
  },
  {
    timestamps: true,
  }
);

const terms_conditionsModel = mongoose.model("terms_conditions", terms_conditionsSchema);
module.exports=terms_conditionsModel

