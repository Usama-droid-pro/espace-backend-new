

const userModel= require("../models/userModel")
const adminModel=require("../models/adminModel")

const emailOTPBody=require("../utils/emailOTPBody")

require('dotenv').config();
const nodemailer = require('nodemailer');
const userOTPVerificationModel= require("../models/userOTPVerificationModel")


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
       user: process.env.EMAIL_USERNAME,
       pass: process.env.EMAIL_PASSWORD,
    },
});



exports.emailVerification= (req,res)=>{

    const { email } = req.body;
    // const userId = req.body.userId;
    userModel.findOne({ email: email } , function(err, foundResult){
        if(foundResult){
            console.log(foundResult);
            sendOTPVerificationEmail(foundResult,res)
        }
        else{
             adminModel.findOne({email:email}, function(err,foundResult){
                if(foundResult){
                    console.log(foundResult);
                    sendOTPVerificationEmail({
                        _id:foundResult._id,
                        email:foundResult.email,
                        password:foundResult.password,
                    },res)
                }
                else{
                    res.json({
                        message:"No one found with This Email address",
                        status:false,
                     })
                }
             })
           
            }
        })
        
        
}

exports.verifyOTP= (req,res)=>{
    const { userEnteredOtp , email} = req.body;
     
    userOTPVerificationModel.findOne({email:email , otp:userEnteredOtp},(err , foundResult)=>{
        if(foundResult){
            console.log("record found for password updation")
            console.log(foundResult);
            res.json({
                message:"user found , OTP successfully matched",
                status:true,
                data:foundResult
            })

           
        }
        else{
            res.json({
                message: "no such record found with the following OTP =" +userEnteredOtp,
                status:false,
            })
        }
    })
    
}





const sendOTPVerificationEmail = async({_id,email},res)=>{
    try{
        const otp= `${Math.floor(1000+Math.random()*9000)}`
        console.log(otp)
        console.log(_id)
        console.log(email);

        const result = await userOTPVerificationModel.findOne({email:email})
        console.log(result)

        if(!result){
            const newOTPVerif= new userOTPVerificationModel({
                userId:_id,
                otp : otp,
                email: email,
               })
               newOTPVerif.save(function(err){
                if(!err){
                    console.log("new otp saved");
                }else{
                    console.log(err)
                }
               });
        }
        else{
            userOTPVerificationModel.findOneAndUpdate({email:email , userId:_id},
                {
                    otp:otp

                },
                {
                    new:true
                },
                function(err, result){
                    if(result){
                       console.log("otp saved , updated previous record")
                    }else if(err){
                        console.log(err)
                    }
                }
                )
        }

         
       
        transporter.sendMail({
            from:process.env.EMAIL_USERNAME,
             to: email,
             subject: 'Verify Account',
             html: emailOTPBody(otp , "E space " , "#233973")
             
           });
           res.json({
             message: `Sent a verification email to ${email}`,
             status:"pending",
             success:"true",
             data:{
                userId:_id,
                otp:otp,
                email:email
             }
           });

    }
    catch(err){
        
    }
    
}
