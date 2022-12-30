const mongoose = require('mongoose');
const takeProfitModel= require("../models/takeProfitModel");

exports.createTakeProfit =async (req,res)=>{
    try{
        const trade_id = req.body.trade_id;
        let take_profit_name = req.body.take_profit_name;
        take_profit_name= take_profit_name.toUpperCase();
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
        let regex = /[T][P]\d+$/g
        let isMatch = take_profit_name.match(regex)
        console.log(isMatch);

        if(isMatch){
            const takeProfit = new takeProfitModel({
                _id:mongoose.Types.ObjectId(),
                trade_id:trade_id,
                take_profit_name:take_profit_name,
                amount:amount,
                pips:pips,
            });
    
            const result = await takeProfit.save();
            
            if (result){
                res.json({
                    message: "Take profit has been saved successfully",
                    status:true,
                    result: result
                })
            }
            else{
                res.json({
                    message: "Take Profit could not saved successfully",
                    status:false,
                })
            }
        }
        else{
            res.json({
                message: "Pattern of name is wrong , Name must be like : TP1 ,TP2",
                status:false,
            })
        }

        
    }
    catch(err){
        res.json(err.message);
    }
}

exports.getAllTakeProfit = async (req,res)=>{
    try{
        const result = await takeProfitModel.find({}).populate("trade_id");
        
        if(result){
            res.json({
                message: "All Take profit has been fetched ",
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


exports.getTakeProfitById= async (req,res)=>{
    try{
        const takeProfit_id=req.query.takeProfit_id;
        const result = await takeProfitModel.findOne({_id:takeProfit_id}).populate("trade_id");
        
        if(result){
            res.json({
                message: "Take profit with this id  has been fetched ",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "could not fetch take profit with this id",
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

exports.deleteTakeProfit = async (req,res)=>{
    try{
        const takeProfit_id = req.query.takeProfit_id;
        const result = await takeProfitModel.deleteOne({_id:takeProfit_id});
        
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

exports.updateTakeProfit= async (req,res)=>{
    try{
        const takeProfit_id=req.body.takeProfit_id;
        const trade_id = req.body.trade_id;
        let take_profit_name = req.body.take_profit_name;
        const amount = req.body.amount;
        const pips = req.body.pips;



        if(take_profit_name){
            take_profit_name= take_profit_name.toUpperCase();
            let regex = /[T][P]\d+$/g
            let isMatch = take_profit_name.match(regex)
            console.log(isMatch);

            if(isMatch) {
                var result = await takeProfitModel.findOneAndUpdate({_id:takeProfit_id} , 
                    {
                        trade_id:trade_id,
                        take_profit_name:take_profit_name,
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
                    message: "take_profit_name must follow the order of TP1,TP2 , TP3 ... ",
                    status:false,
                }))
                
            }
           

        }
        else{
            var result = await takeProfitModel.findOneAndUpdate({_id:takeProfit_id} , 
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
                message: "Take profile updated ",
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



async function checkName (take_profit_name){
    take_profit_name = take_profit_name.split("");
    console.log(typeof (take_profit_name))
    console.log(take_profit_name[0])


    console.log(isNaN(take_profit_name[2]))
    if(take_profit_name[0]=="T"){
        if(take_profit_name[1]=="P"){
            for(var i=0; i<take_profit_name.length; i++){
                
            }
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
    
    return true;
    

    
    }