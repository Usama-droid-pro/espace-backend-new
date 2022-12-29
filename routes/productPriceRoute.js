
const express = require('express');
const router = express.Router();
const controller = require("../controllers/productPriceController")

router.post("/createProductPrice" , controller.createProductPrice)
router.get("/getAllProductPrices" , controller.getAllProductPrices)
router.get("/getProductPrice" , controller.getProductPriceByUniqueId)
router.delete("/deleteProductPrice" , controller.deleteProductPrice)
router.put("/updateProductPriceByUnique_id" , controller.updateProductPriceByUnique_id)




module.exports= router;