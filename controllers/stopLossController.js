const mongoose = require('mongoose');
const stopLossModel= require("../models/stopLossModel");

exports.createStopLoss =async (req,res)=>{
    try{
        const trade_id = req.body.trade_id;
        let stop_loss_name = req.body.stop_loss_name;
        stop_loss_name= stop_loss_name.toUpperCase();
        const amount = req.body.amount;
        const pips = req.body.pips;

        // const  isValid = await checkName(take_profit_name);

        // console.log(isValid);

        const isObjectId= mongoose.isValidObjectId(trade_id);
        if (!isObjectId){
            return (res.json({
                message: "This Trade Id is not a valid object id",
                status:false,
            }))
        }
        let regex = /[S][L]\d+$/g
        let isMatch = stop_loss_name.match(regex)
        console.log(isMatch);

        if(isMatch){
            const stopLoss = new stopLossModel({
                _id:mongoose.Types.ObjectId(),
                trade_id:trade_id,
                stop_loss_name:stop_loss_name,
                amount:amount,
                pips:pips,
            });
    
            const result = await stopLoss.save();
            
            if (result){
                res.json({
                    message: "stop loss has been saved successfully",
                    status:true,
                    result: result
                })
            }
            else{
                res.json({
                    message: "stop loss could not saved successfully",
                    status:false,
                })
            }
        }
        else{
            res.json({
                message: "Stop_loss_name pattern is wrong , name must follow the pattern of SL1, SL2 ...",
                status:false,
            })
        }

      
    }
    catch(err){
        res.json(err.message);
    }
}

exports.getAllStopLoss = async (req,res)=>{
    try{
        const result = await stopLossModel.find({}).populate("trade_id");
        
        if(result){
            res.json({
                message: "All stop loss has been fetched ",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "could not fetch",
                status:false,

            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred while fetching",
            status:false,
            error:err.message
        })
    }
}


exports.getStopLossById= async (req,res)=>{
    try{
        const stopLoss_id=req.query.stopLoss_id;
        const result = await stopLossModel.findOne({_id:stopLoss_id}).populate("trade_id");
        
        if(result){
            res.json({
                message: "stop loss with this id  has been fetched ",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "could not fetch stop loss with this id",
                status:false,

            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred while fetching",
            status:false,
            error:err.message
        })
    }
}

exports.deleteStopLoss = async (req,res)=>{
    try{
        const stopLoss_id = req.query.stopLoss_id;
        const result = await stopLossModel.deleteOne({_id:stopLoss_id});
        
        if(result.deletedCount>0){
            res.json({
                message: "Deleted",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "could not deleted",
                status:false,

            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred while deleting",
            status:false,
            error:err.message
        })
    }
}

exports.updateStopLoss= async (req,res)=>{
    try{
        const stopLoss_id=req.body.stopLoss_id;
        const trade_id = req.body.trade_id;
        const amount = req.body.amount;
        const pips = req.body.pips;
        let stop_loss_name = req.body.stop_loss_name;
        


        if(stop_loss_name){
            stop_loss_name= stop_loss_name.toUpperCase();
            let regex = /[S][L]\d+$/g
            var isMatch = stop_loss_name.match(regex)
            console.log(isMatch);

            if(isMatch){
                var result = await stopLossModel.findOneAndUpdate({_id:stopLoss_id} , 
                    {
                        trade_id:trade_id,
                        stop_loss_name:stop_loss_name,
                        amount:amount,
                        pips:pips,
                    }
                    ,
                    {
                        new:true
                    });
            }
            else{
                return(res.json({
                    message: "stop_loss_name pattern is wrong , name must follow pattern of SL1 , SL2.."
                }))
                
            }
        }
        else{
            var result = await stopLossModel.findOneAndUpdate({_id:stopLoss_id} , 
                {
                    trade_id:trade_id,
                    amount:amount,
                    pips:pips,
                }
                ,
                {
                    new:true
                });
        }


        
        

        if(result){
            res.json({
                message: "stop loss updated ",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "could not updated",
                status:false,

            })
        }
    }
    catch(err){
        res.json({
            message : "Error Occurred while updating",
            status:false,
            error:err.message
        })
    }
}



