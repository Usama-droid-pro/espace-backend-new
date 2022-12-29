
const mongoose = require('mongoose');
const bonusPlanModel = require('../models/bonusPlanModel');


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
        const BP1RG = await bonusPlanModel.find({rank_uniq_id:"BP1RG"});
        const BP2RD = await bonusPlanModel.find({rank_uniq_id:"BP2RD"});
        const BP3RR = await bonusPlanModel.find({rank_uniq_id:"BP3RR"});

        if(BP1RG){
            result.push({
                rank_uniq_id:"BP1RG",
                bonusOfSales_numbers:BP1RG
            })
        }
        if(BP2RD){
            result.push({
                rank_uniq_id:"BP2RD",
                bonusOfSales_numbers:BP2RD
            })
        }
        if(BP3RR){
            result.push({
                rank_uniq_id:"BP3RR",
                bonusOfSales_numbers:BP3RR
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
        if(rank_uniq_id){
            if(rank_uniq_id=="BP1RG" || rank_uniq_id=="BP2RD" || rank_uniq_id=="BP3RR"){

            const result = await bonusPlanModel.find({rank_uniq_id:rank_uniq_id});
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