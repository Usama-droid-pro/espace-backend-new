const adminModel= require("../models/adminModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { ifError } = require("assert");
exports.getAllAdmins= (req,res)=>{
    adminModel.find({},function(err, foundResult){
        try{
            res.json(foundResult)
        }catch(err){
            res.json(err)
        }
    })
}

exports.getSpecificAdmin= (req,res)=>{
    const adminId = req.params.adminId;
    adminModel.find({_id:adminId},function(err, foundResult){
        try{
            res.json(foundResult)
        }catch(err){
            res.json(err)
        }
    })
}
exports.deleteAdmin= (req,res)=>{
    const adminId = req.params.adminId;
    adminModel.deleteOne({_id:adminId},function(err, foundResult){
        try{
            res.json(foundResult)
        }catch(err){
            res.json(err)
        }
    })
}

exports.updatePassword=async (req,res)=>{

    const email=req.body.email;
    const newPassword=req.body.newPassword;
    
    if(email && newPassword !==null && typeof email && typeof newPassword!=="undefined"){
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);
        adminModel.findOneAndUpdate({
            email:email,
            },
            {
              password:hashPassword
            }, 
            function(err, result) 
            { 
               
                if(result){
                    console.log("password updated successfully") 
                    res.json({
                        message: "password updated successfully",
                        success: true,
                        result:result
                        
                    })
                } else{
                    res.json({
                        message: "could'nt update admin password",
                        success: false,
                        error:err,
                        data:result
                    })
                }
        });
    }
    else{
        res.json({
            message:"email , newPassword  may be null or undefined",
        })
    }

     
}


exports.updateProfile = async (req,res)=>{
        try{
            const user_name = req.body.user_name;
            const email = req.body.email;
            const admin_id = req.body.admin_id;


            console.log(admin_id)
            const result = await adminModel.findOneAndUpdate({_id:admin_id},
                {
                    user_name: user_name,
                    email: email
                },
                {
                    new:true
                })

                if(result){
                    res.json({
                        message: "Updated",
                        result:result,
                        status:true,
                    })
                }
                else{
                    res.json({
                        message: "Could not update user",
                        result:null,
                        status:false,
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

exports.updateImage = async (req,res)=>{
    try{
        
        const admin_id = req.body.admin_id;
        
        if(req.file){   
            const foundResult = await adminModel.findOne({_id:admin_id});
            if(foundResult){
                if(foundResult.img){
                    fs.unlink(foundResult.img , (err)=>{
                        if(!err){
                            console.log("deleted")
                        }
                    })
                }
               
            }
            
        }

        

        if(req.file){
            console.log(req.file)
            const result = await adminModel.findOneAndUpdate({_id:admin_id},
                {
                    img:req.file.path
                },
                {
                    new:true
                })
                if(result){
                    res.json({
                        message: "Updated",
                        result:result,
                        status:true,
                    })
                }
                else{
                    res.json({
                        message: "Could not update user",
                        result:null,
                        status:false,
                    })
                }
        }
        else{
            res.json({
                message: "Please give image to update",
                status:false,
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

// exports.updateProfile= (req,res)=>{
//     const userId = req.body.userId;
//     const name = req.body.name;
//     const age = req.body.age;
//     const email=req.body.email;

//     if(userId !== null && typeof userId !== "undefined"){
//         if(req.file){
//             doctorModel.findOneAndUpdate({_id:userId} ,
//             {
//                 name:name,
//                 age:age,
//                 profileImage:{
//                     data:req.file.path,
//                     contentType:"image/jpeg",
//                 },
//                 email:email
//             },
//             {
//                 new:true
//             },function(err,foundResult){
//                 res.json({
//                     message:"updated",
//                     updatedData:foundResult
//                 })
//             })
//         }
//         else{
//             doctorModel.findOneAndUpdate({_Id:userId} ,
//                 {
//                     name:name,
//                     age:age,
//                     email:email,
//                 },
//                 {
//                     new:true
//                 },function(err,foundResult){
//                     res.json({
//                         message:"updated",
//                         updatedData:foundResult
//                     })
//                 })c
            
//         }

//     }else{
//         res.json({
//             message:"userId is null or undefined"
//         })
//     }

// }

