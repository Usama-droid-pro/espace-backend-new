
const express = require('express');
const router = express.Router();
const controller = require("../controllers/stopLossController")

router.post("/createStopLoss" , controller.createStopLoss)
router.get("/getAllStopLoss" , controller.getAllStopLoss)
router.get("/getStopLossById" , controller.getStopLossById)
router.delete("/deleteStopLoss" , controller.deleteStopLoss)
router.put("/updateStopLoss" , controller.updateStopLoss)



module.exports= router;