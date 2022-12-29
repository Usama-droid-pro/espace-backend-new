const mongoose = require('mongoose')
const admin_salesModel = require('../models/admin_salesModel')
const userModel = require('../models/userModel')
const user_salesModel = require('../models/user_salesModel')
const productPriceModel = require("../models/productPriceModel")
const rankModel = require("../models/ranksModel")
const bonus_plan=require("../models/bonusPlanModel");


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
        

        if(referral_id){
            if(!invited_user_id || !transaction_id){
                return (
                    res.json({message: "If referral_id is given than invited_user_id & transaction_id must be given" , status:false,})
                    
                )
            }
        }


        console.log(day + " "+ month + " "+ year)



        let responses = {

        }


        if(referral_id){ referral_exists=true }
        else{
            referral_exists=false
        }

        if(referral_exists==true){
            //if referral exists is true than we are creating admin sales .
            var current_rank_of_user = await getCurrentRankOfUser(referral_id);
            var productPrice = await getProductPrice();
        
            if(!productPrice){
                return(
                    res.json({
                        message: "It Seems product price is not added in product price table",
                        status:false
                    })
                )
            }
            if(!current_rank_of_user){
                return(
                    res.json({
                        message: "Current rank of user not found",
                        status:false
                    })
                )}

            var getCommission_adminProfit = await getCommissionPerSale(productPrice, current_rank_of_user);

            if(getCommission_adminProfit=="error"){
                return(
                    res.json({
                        message: "Could not able to calculate commission per sale & admin profit ",
                        status:false
                    })
                )
            }

            var adminProfit = getCommission_adminProfit.adminProfit;
            var user_commission = getCommission_adminProfit.commissionPrice;


            const isAdminSalesSaved =await createAdminSales(day, transaction_id, invited_user_id,month , referral_exists , year , referral_id, current_rank_of_user , productPrice , adminProfit , user_commission)
            if(isAdminSalesSaved){
                console.log("Admin sales saved successfully")
                responses.adminSaleMessage="Admin Sales were saved successfully"
                //when admin sales is saved , checking if user sales with current month already exists or not.

                let isCheckMonthExists = await checkMonthExist(referral_id , year , month);
                console.log(isCheckMonthExists);
                if(isCheckMonthExists){                              // if month already exists then update total_sales 
                    const isUpdateUserSales= await updateUserSales(referral_id , month, year)

                    if(isUpdateUserSales){
                        res.json(
                            isUpdateUserSales
                        )
                    }
                    else if(isUpdateUserSales=="USER_SALES_WITH_BONUS_UPDATE"){
                        console.log("User Sales with Bonus Updated")
                        res.json(
                            isUpdateUserSales
                        )
                    }
                    else if(isUpdateUserSales=="USER_SALES_UPDATED_FAILED"){
                        console.log("User sales Update Failed")
                        res.json({
                            message: "User Sales Update Failed",
                            status:true
                        })
                    }
                    else if(isUpdateUserSales=="USER_BONUS_UPDATE_FAILED"){
                        console.log("User Bonus Update Failed")
                        res.json({
                            message: "User bonus Update Failed",
                            status:true
                        })
                    }
                }
                else{   //else if New month not exist then create new month for user sales 

                    var current_rank_of_user = await getCurrentRankOfUser(referral_id);
                    console.log("Current Rank is "+ current_rank_of_user)  // get current rank of user


                    //checking previous 3 month rank and check if user is eligible for rank updation or not
                   const result = await  checkPreviousThreeMonthRank(referral_id);
                   console.log("previous Details are: "+ JSON.stringify(result));


                    if(result.eligible==true){
                        var newRank;
                        if(result.previous_rank=="BP1RG"){
                            newRank = "BP2RD"
                            var isUpdated = await updateUserRank(referral_id , newRank) 
                        }else if(result.previous_rank=="BP2RD"){
                            newRank = "BP3RR"
                            var isUpdated = await updateUserRank(referral_id , newRank)
                        }

                        if(isUpdated==true){
                            //checking if user rank is updated or not
                            responses.message1="Rank of User Incremented"
                        
                            const isCreateUserSales= await createUser_sales(referral_id, year, month, newRank);
                            if(isCreateUserSales){
                                res.json({
                                    message: "User Sales created",
                                    status:true,
                                    user_sale:isCreateUserSales,
                                    responses:responses
                                })
                            }
                        }
                        else{
                            console.log("user rank not updated")
                        }
                    }
                    else if (result.eligible==false){
                    console.log(current_rank_of_user)
                    if(current_rank_of_user){
                        const isCreateUserSales= await createUser_sales(referral_id, year, month,current_rank_of_user);
                        if(isCreateUserSales){
                            console.log("user sales created")
                            res.json({
                                message: "User Sales created",
                                status:true,
                                user_sale:isCreateUserSales,
                                responses:responses
                            })
                        }
                    }
                    else{
                        console.log("current rank not found for user ")
                    }
                    }

                }
            }
            else{
                res.json({
                    message: "Could not save admin sales,",
                    status:false,
                })
            }
            
        }
        else if (referral_exists==false){
            var productPrice = await getProductPrice(); // getting product price
            if(!productPrice){
                return(
                    res.json({
                        message: "It Seems product price is not added in product price table",
                        status:false
                    })
                )
            }
            const isAdminSalesSaved =await createAdminSales(day, transaction_id, 0 ,month , referral_exists , year , 0 , 0 , productPrice , productPrice ,0) // if no referaral than obviously adminprofilt will be eq to product price
            if(isAdminSalesSaved==true){
                res.json({
                    message: "Admin Sales Created",
                    result:isAdminSalesSaved,
                    status:true
                })
            }
            else{
                res.json({
                    message: "Could not create Admin Sales",
                    status:false
                })
            }
        }

    }
    catch(err){
        res.json(err);
    }
}

exports.getUserTotalSales = async (req,res)=>{
    try{
        const referral_id = req.query.referral_id;

        
        if(!referral_id){
            return (
                res.json({
                    message: "Please Provide a referral_id",
                    status:false,
                })
            )
        }
        const result = await user_salesModel.aggregate([
            {
                $match:{
                    referral_id:referral_id,
                }
            },

            {"$group":{
                "_id":{"month":{"$month":"$date_created"},"year":{"$year":"$date_created"}},
                "sales":{"$push":"$$ROOT"}
              }},
            {"$sort":{"month":-1,"year":-1}},

        ]);
        
        for(let i=0 ; i<result.length ; i++){
            if(result[i]._id.year){
                result[i]._id.year = result[i]._id.year.toLocaleString();
                console.log(result[i]._id.year)

            }
        }

        if(result){
            res.json({
                message: "All months total sales of User are:",
                result: result,
                status:true

            })
        }
        else{
            res.json({
                message: "Cannot Get All Sales",
                status:false

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

exports.getUserTotalSalesByPayoutStatus = async (req,res)=>{

    try{
        const referral_id = req.query.referral_id;
        const payout_status = req.query.payout_status   
        
        if(!referral_id || !payout_status){
            return (
                res.json({
                    message: "referral_id OR payout_status is Missing",
                    status:false,
                })
            )
        }
        const result = await user_salesModel.find({referral_id: referral_id , payout_status: payout_status});
        if(result){
            res.json({
                message: "All months total sales of User for this payout status are:",
                result: result,
                status:true

            })
        }
        else{
            res.json({
                message: "Cannot Get All Sales",
                status:false

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

exports.getUserSalesByMonth = async (req,res)=>{
    try{
        const referral_id = req.query.referral_id;
        const month = req.query.month;
        const year = req.query.year;

        if(!referral_id || !month || !year){
            return (
                res.json({
                    message: "ReferralId , month or year is missing",
                    status:false,
                })
            )
        }
        const result = await user_salesModel.findOne({referral_id: referral_id , year: year ,month: month});
        if(result){
            res.json({
                message: "User Sales for this Month and Year is :",
                result: result,
                status:true

            })
        }
        else{
            res.json({
                message: "Cannot get Sales for this month and year",
                status:false

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
exports.getUserSalesByYear = async (req,res)=>{
    try{
    const referral_id = req.query.referral_id;
    const year = req.query.year;

    if(!referral_id ||  !year){
        return (
            res.json({
                message: "ReferralId ,OR year is missing",
                status:false,
            })
        )
    }
    const result = await user_salesModel.find({referral_id: referral_id , year: year });
    if(result){
        res.json({
            message: "All User Sales for this Year are:",
            result: result,
            status:true

        })
    }
    else{
        res.json({
            message: "Cannot get Sales for this month and year",
            status:false

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

exports.createPayout = async (req,res)=>{
    try{
        const referral_id= req.body.referral_id;
        const transaction_id= req.body.transaction_id;
        const date = req.body.date;

        if(!referral_id || !transaction_id || !date){
            return (
                res.json({
                    message: "Referral_id , transaction_id || date is missing",
                    status:false
                })
            )
        }
    
        let newDate = new Date(date);

  

        let month = newDate.getMonth().toLocaleString();
        month=parseInt(month)+1
        let year =newDate.getFullYear().toLocaleString();


        const result = await user_salesModel.findOneAndUpdate({referral_id: referral_id , year: year , month: month}
            ,
            {
                payout_status:true,
                date_of_payout:new Date(Date.now()),
            }, 
            {
                new:true
            });

            if(result){
                res.json({
                    message: "Updated",
                    status:true,
                    result:result
                })
            }
            else{
                res.json({
                    message: "Not Updated",
                    status:false,
                })
            }
            
    }
    catch(err){
        res.json({message: "Error Occurred ", error :err.message , status:false});
    }
}

exports.getAllSales = async (req,res)=>{
    try{
        const result = await admin_salesModel.aggregate([
            {"$group":{
                "_id":{"month":{"$month":"$date_created"},"year":{"$year":"$date_created"}},
                "sales":{"$push":"$$ROOT"}
              }},
            {"$sort":{"month":-1,"year":-1}},

        ]);
        
        for(let i=0 ; i<result.length ; i++){
            if(result[i]._id.year){
                result[i]._id.year = result[i]._id.year.toLocaleString();
                console.log(result[i]._id.year)

            }
        }

       
        if(result){
            console.log(result)
            res.json(result)
        }else{
        res.json({
            message: "Could not fetch",
            status:false
        })
        }
    }
    catch(e){
        res.json(e)
    }
}












async function createAdminSales(day, transaction_id, invited_user_id,month , referral_exists , year , referral_id , user_current_rank , productPrice , adminProfit , user_commission){
    try{
        console.log(productPrice ,adminProfit ,)
        var newAdminSales = new admin_salesModel({
            _id:mongoose.Types.ObjectId(),
            day:day,
            year:year,
            month:month,
            referral_exist:referral_exists,
            transaction_id:transaction_id,
            invited_user_id:invited_user_id,
            referral_id:referral_id,
            user_current_rank:user_current_rank,
            product_price:productPrice,
            admin_profit :adminProfit,
            user_commission:user_commission

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

async function createUser_sales(referral_id, year, month,rank_id ){
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
            total_sales:1,
            commissions:commissionPrice,
            bonus:0,
            payout_amount:commissionPrice,
         });

         const result= await new_user_sales.save();
         if(result){
            return result
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

async function updateUserSales(referral_id , month , year){
    try{
        // Getting commission for sales
        let current_rank_of_user = await getCurrentRankOfUser(referral_id); 
        let productPrice= getProductPrice();
        if(productPrice){
          var getCommissionPriceResult= await getCommissionPriceForRank(current_rank_of_user);
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
        const result = await user_salesModel.findOneAndUpdate({referral_id: referral_id , month:month , year:year} , {$inc: {total_sales : 1 }} , {new:true});
        
       
            //Updation of bonus price 

        if(result){
            console.log(result)

            if(result.total_sales >=10){

                const totalBonusPrice = await getBonusPrice(result.total_sales , result.rank_id)
                if(totalBonusPrice){
                   const isUserSaleBonusUpdated= await updateUserSaleBonus(totalBonusPrice, referral_id , month , year)
                   if(isUserSaleBonusUpdated==true){
                        console.log("user bonus updated")
                        let UpdateCommission = await updateCommission(commissionPrice , result.total_sales , referral_id , month , year , result.bonus);
                        if(UpdateCommission){
                            const updatePayoutAmount = await updatePayout_amount(UpdateCommission.commissions , result.total_sales , referral_id , month , year , UpdateCommission.bonus)
                            if(updatePayoutAmount){
                                return ({
                                    message: "User Sales Updated",
                                    message1: "User Sale Bonus Updated",
                                    message2: "User commission Updated",
                                    status:true,
                                    user_sale: updatePayoutAmount
                                });
                            }
                            else{
                                return "USER_SALES_UPDATED_FAILED"
                            }
                            
                        }
                        else{
                            return "USER_BONUS_UPDATE_FAILED";
                        }
                   }
                   else{
                    console.log('cannot update')
                    return "USER_BONUS_UPDATE_FAILED";
                   }
                }
            }
            //Updating commission price
            let UpdateCommission = await updateCommission(commissionPrice , result.total_sales , referral_id,  month ,year , result.bonus);
            if(UpdateCommission){
                const updatePayoutAmount = await updatePayout_amount(UpdateCommission.commissions , result.total_sales , referral_id , month , year , UpdateCommission.bonus)
                if(updatePayoutAmount){
                    return ({
                        message: "User Sales Updated",
                        message2: "User commission Updated",
                        status:true,
                        user_sale: updatePayoutAmount
                    });
                }else{
                    return "USER_SALES_UPDATED_FAILED"
                }
               
            }
            else{
                return "USER_SALES_UPDATED_FAILED"
            }
           
        }
        else{
            return "USER_SALES_UPDATED_FAILED"
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
        if(result.length>=3){
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
async function updateUserSaleBonus(bonus , referral_id , month , year){
    try{
        const result = await user_salesModel.findOneAndUpdate({referral_id: referral_id , month:month, year:year} ,{bonus: bonus} , {new:true});

        if(result){
            console.log(result);
            console.log("user sale bonus updated successfully")
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
async function getBonusPrice(total_sales , current_rank){
try{
    var total_bonus;
    if(total_sales>=1 && total_sales<20){
        const getBonusPriceForUserSalesForTen = await bonus_plan.findOne({rank_uniq_id:current_rank , sales_no:10});
        if(getBonusPriceForUserSalesForTen){
            total_bonus= parseInt(getBonusPriceForUserSalesForTen.bonus_price);
            return total_bonus;
        }
        else{
            console.log("Cannot get bonus price")
            return null;
        }
    }

    if(total_sales>=20 && total_sales<30){
        const getBonusPriceForUserSalesForTen = await bonus_plan.findOne({rank_uniq_id:current_rank , sales_no:10});
        const getBonusPriceForUserSalesForTwenty = await bonus_plan.findOne({rank_uniq_id:current_rank , sales_no:20});
        if(getBonusPriceForUserSalesForTen && getBonusPriceForUserSalesForTwenty){
            total_bonus= parseInt(getBonusPriceForUserSalesForTen.bonus_price) + parseInt(getBonusPriceForUserSalesForTwenty.bonus_price);
            return total_bonus;
        }
        else{
            console.log("Cannot get bonus price")
            return null;
        }
    }

    if(total_sales>=30){
        const getBonusPriceForUserSalesForTen = await bonus_plan.findOne({rank_uniq_id:current_rank , sales_no:10});
        const getBonusPriceForUserSalesForTwenty = await bonus_plan.findOne({rank_uniq_id:current_rank , sales_no:20});
        const getBonusPriceForUserSalesForThirty = await bonus_plan.findOne({rank_uniq_id:current_rank , sales_no:30});


        if(getBonusPriceForUserSalesForTen && getBonusPriceForUserSalesForTwenty){
            total_bonus= parseInt(getBonusPriceForUserSalesForTen.bonus_price) + parseInt(getBonusPriceForUserSalesForTwenty.bonus_price) + parseInt(getBonusPriceForUserSalesForThirty.bonus_price);
            return total_bonus;
        }
        else{
            console.log("Cannot get bonus price")
            return null
        }
    }
}
catch(e){
    console.log(e)
}
}

async function updateCommission(commissionPrice , total_sales , referral_id , month , year ){

    let total_commission_price = parseInt(commissionPrice)* parseInt(total_sales);
    console.log(total_commission_price)

    const  commissionUpdateResult = await user_salesModel.findOneAndUpdate({referral_id:referral_id, month:month , year:year} , {commissions:total_commission_price } , {new:true});
    console.log(commissionUpdateResult)
    if(commissionUpdateResult){
        return (commissionUpdateResult);
    }
    else{
        return null;
    }

}

async function updatePayout_amount(commissionPrice , total_sales , referral_id , month , year , bonus){
    try{
        let total_commission_price = parseInt(commissionPrice)* parseInt(total_sales);
    console.log(total_commission_price)

    let payout_amount = total_commission_price+ parseInt(bonus)

    const  payout_amountUpdate = await user_salesModel.findOneAndUpdate({referral_id:referral_id, month:month , year:year} , {commissions:total_commission_price , payout_amount:payout_amount} , {new:true});
    console.log(payout_amountUpdate)

    if(payout_amountUpdate){
        return payout_amountUpdate
    }
    else{
        return null
    }
    }
    catch(err){
        console.log(err)
        return null
    }
}

async function getCommissionPerSale(productPrice , rank_id){
    try{
        const result = await rankModel.findOne({unique_id:rank_id});
        if(result){
            console.log(result);
            if(result.commission){
                console.log(typeof(result.commission))
                var commission= parseInt (result.commission);

            }

            let commissionPrice= (commission/100)* parseInt(productPrice);
            if(commissionPrice){
                var adminProfit = parseInt(productPrice) - commissionPrice;
            }

            console.log(adminProfit + " " + commissionPrice)
            if(commissionPrice && adminProfit){
                return {
                    adminProfit: adminProfit,
                    commissionPrice: commissionPrice
                }
            }
            else{
                return "error"
            }

            
        }
    }
    catch(err){
        console.log(err);
        return "error"
    }
}