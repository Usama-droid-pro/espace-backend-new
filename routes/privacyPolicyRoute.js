
const express = require('express');
const router = express.Router();
const controller = require("../controllers/privacy_policyController")

router.post("/createPrivacyPolicy" , controller.createPrivacyPolicy)
router.get("/getAllPrivacyPolicies" , controller.getAllPrivacyPolicy)
router.put("/updatePrivacyPolicies", controller.updatePrivacyPolicy)
router.delete("/deletePrivacyPolicy/:privacyPolicyId", controller.deletePrivacyPolicy)

module.exports= router;