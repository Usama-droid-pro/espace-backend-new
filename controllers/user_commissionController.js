

const mongoose = require('mongoose');
const rankModel = require("../models/ranksModel");
const bonus_plan=require("../models/bonusPlanModel");
const productPriceModel = require("../models/productPriceModel");


exports.getUserCommission= async (req, res, next) => {

    let user_rank = "BP3RR"
    let user_sales = 20

    var totalBonusOfUser ;
    var totalCommissionOfUser;

    //getting commission price for rank 
    if(user_rank){
        if(user_rank == "BP1RG" || user_rank == "BP2RD" || user_rank == "BP3RR"){
        const getCommissionPriceForUser_rank= await getCommissionPriceForRank(user_rank);
        console.log("this is"+getCommissionPriceForUser_rank)

    if(typeof(getCommissionPriceForUser_rank)=="number"){
        var commission= getCommissionPriceForUser_rank;
        totalCommissionOfUser= commission* user_sales
    }
    else if(getCommissionPriceForUser_rank=="rank_commission_missing"){
        return(
            res.json({
                message: "It seems commission for this rank is not set , Make sure In rank Commission is set for this rank",
                status:false
            })
        )
       
    }
    else if(getCommissionPriceForUser_rank=="product_price_missing"){
        return(
            res.json({
                message: "Cannot find product price , Make sure product price is set",
                status:false
            })
        )
    }
    else{
        return(
            res.json({
                message: "could not find commission price for this rank , make sure commission percentage of this rank "+user_rank+" is stored",
                status:false
            })
        )
       
    }
    }
    else{
        return (
            res.json({
                message: "user_rank Must be One of these . BP1RG , BP2RD , BP3RR . While Looking user rank it user rank does not follow the",
                status:false
            })
           
        )
    }
    //------------------------------------------------------------------------------------------------------------------------------------------
    


    if(user_sales){
        if(user_sales >=1 && user_sales <20){
            const getBonusPriceForUserSalesForTen = await bonus_plan.findOne({rank_uniq_id:user_rank , sales_no:10});
            if(getBonusPriceForUserSalesForTen){
                totalBonusOfUser= parseInt(getBonusPriceForUserSalesForTen.bonus_price);
            }else{
                return(
                        res.json({
                            message: "It seems that bonus price is not properly set for every rank and sales_no , Bonus price missing",
                            status:false
                        })
                )
            }
            
        }
        else if(user_sales>=20 && user_sales <30){
            const getBonusPriceForUserSalesForTen = await bonus_plan.findOne({rank_uniq_id:user_rank , sales_no:10});
            const getBonusPriceForUserSalesForTwenty = await bonus_plan.findOne({rank_uniq_id:user_rank , sales_no:20});

            if(getBonusPriceForUserSalesForTen && getBonusPriceForUserSalesForTwenty){
                totalBonusOfUser= parseInt(getBonusPriceForUserSalesForTen.bonus_price) + parseInt(getBonusPriceForUserSalesForTwenty.bonus_price);
            }
            else{
                return(
                    res.json({
                        message: "It seems that bonus price is not properly set for every rank and sales_no , Bonus price missing",
                        status:false
                    })
                )
            }
            
        }
        else if(user_sales >=30){
            const getBonusPriceForUserSalesForTen = await bonus_plan.findOne({rank_uniq_id:user_rank , sales_no:10});
            const getBonusPriceForUserSalesForTwenty = await bonus_plan.findOne({rank_uniq_id:user_rank , sales_no:20});
            const getBonusPriceForUserSalesForThirty = await bonus_plan.findOne({rank_uniq_id:user_rank , sales_no:30});

            if(getBonusPriceForUserSalesForTen && getBonusPriceForUserSalesForTwenty && getBonusPriceForUserSalesForThirty){
                totalBonusOfUser= parseInt(getBonusPriceForUserSalesForTen.bonus_price) + parseInt(getBonusPriceForUserSalesForTwenty.bonus_price) + parseInt(getBonusPriceForUserSalesForThirty.bonus_price);
            }
            else{
                return(
                    res.json({
                        message: "It seems that bonus price is not properly set for every rank and sales_no , Bonus price missing",
                        status:false
                    })
                )
            }

        }

    }


    
    if(totalBonusOfUser){
        res.json({
            message: "User Commission and bonus",
            userCurrentRank:user_rank,
            totalBonusOfUser: totalBonusOfUser,
            commission: totalCommissionOfUser,
            totalIncomeOfUser :totalBonusOfUser+totalCommissionOfUser,
            status:true
        })
    }else{
        res.json({
            message: "Could not fetch",
            status:false
        })
    }
}
else{
    res.json({
        message: "Could not find user rank , Make Sure rank of User is present in user table",
        status:false
    })
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