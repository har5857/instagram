import FriendRequestService from './request.service.js';
const friendRequestService = new FriendRequestService();
import { friendRequestStatus } from '../../config/enum.js'; 
import UserService from '../auth/user.service.js';
const userService = new UserService();
import NotificationService from '../notification/notification.service.js';
const notificationService = new NotificationService();

class FriendRequestController {
    //send friend Request
    static async sendFriendRequest(req, res) {
        const { userId } = req.params;
        const senderId = req.user._id;
        try {
            if (userId === senderId.toString()) {
                return res.status(400).json({ success: false, message: 'You cannot send a friend request to yourself' });
            }
            const result = await friendRequestService.sendFriendRequest(senderId, userId);
            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }
            const Notification = await notificationService.sendFriendRequestNotification(senderId, userId);

            res.status(200).json({ success: true, message: result.message, data: result.data ,Notification});
        } catch (error) {
            console.error('Error sending friend request:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    //pending Request
    static async getPendingRequests(req, res) {
        const userId = req.user._id;
        try {
            const result = await friendRequestService.getPendingRequests(userId);
            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }
            res.status(200).json({ success: true, message: result.message, data: result.data });
        } catch (error) {
            console.error('Error fetching pending requests:', error.message);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    // update Request Status
    static async UpdateFriendRequestStatus (req, res) {
        const { status } = req.body;
        const { friendRequestId ,} = req.params;
        try {
            if (![friendRequestStatus.ACCEPTED, friendRequestStatus.REJECTED].includes(status)) {
                return res.status(400).json({ success:false, message: 'Invalid status' });
            }
            const updatedRequest = await friendRequestService.updateFriendRequestStatus(friendRequestId, status);
            return res.status(200).json({ success:true ,message: 'Friend request updated successfully', data: updatedRequest });
        } catch (error) {
            return res.status(500).json({success:false, message: error.message });
        }
    }

    //get all followers
    static async getAllFollowers(req, res){
        try {
            const userId = req.user._id;
            let user = await userService.getUserById(userId);
            if(!user){
                return res.status(404).json({message : 'User not found ..'});
            }else{
                return res.status(200).json({ success: true, message: 'followers retrived succesfully', data: user.followers})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false , message:`Internal Server Error...${error.message}`});

        }
    }

    //get all followings
    static async getAllfollowings(req, res){
        try {
            const userId = req.user._id;
            let user = await userService.getUserById(userId);
            if(!user){
                return res.status(404).json({success: false , message: 'User Not Found'});
            }else{
                return res.status(200).json({success: true , message: 'following Retived Succesfully' ,data:user.following});
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false , message:`Internal Server Error...${error.message}`});
        }
    }

    //remove followers
    static async removeFollowers(req, res){
        const{ userId } = req.params;
        const senderId = req.user._id;
        try {
            const result = await friendRequestService.removeFollowers(senderId, userId);
            if (!result.success){
                return res.status(400).json({ success: false , message : result.message});
            }
            res.status(200).json({ success: true , message: result.message, data : result.data});
        } catch (error) {
          console.error('Error Remove Followers:', error.message);
          res.status(500).json({ success: false , message: 'Internal server Error'});  
        }
    }

    //remove followings
    static async removeFollowings(req, res){
        const{ userId } = req.params;
        const senderId = req.user._id;
        try {
            const result = await friendRequestService.removeFollowings(senderId, userId);
            if (!result.success){
                return res.status(400).json({ success: false , message : result.message});
            }
            res.status(200).json({ success: true , message: result.message, data : result.data});
        } catch (error) {
          console.error('Error Remove Followings:', error.message);
          res.status(500).json({ success: false , message: 'Internal server Error'});  
        }
    
}

}

export default FriendRequestController;
