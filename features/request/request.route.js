import express from 'express';
import RequestController from './request.controller.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';
import { validateupdateFriendRequestStatus
 } from '../request/validation.js';

const router = express.Router();

// Send friend request 
router.post('/send-friend-request/:userId', userVerifyToken,RequestController.sendFriendRequest);

// get pending request
router.get('/get-all-request', userVerifyToken, RequestController.getPendingRequests);

// get All followers
router.get('/get-all-followers', userVerifyToken, RequestController.getAllFollowers);

//get all folowings
router.get('/get-all-followings',userVerifyToken,RequestController.getAllfollowings);

// remove follower
router.delete('/remove-follower/:userId', userVerifyToken,RequestController.removeFollowers);

// remove following
router.delete('/remove-following/:userId', userVerifyToken,RequestController.removeFollowings);

// update request status
router.post('/update-request-status/:friendRequestId', userVerifyToken, validateupdateFriendRequestStatus, RequestController.UpdateFriendRequestStatus);


export default router;
