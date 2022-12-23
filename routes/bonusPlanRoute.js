
const express = require('express');
const router = express.Router();
const controller = require("../controllers/bonus_planController")

router.post("/createBonusPlan" , controller.createBonusPlan)
router.get("/getAllBonusPlans" , controller.getAllBonusPlans)
router.get("/getBonusPriceOfAllSales_nos_By_rank_unique_id", controller.getBonusPriceOfAllSales_nos_By_rank_unique_id)
router.put("/updateBonusPlan", controller.updateBonusPlan)

module.exports= router;