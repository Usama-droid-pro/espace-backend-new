
const express = require('express');
const router = express.Router();
const controller = require("../controllers/tradeController")

router.post("/createTrade" , controller.createTrade)
router.get("/getAllTrades" , controller.getAllTrades)
router.get("/getTradeById" , controller.getTradeById)
router.get("/getAllTradesByTraderId" , controller.getAllTradersByTraderId)

router.get("/getAllTradesByAdmin" , controller.getAllTradesByAdmin)
router.get("/getAllTradesByTrader" , controller.getAllTradesByTrader)
router.delete("/deleteTradeById" , controller.deleteTradeById)
router.delete("/deleteAllTradesOfAdmin" , controller.deleteAllTradesOfAdmin)
router.delete("/deleteAllTradesOfTraders" , controller.deleteAllTradesOfTraders)
router.put("/updateTakeProfit" , controller.updateTakeProfit)
router.put("/updateStopLoss" , controller.updateStopLoss)
router.put("/active_close_trade" , controller.active_close_trade)
router.delete("/deleteTradesOfSpecificTrader" , controller.deleteTradesOfSpecificTrader)


module.exports= router;