const express = require("express"),
router=express.Router();

const controller= require("../controllers/userForgerPwController");

router.post("/userForgetPassword",controller.emailVerification)
router.post("/verifyOTP" , controller.verifyOTP)

module.exports=router