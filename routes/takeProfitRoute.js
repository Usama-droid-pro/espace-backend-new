
const express = require('express');
const router = express.Router();
const controller = require("../controllers/takeProfitController")

router.post("/createTakeProfit" , controller.createTakeProfit)
router.get("/getAllTakeProfit" , controller.getAllTakeProfit)
router.get("/getTakeProfitById" , controller.getTakeProfitById)
router.delete("/deleteTakeProfit" , controller.deleteTakeProfit)
router.put("/updateTakeProfit" , controller.updateTakeProfit)



module.exports= router;