
const express = require('express');
const router = express.Router();
const controller = require("../controllers/notificationController")

router.post("/createNotification" , controller.createNotification)
router.get("/getAllNotifications" , controller.getAllNotifications)
router.get("/getNotificationsOfSpecificUser", controller.getNotificationsOfSpecificUser)
router.delete("/deleteNotification", controller.deleteNotification)
router.get("/getNotificationsForAll", controller.getNotificationsForAll)
router.get("/NotificationsByAdmin", controller.NotificationsByAdmin)
router.get("/NotificationsByTrader", controller.NotificationsByTrader)
router.get("/NotificationsBySystem", controller.NotificationsBySystem)




module.exports= router;