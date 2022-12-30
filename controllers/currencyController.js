
const mongoose = require("mongoose")
const currencyModel = require("../models/currencyModel")
const fs = require("fs");
const { log } = require("console");


exports.createCurrency = async (req,res)=>{

    try{
        const name = req.body.name;
        console.log(req.file)
        if(req.file){
            var icon = req.file.path;
        }
        if(name==""){
            return(
                res.json({
                    message: "name could not be empty",
                    status:false
                })
            )
        }


        const foundName = await currencyModel.findOne({name:  { 
            "$regex": "^" + name + "\\b", "$options": "i"
        }});
        if(!foundName) {
            const newCurrency = await currencyModel({
                _id:mongoose.Types.ObjectId(),
                name:name,
                icon:icon
    
            })

            const result = await newCurrency.save();

        if(result){
            res.json({
                message: "New currency has been created successfully",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not create new currency",
                status: "failed"
            })
        }
        }
        else{
            res.json({
                message: "This name already exists",
                status:false
            })
        }
        

        
    }
    catch(err){
        res.json({
            message: "Error creating currency",
            error:err.message
        })
    }
}

exports.getAllCurrencies = async(req,res)=>{
    try{
        const result= await currencyModel.find({});
        if(result){
            res.json({
                message: "currencies fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch currencies",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching currencies",
            error:err.message
        })
    }
}

exports.getCurrencyById = async (req,res)=>{
    try{
        const currency_id = req.query.currency_id;

        const result = await currencyModel.findOne({_id: currency_id});
        if(result){
            res.json({
                message: "currency fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch currency",
                status: "failed"
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error fetching ",
            error:err.message
        })
    }
}

exports.deleteCurrency = async(req,res)=>{
    try{
        const currency_id = req.query.currency_id;

        const foundResult = await currencyModel.findOne({_id: currency_id});
        if(foundResult){
            if(foundResult.icon){
                fs.unlink(foundResult.icon , (err)=>{
                    if(!err){
                        console.log("icon deleted");
                    }
                   
                })
            }
        }

        
        const result= await currencyModel.deleteOne({_id: currency_id})

        if(result.deletedCount>0){
            res.json({
                message: "Deleted",
                result:result
            })
        }
        else{
            res.json({
                message: "could not deleted",
                status:"failed"
            })
        }
    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message
        })
    }
}

exports.updateCurrency = async (req,res)=>{

    try{
        const currency_id = req.body.currency_id;
        const name  = req.body.name;

        if(req.file){
            const foundResult = await currencyModel.findOne({_id: currency_id});
            console.log(foundResult)
            if(foundResult){
                if(foundResult.icon){
                    fs.unlink(foundResult.icon , (err)=>{
                        if(!err){
                            console.log("icon deleted");
                        }
                        else{
                        console.log(err)
                        }
                       
                    })
                }
            }
            
        }

        if(req.file){
            var result = await currencyModel.findOneAndUpdate({_id: currency_id} , {name:name , icon:req.file.path}  , {new:true});
        }
        else{
            var result = await currencyModel.findOneAndUpdate({_id: currency_id} , {name:name} , {new:true});

        }
        if(result){
            res.json({
                message: "currency updated successfully",
                result:result,
                status: 'success'
            })
        }
        else{
            res.json({
                message: "could not updated",
                result:null,
                status:"false"
            })
        }
    }
    catch(err){
        res.json({
            message: "error",
            error:err.message
        })
    }
}