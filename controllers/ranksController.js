
const mongoose = require("mongoose");
const ranksModel = require("../models/ranksModel");
const rankModel = require("../models/ranksModel");
const productPriceModel = require("../models/productPriceModel");

exports.createRank = async (req,res)=>{
    try{
        const unique_id = req.body.unique_id;
        const name = req.body.name;
        const commission = req.body.commission;

        if(commission){
            if(commission > 100 || commission <0){
                return(
                    res.json({
                        message : "As commission is in percentage so it can  not be less than 0 OR greater than 100",
                        status:false,
                    })
                )
            }
        }
        else{
            return(
                res.json({
                    message : "commission Must be provided to create a rank",
                    status:false,
                })
            )
        }
       

        
        if(typeof(commission)=="number")
        {
            if(unique_id ==='BP1RG' || unique_id ==='BP2RD' || unique_id ==='BP3RR'){
                const foundResult = await ranksModel.findOne({unique_id:unique_id})
    
                if(!foundResult){
                    const  newRank = new ranksModel({
                        _id: mongoose.Types.ObjectId(),
                        unique_id: unique_id,
                        commission: commission,
                        name: name
                    });
    
                    const result = await newRank.save();
    
                    if(result){
                        res.json({
                            message: "Rank is created",
                            result: result,
                            status:true
                        })
                    }
                    else{
                        res.json({
                            message: "Rank could not be  created",
                            status:false
                        })
                    }
    
                }  
                else{
                    res.json({
                        message: "Rank with this unique_id already exists",
                        status:false
                    })
                }
            }
            else{
                res.json({
                    message: "unique_id can be only one of these : [BP1RG , BP2RD ,BP3RR]",
                    status:false
                })
            }
        }
        else{
            res.json({
                message: "Commission must be a number ",
                status:false,
            })
        }
        

        
        
    }
    catch(err){
        res.json({
            message: "Error Occurred: ",
            status: false,
            error:err.message

        })
    }
}

exports.getAllRanks = async(req,res)=>{
    try{
        const result= await rankModel.find({});
        if(result){
            res.json({
                message: "ranks fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch ranks",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching ranks",
            error:err.message
        })
    }
}

exports.getRankByRankId = async(req,res)=>{
    try{
        const rankId = req.query.rankId;
        const result= await rankModel.findOne({_id:rankId});
        if(result){
            res.json({
                message: "rank fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch rank",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching ranks",
            error:err.message
        })
    }
}

exports.getRankByUnique_id = async(req,res)=>{
    try{
        const unique_id = req.query.unique_id;

        let product_price = await getProductPrice();
        product_price = Number(product_price);
        console.log(product_price)
        console.log(typeof(product_price))

        if(product_price){
            var result= await rankModel.aggregate([
                {
                    $match:{
                        unique_id: unique_id
                    }
                }
                ,
                  {
                        $addFields: { price:
                            {"$multiply":[{"$divide":["$commission",100]},product_price]}
                        }
                  }
                
            ])
        }
        else{
            return (
                res.json({
                    message: "System could not found product price. Add it first in product price",
                    status: false
                })
            )
        }

       
        

        console.log(result)
        if(result){
            res.json({
                message: "rank fetched with this unique_id: " ,
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch rank",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching ranks",
            error:err.message
        })
    }
}
exports.deleteRankByUnique_id= async(req,res)=>{
    try{
        const unique_id = req.query.unique_id;
        const result= await rankModel.deleteOne({unique_id:unique_id});
        if(result.deletedCount>0){
            res.json({
                message: "Rank Deleted with this unique_id",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not delete rank",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error deleting ranks",
            error:err.message
        })
    }
}

exports.updateRankByUniqueId = async(req,res)=>{
    try{
        const unique_id = req.body.unique_id;
        const commission = req.body.commission;
        console.log(unique_id)
        

       
        if(commission > 100 || commission <0){
            return(
                res.json({
                    message : "As commission is in percentage so it can  not be less than 0 OR greater than 100",
                    status:false,
                })
            )
        }

        if(commission){
            if(typeof(commission)!== "number"){
                return (
                    res.json({
                        message: "commission must be a number",
                        status:false
                    })
                )
            }
        }
        else{
            return (
                res.json({
                    message: "Must provide commission",
                    status:false
                })
            )
        }
        

        const foundResult = await ranksModel.findOne({unique_id:unique_id})
        
        if(foundResult){

            if(unique_id ==='BP1RG' || unique_id ==='BP2RD' || unique_id ==='BP3RR'){
                const result = await ranksModel.findOneAndUpdate({unique_id:unique_id} , {commission:commission} , {new:true});
                if(result){
                    res.json({
                        message: "Commission for this rank updated successfully",
                        status:true,
                        result: result
                    })
                }
                else{
                    res.json({
                        message: "could not Update Rank",
                        status:false,
                    })
                }
            }
            else{
                res.json({
                    message:"unique id must be of this : BP1RG, BP2RD, or BP3RR"
                })
            }
           
        }
        else{
            res.json({
                message: "could not found any rank of this unique_id to update it.",
                status:false,
            })
        }


        
        
    }
    catch(err){
        res.json({
            
        })
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