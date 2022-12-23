const  mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    icon:String,
    name:{
        type:String,
        
    },
    
})

module.exports = mongoose.model ("currency" ,  currencySchema)