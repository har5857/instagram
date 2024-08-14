import express from "express";
import NotificationController from "./notification.controller.js";
import { userVerifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();

//send-Notification
router.post(
  "/send-notification/:userId",
  userVerifyToken,
  NotificationController.sendNotification
);

//read-Notificatio
router.post(
  "/read-notification/:notificationId",
  userVerifyToken,
  NotificationController.readNotification
);

//get-Notification
router.get(
  "/get-notification",
  userVerifyToken,
  NotificationController.getNotification
);

//get-All-Notification
router.get(
  "/get-All-notification",
  userVerifyToken,
  NotificationController.getAllNotification
);

export default router;
