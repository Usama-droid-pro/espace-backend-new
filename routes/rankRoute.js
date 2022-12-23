
const express = require('express');
const router = express.Router();
const controller = require("../controllers/ranksController")

router.post("/createRank" , controller.createRank)
router.get("/getAllRanks" , controller.getAllRanks)
router.get("/getRankByRankId" , controller.getRankByRankId)
router.get("/getRankByUnique_id" , controller.getRankByUnique_id)
router.delete("/deleteRankByUnique_id" , controller.deleteRankByUnique_id)
router.put("/updateRankByUniqueId" , controller.updateRankByUniqueId)





module.exports= router;