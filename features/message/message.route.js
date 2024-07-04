import express from "express";
import MessageController from "./message.controller.js";
import { userVerifyToken } from "../../middleware/verifyToken.js";

const router = express.Router();



export default router;