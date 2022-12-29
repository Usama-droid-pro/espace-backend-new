const mongoose = require("mongoose");
const notificationModel = require("../models/notificationModel");


var ObjectId = require('mongoose').Types.ObjectId;

exports.createNotification = async (req,res)=>{
    try{
        const notification_type = req.body.notification_type;
        const from = req.body.from;
        const to= req.body.to;
        const message = req.body.message;



        if(!notification_type){
            return (
                res.json({
                    message: "notification_type must be provided",
                    status:false,
                })
            )
        }else{
            if(notification_type=="new_trade" || notification_type=="trade_update" || notification_type=="new_sale" || notification_type=="sale_target_achieved" || notification_type=="rank_update" || notification_type=="payment_received"){
                console.log("Ok")
            }
            else{
                return(
                    res.json({
                        message: "notification_type can only be one of these [new_trade, trade_update ,new_sale , sale_target_achieved , rank_update , payment_received]",
                        status:false,
                    })
                )
                
            }
        }


        
        if(!from){
            return (
                res.json({
                    message: "from , must be provided",
                    status:false,
                })
            )
        }
        if(!to){
            return (
                res.json({
                    message: "to must be provided",
                    status:false,
                })
            )
        }

        if(!message){
            return (
                res.json({
                    message: "message must be provided",
                    status:false,
                })
            )
        }


        if(notification_type =="new_trade" || notification_type == "trade_update"){
            if(from == "admin" || from == "trader"){
                
            }
            else{
                return (
                    res.json({
                        message: "when notification_type is(new_trade OR trade_update) 'from' can only be trader or admin",
                        status:false,
                    })
                )
            }
            
            if(to !== "all"){
                return (
                    res.json({
                        message: "when notification_type is(new_trade OR trade_update), 'to' must be  = 'all'"  ,
                        status:false,
                    })
                )
            }
        }

        if(notification_type =="new_sale" || notification_type =="sale_target_achieved" || notification_type =="rank_update" || notification_type =="payment_received") {
            if(from !== "system"){
                return (
                    res.json({
                        message: "when notification_type is(new_sale OR sale_target_achieved OR rank_update OR payment_received) 'from' can only be 'system'",
                        status:false,
                    })
                )
            }
            if(!ObjectId.isValid(to)){
                return (
                    res.json({
                        message: "when notification_type is(new_sale OR sale_target_achieved OR rank_update OR payment_received) 'to' must be a type of mongoose object id", 
                        status:false,
                    })
                )
            }
        }


        const savedNotification = new notificationModel({
            _id:mongoose.Types.ObjectId(),
            notification_type:notification_type,
            from:from,
            to:to,
            message:message
        });

        const result = await savedNotification.save();

        if(result){
            res.json({
                message: "Notification saved successfully",
                result: result,
                status:true
            })
        }
        else{
            res.json({
                message: "Notification could not be saved ",
                result: result,
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message: "An Error Occurred",
            status:false,
            error:err.message
        })
    }
}

exports.getAllNotifications = async (req,res)=>{
    try{
        const result = await notificationModel.find({});

        if(result){
            res.json({
                message: "All Notifications fetched successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"could not fetch all Notifications",
                status:false,
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


exports.getNotificationsForAll = async (req,res)=>{
    try{
        const result = await notificationModel.find({to:"all"});

        if(result){
            res.json({
                message: "All Global Notifications fetched successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"could not fetch all Notifications",
                status:false,
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
exports.NotificationsByAdmin = async (req,res)=>{
    try{
        const result = await notificationModel.find({from:"admin"});

        if(result){
            res.json({
                message: "All Notifications by admin fetched successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"could not fetch all Notifications",
                status:false,
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
exports.NotificationsByTrader = async (req,res)=>{
    try{
        const result = await notificationModel.find({from:"trader"});

        if(result){
            res.json({
                message: "All Notifications by trader fetched successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"could not fetch all Notifications",
                status:false,
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

exports.NotificationsBySystem = async (req,res)=>{
    try{
        const result = await notificationModel.find({from:"system"});

        if(result){
            res.json({
                message: "All Notifications by system fetched successfully",
                status:true,
                result:result
            })
        }
        else{
            res.json({
                message:"could not fetch all Notifications",
                status:false,
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



exports.getNotificationsOfSpecificUser = async (req,res)=>{
    try{
        let user_id = req.query.user_id;
       

        if(!user_id){
            return(
                res.json({
                    message: "Provide user_id to get notifications",
                    status:false
                })
            )
        }

        const result = await notificationModel.aggregate([
            {
                $match:{
                    to:user_id
                }
            },
            {
                $addFields: {
                    to: { $toObjectId: "$" }
                 }
            }
            ,
            {
                $lookup:{
                    from:"users",
                    localField:"to",
                    foreignField:"_id",
                    as : "user_details"
                }
            }
        ]);

        if(result){
            res.json({
                message:"Notifications for this user fetched successfully",
                status:"true",
                result:result
            })
        }
        else{
            res.json({
                message: "could not fetch notifications",
                status:false,
            })
        }
        
    }
    catch(err){
        res.json({
            message : 'Error Occurred',
            error:err.message,
            status:false
        })
    }
}

exports.deleteNotification = async (req,res)=>{
    try{
        const notification_id = req.query.notification_id;

        const result= await  notificationModel.deleteOne( {_id: notification_id} );
        if(result.deletedCount>0){
            res.json({
                message: "Notification deleted successfully",
                status: 'true'
            })
        }
        else{
            res.json({
                message: "Could not be deleted successfully",
                status:false
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