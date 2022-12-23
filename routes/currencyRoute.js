
const express = require('express');
const router = express.Router();
const controller = require("../controllers/currencyController")
const upload = require( "../middlewares/currencyImageMulter")

router.post("/createCurrency" , upload.single("icon") ,controller.createCurrency)
router.get("/getAllCurrencies" , controller.getAllCurrencies)
router.get("/getCurrencyById" , controller.getCurrencyById)

router.put("/updateCurrency",upload.single("icon"), controller.updateCurrency)
router.delete("/deleteCurrency", controller.deleteCurrency)

module.exports= router;