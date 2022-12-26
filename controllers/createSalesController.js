const mongoose = require('mongoose')
const admin_salesModel = require('../models/admin_salesModel')
const userModel = require('../models/userModel')
const user_salesModel = require('../models/user_salesModel')
const productPriceModel = require("../models/productPriceModel")
const rankModel = require("../models/ranksModel")

exports.createSale= async (req,res)=>{
    try{
        const referral_id= req.body.referral_id;
        var referral_exists;
        let date = new Date();
        var day = date.getDay().toLocaleString();
        var month = date.getMonth().toLocaleString();
        month=parseInt(month);
        month = (month+1);
        var year = date.getFullYear().toLocaleString();
        const transaction_id = req.body.transaction_id;
        const invited_user_id = req.body.invited_user_id;
        


        console.log(day + " "+ month + " "+ year)




        if(referral_id){ referral_exists=true }
        else{
            referral_exists=false
        }

        if(referral_exists=true){
            //if referral exists is true than we are creating admin sales .
            const isAdminSalesSaved =await createAdminSales(day, transaction_id, invited_user_id,month , referral_exists , year)
            if(isAdminSalesSaved){
                console.log("Admin sales saved successfully")
                //when admin sales is saved , checking if user sales with current month already exists or not.

                let isCheckMonthExists = await checkMonthExist(referral_id , year , month);
                console.log(isCheckMonthExists);
                if(isCheckMonthExists){                              // if month already exists then update total_sales 
                    const isUpdateUserSales= await updateUserSales(referral_id)
                    if(isUpdateUserSales){
                        console.log("user sales updated")
                    }
                }
                else{   //else if New month not exist then create new month for user sales 

                    let current_rank_of_user = await getCurrentRankOfUser(referral_id);  // get current rank of user


                    //checking previous 3 month rank and check if user is eligible for rank updation or not
                   const result = await  checkPreviousThreeMonthRank(referral_id);
                    console.log("previous Details are: "+ JSON.stringify(result));


                    if(result.eligible=true){
                        var newRank;
                        if(result.previous_rank=="BP1RG"){
                            newRank = "BP2RD"
                            var isUpdated = await updateUserRank(referral_id , newRank) 
                        }else if(result.previous_rank=="BP2RD"){
                            newRank = "BP3RR"
                            var isUpdated = await updateUserRank(referral_id , newRank)
                        }

                        if(isUpdated==true){   //checking if user rank is updated or not
                            const isCreateUserSales= await createUser_sales(referral_id, year, month, newRank , transaction_id);
                            if(isCreateUserSales){
                                console.log("user sales created , with new rank")
                            }
                        }
                        else{
                            console.log("user rank not updated")
                        }
                    }
                    else if (result.eligible==false){
                    console.log(current_rank_of_user)
                    if(current_rank_of_user){
                        const isCreateUserSales= await createUser_sales(referral_id, year, month,current_rank_of_user , transaction_id);
                        if(isCreateUserSales){
                            console.log("user sales created")
                        }
                    }
                    else{
                        console.log("current rank not found for user ")
                    }
                    }

                }
            }
            
        }
        else if (referral_exists==false){

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

         let productPrice= getProductPrice();
         if(productPrice){
           var getCommissionPriceResult= await getCommissionPriceForRank(rank_id);
           if(typeof(getCommissionPriceResult)=="number"){
            var commissionPrice = getCommissionPriceResult;
            console.log(commissionPrice)
           }
           else if(getCommissionPriceResult=="rank_commission_missing"){
            return false
           }
           else if(getCommissionPriceResult =="product_price_missing"){
            return false
           }

         }
         const new_user_sales = new user_salesModel({
            _id:mongoose.Types.ObjectId(),
            referral_id:referral_id,
            year:year,
            month:month,
            rank_id:rank_id,
            transaction_id:transaction_id,
            total_sales:1,
            commissions:commissionPrice,
            bonus:0
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
        const result = await user_salesModel.findOneAndUpdate({referral_id: referral_id} , {$inc: {total_sales : 1 }} , {new:true});

        if(result){
            console.log(result);
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
    console.log("month is "+ month)
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
            console.log(result.current_rank);
            return result.current_rank
        }
        else{
            return null;
        }
    }
    catch(err){
        console.log(err);
        console.log("error Occurred")
        return false
    }
}


async function checkPreviousThreeMonthRank (referral_id){
    try{

        console.log(referral_id)
        const result = await user_salesModel.find({referral_id: referral_id}).sort({ $natural: -1 }).limit(3);
        var lastMonthRank = result[0].rank_id;
        var secondLastMonthRank = result[1].rank_id;
        var thirdLastMonthRank = result[2].rank_id;
        var rankInLastThreeMonth = lastMonthRank;
        var threshold ;


        console.log(lastMonthRank, secondLastMonthRank, thirdLastMonthRank);
        if(lastMonthRank == secondLastMonthRank && lastMonthRank == thirdLastMonthRank){
            
            if(rankInLastThreeMonth=="BP1RG"){
                threshold = 10
            }else if(rankInLastThreeMonth=="BP2RD"){
                threshold =20
            }
            if(result[0].total_sales >= threshold){
                if(result[1].total_sales>=threshold){
                    return ({
                        eligible:true,
                        previous_rank:rankInLastThreeMonth,
                    })
                }
                else {
                    return ({
                        eligible:false,
                        previous_rank:rankInLastThreeMonth,
                    })
                }
            }
            else {
                return ({
                    eligible:false,
                    previous_rank:rankInLastThreeMonth,
                })
            }


        }
        else{
            return ({
                eligible:false,
                previous_rank:rankInLastThreeMonth,
            })
        }
    } catch(err){
        console.log(err);
        return false
    }
}

async function updateUserRank (referral_id , rank){
    try{
        const result = await userModel.findOneAndUpdate({refferal_code:referral_id} , {current_rank:rank});
        console.log(result);
         if(result){
            return true;
         }
         else{
            return false;
         }

    }
    catch(err){
        console.log(err);
        console.log("error Occurred")
        return false
    }
}

async function getCommissionPriceForRank (rank){
    try{
        if(rank){
            var commissionPrice ;  //variable which will return from this function
            let product_price = await getProductPrice();
            product_price = Number(product_price);
            console.log(product_price)
            console.log(typeof(product_price))

            console.log(product_price)
            if(product_price){
            var result= await rankModel.aggregate([
                {
                    $match:{
                        unique_id: rank
                    }
                }
                ,
                  {
                        $addFields: { price:
                            {"$multiply":[{"$divide":["$commission",100]},product_price]}
                        }
                  }
                
            ])
            console.log(result)
            if(result.length>0){
                if(result[0].price){
                    commissionPrice=result[0].price;
                    return commissionPrice;
                }
            }
            else{
                console.log("could not return price")
                return "rank_commission_missing"
            }

        }
        else{
            console.log("error could not find product price")
            return "product_price_missing";
           
        }
            
        }
    }
    catch(err){
        console.log(err)  ;
    }
}

async function getProductPrice(){
    try{
        //Getting PR_UNIQUE Price
        const productPriceResult= await productPriceModel.findOne({unique_id: "PR_UNIQUE"});
        var product_price;
        
        if(productPriceResult){
            if(productPriceResult.price){
                product_price = productPriceResult.price;
                return product_price;
            }
            else{
                return null;
            }
            
        }
        else{
            return null;
        }
    }
    catch(err){
        console.log(err);
        return null;
    }
}
async function updateUserSaleBonus(){
    try{
        const result = await user_salesModel.findOneAndUpdate({referral_id: referral_id} ,{Bonus: bonus} , {new:true});

        if(result){
            console.log(result);
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