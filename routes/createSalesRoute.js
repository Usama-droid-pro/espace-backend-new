
const express = require('express');
const router = express.Router();
const controller = require("../controllers/createSalesController")

router.post("/createSales" , controller.createSale)

module.exports= router;