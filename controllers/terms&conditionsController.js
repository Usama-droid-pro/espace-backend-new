
const mongoose = require("mongoose")
const terms_conditionsModel = require("../models/terms&conditionsModel")


exports.createTerms_conditions = async (req,res)=>{

    try{
        const text = req.body.text;

        const newterms_conditions = await terms_conditionsModel({
            _id:mongoose.Types.ObjectId(),
            text: text
        })

        const result = await newterms_conditions.save();

        if(result){
            res.json({
                message: "New term&condition has been created successfully",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not create new term and condition",
                status: "failed"
            })
        }
    }
    catch(err){
        res.json({
            message: "Error creating term and condition",
            error:err.message
        })
    }
}

exports.getAllTerms_conditions = async(req,res)=>{
    try{
        const result= await terms_conditionsModel.find({});
        if(result){
            res.json({
                message: "all term and conditions fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch term and conditions",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching Term and conditions",
            error:err.message
        })
    }
}

exports.deleteTerms_conditions = async(req,res)=>{
    try{
        const terms_conditionsId = req.params.terms_conditionsId;
        const result= await terms_conditionsModel.deleteOne({_id: terms_conditionsId})

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

exports.updateTerms_conditions = async (req,res)=>{

    try{
        const terms_conditionsId = req.body.terms_conditionsId;
        const text = req.body.text;

        const result = await terms_conditionsModel.findOneAndUpdate({_id: terms_conditionsId} , {text:text} , {new:true});
        if(result){
            res.json({
                message: "term and condition updated successfully",
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