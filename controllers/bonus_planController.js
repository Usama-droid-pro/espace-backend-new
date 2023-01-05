
const mongoose = require('mongoose');
const bonusPlanModel = require('../models/bonusPlanModel');
const rankModel = require("../models/ranksModel");
const productPriceModel= require("../models/productPriceModel")


exports.createBonusPlan = async (req, res)=>{
    try{
        const rank_uniq_id = req.body.rank_uniq_id;
        const sales_no = req.body.sales_no;
        const bonus_price = req.body.bonus_price;

        console.log(bonus_price);

        if(!bonus_price){
            return(
                res.json({
                    message: "bonus Price must be given",
                    status:false
                })
            )
            
        }

        if(rank_uniq_id){
            if(rank_uniq_id=="BP1RG" || rank_uniq_id=="BP2RD" || rank_uniq_id=="BP3RR"){
                if(sales_no=="10" || sales_no=="20" || sales_no=="30"){
                    const foundResult = await bonusPlanModel.findOne({rank_uniq_id:rank_uniq_id , sales_no: sales_no});
                    if(!foundResult){
                        
                        const newBonusPrice = await bonusPlanModel({
                            _id:mongoose.Types.ObjectId(),
                            rank_uniq_id:rank_uniq_id,
                            sales_no: sales_no,
                            bonus_price:bonus_price
                        });
    
                        var result = await newBonusPrice.save();
                        if(result){
                            res.json({
                                message: "New Bonus plan price is set for this rank",
                                result: result,
                                status:true
                            })
                        }
                        else{
                            res.json({
                                message: "Could not Set Bonus Plan price for this rank",
                                status:false
                            })
                        }
    
                    }
                    else{
                        res.json({
                            message: "Bonus Plan with this rank_unique_id & sales_no already exists",
                            status:false
                        })
                    }
                }
                else{
                    res.json({
                        message:"sales not can only be 10, 20 or 30 ",
                        status:false
                    })
                }
               
            }
            else{
                res.json({
                    message: "rank_uniq_id must be one of these : [BP1RG,BP2RD,BP3RD]",
                    status:false
                })
            }
        }
        else{
            res.json({
                message: "Please Provide rank_uniq_id",
                status:false
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            error:err.message,
            status:false
        })
    }
}

exports.getAllBonusPlans = async (req,res)=>{
    try{
        let result=[];
        const BP1RG = await bonusPlanModel.find({rank_uniq_id:"BP1RG"}).sort({sales_no:1});
        const BP2RD = await bonusPlanModel.find({rank_uniq_id:"BP2RD"}).sort({sales_no:1});
        const BP3RR = await bonusPlanModel.find({rank_uniq_id:"BP3RR"}).sort({sales_no:1});

        
        const product_price = await getProductPrice();

        if(product_price==null){
            return (
                res.json({
                    message: "Could not get Product Price for commission calculation , It seems product price is not added",
                    status:false
                })
            )
        }

        const commission_BP1RG = await getCommissionPerSale("BP1RG" , product_price);
        const commission_BP2RD = await getCommissionPerSale("BP2RD" , product_price);
        const commission_BP3RR = await getCommissionPerSale("BP3RR" , product_price);

        if(commission_BP1RG=="error" || commission_BP2RD=="error" || commission_BP3RR=="error"){
            return (
                res.json({
                    message: "Error Occurred while Calculating commission for the rank ,Make sure rank is properly added",
                    status:false
                })
            )
        }



        

        
        if(BP1RG){
            result.push({
                rank_uniq_id:"BP1RG",
                commission_per_sale:commission_BP1RG.commissionPrice,
                commission_in_percentage:commission_BP1RG.commission_in_percentage,
                bonusOfSales_numbers:BP1RG,
                
            })
        }
        if(BP2RD){
            result.push({
                rank_uniq_id:"BP2RD",
                commission_per_sale:commission_BP2RD.commissionPrice,
                commission_in_percentage:commission_BP2RD.commission_in_percentage,
                bonusOfSales_numbers:BP2RD,
                
            })
        }
        if(BP3RR){
            result.push({
                rank_uniq_id:"BP3RR",
                commission_per_sale:commission_BP3RR.commissionPrice,
                commission_in_percentage:commission_BP3RR.commission_in_percentage,
                bonusOfSales_numbers:BP3RR,
            })
        }
        



        if(result){
            res.json({
                message: "All Bonus Plans Fetched successfully",
                result: result,
                status:true
            })
        }
        else{
            res.json({
                message: "Could not fetch Bonus Plans",
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            error:err.message,
            status:false
        })
    }
}

exports.getBonusPriceOfAllSales_nos_By_rank_unique_id= async (req,res)=>{
    try{
        const rank_uniq_id = req.query.rank_uniq_id;

        let result_final=[];

        if(rank_uniq_id){
            if(rank_uniq_id=="BP1RG" || rank_uniq_id=="BP2RD" || rank_uniq_id=="BP3RR"){



            const product_price = await getProductPrice();
            const commission = await getCommissionPerSale(rank_uniq_id , product_price);
            const result = await bonusPlanModel.find({rank_uniq_id:rank_uniq_id});

            result_final.push({
                rank_uniq_id:rank_uniq_id,
                commission_per_sale:commission.commissionPrice,
                commission_in_percentage:commission.commission_in_percentage,
                bonusOfSales_numbers:result
            })
            
            if(result_final){
            res.json({
                message: "Bonus Plan of this rank Fetched successfully",
                result: result_final,
                status:true
            })
        }
        else{
            res.json({
                message: "Could not fetch Bonus Plan",
                status:false
            })
        }
        }
        else{
            res.json({
                message: "rank_uniq_id must be of following type:BP1RG, BP2RD , BP3RR ",
                status:false
            })
        }
        }else{
            res.json({
                message: "Please Provide Rank_uniq_id ",
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            error:err.message,
            status:false
        })
    }
}

exports.updateBonusPlan = async (req,res)=>{
    try{
        const rank_uniq_id = req.body.rank_uniq_id;
        const sales_no = req.body.sales_no;
        const bonus_price = req.body.bonus_price;

        if(!sales_no){
            return(
                res.json({
                    message: "sales_no must be provided",
                    status:false
                })
            )
            
        }

        if(!bonus_price){
            return(
                res.json({
                    message: "bonus Price must be given",
                    status:false
                })
            )
            
        }


        if(rank_uniq_id){
            if(rank_uniq_id=="BP1RG" || rank_uniq_id=="BP2RD" || rank_uniq_id=="BP3RR"){
                if(sales_no=="10" || sales_no=="20" || sales_no=="30"){
                    const result  = await bonusPlanModel.findOneAndUpdate({rank_uniq_id:rank_uniq_id , sales_no: sales_no}
                        ,
                        {
                            bonus_price: bonus_price
                        },
                        {
                            new:true
                        }
                        );

                        if(result){
                            res.json({
                                message: "Bonus Price for this rank and sales_no updated",
                                result: result,
                                status:true
                            })
                        }
                        else{
                            res.json({
                                message: "Could not updated ",
                                status:false,
                            })
                        }
                }
                else{
                    res.json({
                        message:"sales not can only be 10, 20 or 30 ",
                        status:false
                    })
                }
                }
                
            else{
                res.json({
                    message: "rank_uniq_id must be one of these : [BP1RG,BP2RD,BP3RD]",
                    status:false
                })
            }
        }
        else{
            res.json({
                message:"rank_uniq_id must be provided",
                status:false
            })
        }
        
    }
    catch(err){
        res.json({
            message: "Error Occurred ",
            error:err.message,
            status:false
        })
    }
}

async function getCommissionPerSale(rank_id , productPrice){
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
                return(
                    {
                        commissionPrice:commissionPrice,
                        commission_in_percentage: commission
                    }
                )
            }
            else{
                return "error"
            }

            
        }
    }
    catch(err){
       
        return "error"
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