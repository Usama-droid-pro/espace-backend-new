
const mongoose = require("mongoose")
const privacyPolicyModel = require("../models/privacy_policyModel")


exports.createPrivacyPolicy = async (req,res)=>{

    try{
        const text = req.body.text;

        const newPrivacyPolicy = await privacyPolicyModel({
            _id:mongoose.Types.ObjectId(),
            text: text
        })

        const result = await newPrivacyPolicy.save();

        if(result){
            res.json({
                message: "New Privicy policy has been created successfully",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not create new privacy policy",
                status: "failed"
            })
        }
    }
    catch(err){
        res.json({
            message: "Error creating privacy policy",
            error:err.message
        })
    }
}

exports.getAllPrivacyPolicy = async(req,res)=>{
    try{
        const result= await privacyPolicyModel.find({});
        if(result){
            res.json({
                message: "privacy policies fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch privacy policies",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching privacy policies",
            error:err.message
        })
    }
}

exports.deletePrivacyPolicy = async(req,res)=>{
    try{
        const privacyPolicyId = req.params.privacyPolicyId;
        const result= await privacyPolicyModel.deleteOne({_id: privacyPolicyId})

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

exports.updatePrivacyPolicy = async (req,res)=>{

    try{
        const privacyPolicyId = req.body.privacyPolicyId;
        const text = req.body.text;

        const result = await privacyPolicyModel.findOneAndUpdate({_id: privacyPolicyId} , {text:text} , {new:true});
        if(result){
            res.json({
                message: "Privacy policy updated successfully",
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