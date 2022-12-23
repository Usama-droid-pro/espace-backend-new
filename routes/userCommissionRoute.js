
const express = require('express');
const router = express.Router();
const controller = require("../controllers/user_commissionController")

router.get("/getUserCommission" , controller.getUserCommission)
// router.get("/getAllPrivacyPolicies" , controller.getAllPrivacyPolicy)
// router.put("/updatePrivacyPolicies", controller.updatePrivacyPolicy)
// router.delete("/deletePrivacyPolicy/:privacyPolicyId", controller.deletePrivacyPolicy)

module.exports= router;