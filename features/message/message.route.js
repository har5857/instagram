import express from "express";
import MessageController from "./message.controller.js";
import { userVerifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();

router.post('/send-message' , userVerifyToken, MessageController.sendMessage );

export default router;