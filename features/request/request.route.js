import express from 'express';
import RequestController from './request.controller.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';

const router = express.Router();

// Send friend request 
router.post('/send-friend-request/:userId', userVerifyToken, RequestController.sendFriendRequest);

// get pending request
router.get('/get-all-request', userVerifyToken, RequestController.getPendingRequests);

export default router;
