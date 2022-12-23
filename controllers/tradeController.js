const mongoose = require("mongoose");
const tradeModel = require("../models/tradeModel");
const ObjectId = require("mongodb").ObjectId;

exports.createTrade = async (req,res)=>{
    try{
        let addedBy = req.body.addedBy;
        let trade_type = req.body.trade_type;
        let currency1_id= req.body.currency1_id;
        let currency2_id= req.body.currency2_id;
        const buy_price= req.body.buy_price;
        const current_price= req.body.current_price;
        const pips = req.body.pips;

        let rir= req.body.rir;

        trade_type= trade_type.toLowerCase();
        rir=rir.toLowerCase();
        addedBy= addedBy.toLowerCase();

        var addedBy_id = req.body.addedBy_id;

        if(addedBy === "admin" && addedBy_id !=0){
            return(
                res.json({
                    message: "If added by is admin then addedBy_id must be 0"
                })
            )
        }
        if(addedBy === "admin" && addedBy_id==0){
            addedBy_id = 0
        }
        
        if(addedBy==="trader"){
            addedBy_id=req.body.addedBy_id
        }

        const newTrade =  new tradeModel({
            _id:mongoose.Types.ObjectId(),
            addedBy:addedBy,
            addedBy_id:addedBy_id,
            trade_type:trade_type,
            currency1_id:currency1_id,
            currency2_id:currency2_id,
            buy_price:buy_price,
            current_price:current_price,
            pips:pips,
            rir:rir,

        })
        const result = await newTrade.save();

        if(result){
            res.json({
                message: "New Trade has been Created",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not create Trade",
                status:false,
            })
        }
        
    
    }
    catch(err){
        res.json({
            message: "Error Occurred while creating trade",
            status:false,
            error:err.message
        })
    }
}

exports.getAllTrades = async (req,res)=>{
    try{
        const result = await tradeModel.aggregate([
            {
                
                    $lookup:{
                        from: "stop_losses",
                        localField:'_id',
                        foreignField:'trade_id',
                        as : "stop_losses"
                    }
                
            },
            {
                
                $lookup:{
                    from: "take_profits",
                    localField:'_id',
                    foreignField:'trade_id',
                    as : "take_profits"
                }
            
        }
        ]);

        if(result){
            res.json({
                message: "All Trades has fetched",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not fetch trades",
                status:false,
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            error:err.message,
            status:false

        })
    }
}

exports.getTradeById = async (req,res)=>{
    try{
        let  trade_id = req.query.trade_id;
        trade_id= new ObjectId(trade_id);

        const result = await tradeModel.aggregate([

            {
                $match:{
                    _id:trade_id
                }
            },
            {
                
                $lookup:{
                    from: "stop_losses",
                    localField:'_id',
                    foreignField:'trade_id',
                    as : "stop_losses"
                }
            
        },
        {
            
            $lookup:{
                from: "take_profits",
                localField:'_id',
                foreignField:'trade_id',
                as : "take_profits"
            }
        
    }
        ]);

        if(result){
            res.json({
                message: "Trade with this id has fetched",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not fetch trade",
                status:false,
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            error:err.message,
            status:false

        })
    }
}

exports.getAllTradersByTraderId = async (req,res)=>{
    try{
        let  trader_id = req.query.trader_id;
        trader_id= new ObjectId(trader_id);

        const result = await tradeModel.aggregate([

            {
                $match:{
                    addedBy:trader_id
                }
            },
            {
                
                $lookup:{
                    from: "stop_losses",
                    localField:'_id',
                    foreignField:'trade_id',
                    as : "stop_losses"
                }
            
        },
        {
            
            $lookup:{
                from: "take_profits",
                localField:'_id',
                foreignField:'trade_id',
                as : "take_profits"
            }
        
    }
        ]);

        if(result){
            res.json({
                message: "Trade with this id has fetched",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not fetch trade",
                status:false,
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            error:err.message,
            status:false

        })
    }
}


exports.getAllTradesByAdmin = async (req,res)=>{
    try{
        const result = await tradeModel.aggregate([

            {
                $match:{
                    addedBy:"admin",
                }
            },
            {
                
                $lookup:{
                    from: "stop_losses",
                    localField:'_id',
                    foreignField:'trade_id',
                    as : "stop_losses"
                }
            
        },
        {
            
            $lookup:{
                from: "take_profits",
                localField:'_id',
                foreignField:'trade_id',
                as : "take_profits"
            }
        
    }
           
        ]);

        if(result){
            res.json({
                message: "All trades of admin has fetched successfully",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not fetch admin trades",
                status:false,
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            error:err.message,
            status:false

        })
    }
}

exports.getAllTradesByTrader = async (req,res)=>{
    try{
        const result = await tradeModel.aggregate([

            {
                $match:{
                    addedBy:"trader",
                }
            },
            {
                $lookup:{
                    from : "users",
                    localField:"addedBy_id",
                    foreignField:'_id',
                    as:"traderDetails"
                }
            },
            {
                
                $lookup:{
                    from: "stop_losses",
                    localField:'_id',
                    foreignField:'trade_id',
                    as : "stop_losses"
                }
            
        },
        {
            
            $lookup:{
                from: "take_profits",
                localField:'_id',
                foreignField:'trade_id',
                as : "take_profits"
            }
        
    }
        ]);

        if(result){
            res.json({
                message: "Trades created by trader fetched",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not fetch trades",
                status:false,
            })
        }

        
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            error:err.message,
            status:false

        })
    }
}

exports.deleteTradeById = async (req,res)=>{
    try{
        const trade_id = req.query.trade_id;

        const result = await tradeModel.deleteOne({_id:trade_id});
        if(result.deletedCount>0){
            res.json({
                message: "Trade with this id deleted",
                result: result,
                status:true
            })
        }else{
            res.json({
                message: "could not delete trade , Trade with this id may not exist",
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message:"error",
            error:err.message,
            status:false
        })
    }
}

exports.deleteAllTradesOfAdmin = async (req,res)=>{
    try{
        const result = await tradeModel.deleteMany({addedBy:"admin"});
        console.log(result);
        if(result.deletedCount>0){
            res.json({
                message: result.deletedCount + " trades by admin deleted successfully",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "No any trade of admin deleted",
                status:true,
            })
        }
    }
    catch(err){
        res.json({
            message:"error",
            error:err.message,
            status:false
        })
    }
}

exports.deleteAllTradesOfTraders = async (req,res)=>{
    try{
        const result = await tradeModel.deleteMany({addedBy:"trader"});
        console.log(result);
        if(result.deletedCount>0){
            res.json({
                message: result.deletedCount + " trades by trader deleted successfully",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "No any trade of trader deleted",
                status:true,
            })
        }
    }
    catch(err){
        res.json({
            message:"error",
            error:err.message,
            status:false
        })
    }
}

exports.updateTakeProfit = async (req,res)=>{
    try{
        const takeProfit = req.body.takeProfit;
        const trade_id = req.body.trade_id;

        const result = await tradeModel.findOneAndUpdate({_id:trade_id} , {takeProfit:takeProfit} , {new:true});

        if(result){
            res.json({
                message: "trade take profit updated",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not update take profit of trade",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message:"error",
            error:err.message,
            status:false
        })
    }
}
exports.updateStopLoss = async (req,res)=>{
    try{
        const stopLoss = req.body.stopLoss;
        const trade_id = req.body.trade_id;

        const result = await tradeModel.findOneAndUpdate({_id:trade_id} , {stopLoss:stopLoss} , {new:true});

        if(result){
            res.json({
                message: "trade stop loss updated",
                result: result,
                status:true,
            })
        }
        else{
            res.json({
                message: "Could not update stop loss of trade",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message:"error",
            error:err.message,
            status:false
        })
    }
}

// exports.updateTrade = async (req,res)=>{
//     try{
//         const 
//     }
// }

exports.active_close_trade = async (req,res)=>{
    try{
        let trade_status =  req.query.trade_status;
        trade_status  = trade_status.toLowerCase();
        const trade_id = req.query.trade_id;


        if(trade_status =="active" || trade_status ==="closed"){
            const result = await tradeModel.findOneAndUpdate({_id:trade_id } , {trade_status: trade_status} , {new:true});

        if(result){
            res.json({
                message: "Trade status has been updated successfully",
                result: result,
                status:true
            })
        }
        else{
            res.json({
                message: "Could not update . trade with this id may not exist",
                status:false,
            })
        }
        } 
        else{
            res.json({
                message: "trade_status must ne one of these = [active , closed]"
            })
        }  
    }
    catch(err){
        res.json({
            message: "Error Occurred",
            status:false,
            error:err.message
        })
    }
}

exports.deleteTradesOfSpecificTrader = async(req,res)=>{
    try{
        const trader_id = req.query.trader_id;
        const result = await tradeModel.deleteMany({addedBy_id:trader_id});

        if(result.deletedCount>0){
            res.json({
                message: "total of "+ result.deletedCount+" trades of trader deleted",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message: "Could not deleted",
                status:false,
            })
        }
    }
    catch(err){
        res.json({
            message: "Error",
            status:false,
            error:err.message
        })
    }
}