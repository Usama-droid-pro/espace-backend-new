const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel")
const referralCodes = require("referral-codes")
const fs= require("fs");
const { ifError } = require("assert");
const admin_salesModel = require("../models/admin_salesModel")

exports.register= async (req,res)=>{

    try{

        const user_type= req.body.user_type;
        const is_payable = req.body.is_payable;
        const can_create_trade = req.body.can_create_trade;


        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        //Check if the user is already in the db
        const emailExists = await userModel.findOne({ email: req.body.email });
  
        if (emailExists) return res.status(400).json({
            message: "Email already exists",
            status:'failed'
        })
  
        //hash passwords
       
            var salt = await bcrypt.genSalt(10);
            var hashPassword = await bcrypt.hash(req.body.password, salt);

        if(req.file){
            var photo = req.file.path;
        }
        
        let referralCode = referralCodes.generate({
            length: 8,
            count: 1,
            charset: referralCodes.charset(referralCodes.Charset.ALPHABETIC),
          });
          


          //validation on attributes if user_type = trader
          if(user_type === "trader"){
            if(is_payable == "false" ){
                if(can_create_trade == "true"){

                }
                else{
                    return(
                        res.json({
                            message: "For the user_type trader ,can_create_trade must be true",
                            status:false
                        })
                    )
                }
            }
            else{
                return(
                    res.json({
                        message: "For the user_type trader , is_payable must be false",
                        status:false
                    })
                )
            }
          }


          if(user_type === "customer"){
            if(is_payable == "true" ){
                if(can_create_trade == "false"){

                }
                else{
                    return(
                        res.json({
                            message: "For the user_type customer ,can_create_trade must be false",
                            status:false
                        })
                    )
                }
            }
            else{
                return(
                    res.json({
                        message: "For the user_type customer , is_payable must be true",
                        status:false
                    })
                )
            }
          }

        const userRegister = new userModel({
        _id:mongoose.Types.ObjectId(),
        email:req.body.email,
        password:hashPassword,
        user_name:req.body.user_name,
        user_type:req.body.user_type,
        device_token:req.body.device_token,
        paypal_email:req.body.paypal_email,
        is_payable:req.body.is_payable,
        can_create_trade:req.body.can_create_trade,
        refferal_code:referralCode[0],
        photo:photo

        })

        const registeredUser = await userRegister.save();
       
        if(registeredUser){
            const token = jwt.sign({ _id: registeredUser._id }, process.env.TOKEN)
            res.json({
                message: "User has been Registered" ,
                result:registeredUser,
                statusCode:201,
                token:token
            })
        }
        else{
            res.json({
                message:"User could not be registered",
                result: result,
                statusCode:400
            })
        }

    }
    catch(e){
        res.json({
            message : "Error occurred while registering User",
            error: e.message,
            statusCode:404

        })
    }
}


exports.login = async (req,res)=>{
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
  
    const user = await userModel.findOne({ email: req.body.email });
  
    if (!user) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });
  
    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(400).json({
        message: "Email or Password is incorrect",
        status:"failed"
    });;

    const token = jwt.sign({ _id: user._id}, process.env.TOKEN);
    var payment_Details={}

    const foundResult = await admin_salesModel.findOne({invited_user_id:user._id});
    console.log(foundResult)
    if(foundResult){
        payment_Details.user_payment_status = true
    }
    else{
        payment_Details.user_payment_status = false
    }

    res.json({
        message: "Logged in successfully", 
        result:user,
        token: token,
        status:"success",
        payment_Details:payment_Details
        
    })


}


exports.checkLogin=(req,res)=>{
    
}


exports.getAllUsers = async (req,res)=>{

    try{
        const users = await userModel.find({});
        if(users){
            res.json({
                message: "All users fetched successfully",
                result: users,
                status:"success",
                statusCode:200
            })
        }
        else{
            res.json({
                message: "users could not be fetched",
                result:result,
                statusCode:404
            })
        }
    }
    catch(error){
        res.json({
            message: "error occurred while fetching users" ,
            error:error.message
        })
    }
}

exports.getSpecificUser = async(req, res)=>{
    try{
        const result = await userModel.findOne({_id:req.params.user_id})
        if(result){
            res.json({
                message: "User has been fetched",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message:"User could not be fetched",
            })
        }
    }
    catch(err){
        res.json({
            message: "error occurred while getting user",
            error:err.message,
            statusCode:500
        })
    }
}

exports.deleteUser = async(req, res)=>{
    try{
        const user_id = req.params.user_id;

        const foundResult = await userModel.findOne({_id:user_id});
            if(foundResult){
                if(foundResult.photo){
                    fs.unlink(foundResult.photo , (err)=>{
                        if(!err){
                            console.log("success")
                        }                    })
                }
            }


        const result = await userModel.deleteOne({_id: user_id})
        if(result.deletedCount>0){
            res.json({
                message: "user deleted successfully",
                result:result
            })
        }
        else{
            res.json({
                message: "could not delete user , user with this id may not exist",
                result:result
            })
        }
        
     }
     catch(err){
        res.json({
            message: "Error occurred while deleting user",
            error:err.message,
            statusCode:500
        })
     }
}


exports.updateUser = async (req,res)=>{
    try{
        const user_id = req.body.user_id
        const email = req.body.email
        const user_name = req.body.user_name;
        const device_token = req.body.device_token;


        if(req.file){
            const foundResult = await userModel.findOne({_id:user_id});
            if(foundResult){
                if(foundResult.photo){
                    fs.unlink(foundResult.photo , (err)=>{
                        if(!err){
                            console.log("success")
                        }                    })
                }
            }
        }

        if(req.file){
           var result=await userModel.findOneAndUpdate({_id:user_id},
                {
                   email:email,
                   user_name:user_name,
                   device_token:device_token,
                   photo:req.file.path
                },
                {
                    new:true
                })
        }
        else{
            var result=await userModel.findOneAndUpdate({_id:user_id},
                {
                   email:email,
                   user_name:user_name,
                   device_token:device_token,
                },
                {
                    new:true
                })
        }

    
                if(result){
                    res.json({
                        message: "updated successfully",
                        result: result,
                        statusCode:200
                    })
                }
                else{
                    res.json({
                        message: "failed to update successfully",
                        result: result
                    })
                }
        
    }
    catch(err){
        res.json({
            message:"error occurred while updating successfully",
            Error:err.message
        })
    }
}

exports.updateBankInfo = async(req,res)=>{
    try{
        const user_id = req.body.user_id;
        const paypal_email = req.body.paypal_email;
        
        const result = await userModel.findOneAndUpdate({_id:user_id} , {paypal_email:paypal_email} , {new:true});
        if(result){
            res.json({
                message: "updated successfully",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message: "failed to update successfully",
                result: result
            })
        }
    }
     catch(err){
        res.json({
            message:"error occurred while updating successfully",
            Error:err.message
        })
    }
}


exports.updatePassword =async (req,res)=>{
    try{
        const email = req.body.email;

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);


        const result = await userModel.findOneAndUpdate({email: email} ,
            {
                password:hashPassword
            },
            {
                new:true
            }) 

            if(result){
                res.json({
                    message: "Password has been updated",
                    result:result
            })
            }
            else{
                res.json({
                    message: "Password could not be updated successfully",
                    result:null
                })
            }
    }
    catch(err){
        res.json({
            message: "Error occurred while updating passwords",
            error:err.message
        })
    }
}




exports.getAllUsers_customers = async (req,res)=>{
    try{
        const result = await userModel.find({user_type:"customer"})
        if(result){
            res.json({
                message: "User with this type customer has been fetched",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message:"User could not be fetched",
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred while fetching user",
            status:false,
            
        })
    }
}
exports.getAllUsers_trader = async (req,res)=>{
    try{
        const result = await userModel.find({user_type:"trader"})
        if(result){
            res.json({
                message: "User with this type trader has been fetched",
                result: result,
                statusCode:200
            })
        }
        else{
            res.json({
                message:"User could not be fetched",
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred while fetching user",
            status:false,
            
        })
    }
}


exports.getAllDeviceTokens = async (req,res)=>{
    try{
        let array =[]
        const result = await userModel.find({});
        result.forEach(element => {
            if(element){
                if(element.device_token){
                    if(element.device_token!=="0"){
                        array.push(element.device_token);

                    }
                }
            }
        });

        if(array){
            res.json({
                message: "All device_tokens",
                result:array,
                status: true,

            })
        }
        else{
            res.json({
                message: "Could not get all device_tokens",
                status: false,
            })
        }
        
    }
    catch(e){
        res.json({
            message: "Error Occurred",
            error:e.message,
            status:false,
        })
    }
}

exports.checkReferral_exists = async (req,res)=>{
    try{
        const referral_code= req.query.referral_code;
        
        if(!referral_code){
            return (
                res.json({
                    message: "Please Provide referral code to check if it exists or not",
                    status:false
                })
            )
        }

        const result = await userModel.findOne({refferal_code: referral_code});
        if(result){
            res.json({
                message: "User with this referral code exists",
                status:true,
                result: result
            })
        }
        else{
            res.json({
                message: "Could not find user with this referral code",
                status:false,
                statusCode:404
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

const registerSchema = Joi.object({
  user_name: Joi.string(),
  email: Joi.string().min(6).email(),
  password: Joi.string().min(6),
  blockStatus: Joi.boolean(),
  device_token:Joi.string(),
  refferal_code: Joi.string(),
  user_type: Joi.string(),
  paypal_email: Joi.string(),
  is_payable: Joi.string(),
  can_create_trade: Joi.string()


});

const loginSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
});
