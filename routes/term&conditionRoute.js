
const express = require('express');
const router = express.Router();
const controller = require("../controllers/terms&conditionsController")

router.post("/createTerms_conditions" , controller.createTerms_conditions)
router.get("/getAllTerm_conditions" , controller.getAllTerms_conditions)
router.put("/updateTerm_conditions", controller.updateTerms_conditions)
router.delete("/deleteTerms_conditions/:terms_conditionsId", controller.deleteTerms_conditions)

module.exports= router;