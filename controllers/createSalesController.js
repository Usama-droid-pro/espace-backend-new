const mongoose = require('mongoose')
const admin_salesModel = require('../models/admin_salesModel')
const userModel = require('../models/userModel')
const user_salesModel = require('../models/user_salesModel')

exports.createSale= async (req,res)=>{
    try{
        const referral_id= req.body.referral_id;
        var referral_exists;
        let date = new Date();
        var day = date.getDay().toLocaleString();
        var month = date.getMonth().toLocaleString();
        var year = date.getFullYear().toLocaleString();
        const transaction_id = req.body.transaction_id;
        const invited_user_id = req.body.invited_user_id;
        


        console.log(day + " "+ month + " "+ year)




        if(referral_id){ referral_exists=true }
        else{
            referral_exists=false
        }

        if(referral_exists=true){
            const isAdminSalesSaved =await createAdminSales(day, transaction_id, invited_user_id,month , referral_exists , year)

            if(isAdminSalesSaved){
                console.log("Admin sales saved successfully")
                
                let isCheckMonthExists = await checkMonthExist(referral_id , year , month);
                console.log(isCheckMonthExists);
                if(isCheckMonthExists){
                    const isUpdateUserSales= await updateUserSales(referral_id)
                    if(isUpdateUserSales){
                        console.log("user sales updated")
                    }
                }
                else{
                    let current_rank_of_user = await getCurrentRankOfUser(referral_id);
                    if(current_rank_of_user){
                        const isCreateUserSales= await createUser_sales(referral_id, year, month,current_rank_of_user , transaction_id);
                        if(isCreateUserSales){
                            console.log("user sales created")
                        }
                    }
                    else{
                        console.log("current rank not found")
                    }
                   
                }
            }
            
        }

    }
    catch(err){
        res.json(err);
    }
}

async function  createAdminSales(day, transaction_id, invited_user_id,month , referral_exists , year){
    try{
        var newAdminSales = new admin_salesModel({
            _id:mongoose.Types.ObjectId(),
            day:day,
            year:year,
            month:month,
            referral_exists:referral_exists,
            transaction_id:transaction_id,
            invited_user_id:invited_user_id
        })

        const result = await newAdminSales.save();

        if(result){
            return true
        }
        else{
            return false
        }
    }
    catch(err){
        console.log(err);
        return false
    }
}

async function createUser_sales(referral_id, year, month,rank_id , transaction_id){
    try{
         const new_user_sales = new user_salesModel({
            _id:mongoose.Schema.Types.ObjectId(),
            referral_id:referral_id,
            year:year,
            month:month,
            rank_id:rank_id,
            transaction_id:transaction_id,
         });

         const result= await new_user_sales.save();
         if(result){
            return true
         }
         else{
            return false
         }
         
    }
    catch(err){
        console.log(err);
        return false
    }

}

async function updateUserSales(referral_id){
    try{
        const result = user_salesModel.findOneAndUpdate({referral_id: referral_id} , {$inc: {total_sales : 1 }} , {new:true});

        if(result){
            return true;
        }
        else{
            return false;
        }
    }
    catch(err){
        console.log(err);
        return false
    }
    
}

async function checkMonthExist(referral_id , year, month){
    console.log("inthere")
    if(referral_id , year ,month){
        const result = await user_salesModel.findOne({referral_id:referral_id,year:year, month:month})
        console.log(result)
        if(result){
            return true
        }
        else{
            return false
        }
    }

}

async function getCurrentRankOfUser (referral_id){
    try{
        const result = await userModel.findOne({refferal_code: referral_id});
        if(result){
            console.log(result);
            console.log(result.user_type);
            return result.current_rank
        }
        else{
            return null;
        }
    }
    catch(err){
        console.log(err);
        return false
    }
}
