
const mongoose = require("mongoose")
const productPriceModel = require("../models/productPriceModel")


exports.createProductPrice = async (req,res)=>{

    try{
        const price = req.body.price;
        const unique_id = req.body.unique_id;


        if(unique_id=="PR_UNIQUE"){
            const foundResult = await productPriceModel.findOne({unique_id:unique_id});

            if(!foundResult){
                const newProductPrice = await productPriceModel({
                    _id:mongoose.Types.ObjectId(),
                    price: price,
                    unique_id:unique_id
                })
                const result = await newProductPrice.save();
    
                if(result){
                    res.json({
                        message: "New Product Price has been created successfully",
                        result: result,
                        status: 'success',
                    })
                }
                else{
                    res.json({
                        message: "Could not create new product Price",
                        status: "failed"
                    })
                }
            }
            else{
                res.json({
                    message: "Product price for this unique_id is already created",
                    status:false
                })
            }
        }
        else{
            res.json({
                message: "unique_id must be PR_UNIQUE",
                status:false
            })
        }
    }
    catch(err){
        res.json({
            message: "Error creating Product Price",
            error:err.message
        })
    }
}

exports.getAllProductPrices = async(req,res)=>{
    try{
        const result= await productPriceModel.find({});
        if(result){
            res.json({
                message: "Product prices fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch Product prices",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching Product prices",
            error:err.message
        })
    }
}
exports.getProductPriceByUniqueId = async(req,res)=>{
    try{
        const unique_id = req.query.unique_id;

        const result= await productPriceModel.findOne({unique_id:unique_id});
        if(result){
            res.json({
                message: "Product price fetched",
                result: result,
                status: 'success',
            })
        }
        else{
            res.json({
                message: "Could not fetch Product price",
                status: "failed"
            })
        }
        
        
    }
    catch(err){
        res.json({
            message: "Error fetching Product prices",
            error:err.message
        })
    }
}

exports.deleteProductPrice= async(req,res)=>{
    try{
        const productPriceId = req.query.productPriceId;
        const result= await productPriceModel.deleteOne({_id:productPriceId})

        if(result.deletedCount>0){
            res.json({
                message: "Deleted",
                result:result
            })
        }
        else{
            res.json({
                message: "could not deleted",
                status:"failed"
            })
        }
    }
    catch(err){
        res.json({
            message: "Error",
            error:err.message
        })
    }
}



exports.updateProductPriceByUnique_id= async (req,res)=>{
    try{
        const price = req.body.price;
        const unique_id = req.body.unique_id;

        const foundResult = await productPriceModel.findOne({unique_id: unique_id});
        if(!foundResult){
            return (
                res.json({
                    message: "Product price with this unique Does not exist",
                    status:false
                })
            )
        }
        else{
        const result = await productPriceModel.findOneAndUpdate({unique_id: unique_id} , {price:price} , {new:true});
        if(result){
            res.json({
                message: "Product price updated successfully",
                result:result,
                status: 'success'
            })
        }
        else{
            res.json({
                message: "could not updated",
                result:null,
                status:"false"
            })
        }
        }

        
    }
    catch(err){
        res.json({
            message: "error",
            error:err.message
        })
    }
}