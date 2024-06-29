import FriendRequest from './request.model.js';
import { friendRequestStatus } from '../../config/enum.js'; 
import UserService from '../auth/service/user.service.js';

const userService = new UserService();

class FriendRequestService {
    // send Friend Request
    async sendFriendRequest(senderId, receiverId) {
        const sender = await userService.getUserById(senderId);
        const receiver = await userService.getUserById(receiverId);
    
        if (!sender || !receiver) {
            return { success: false, message: 'User not found' };
        }
    
        const existingRequestSent = await FriendRequest.findOne({ from: senderId, to: receiverId });
        if (existingRequestSent) {
            return { success: false, message: 'Friend request already sent' };
        }
        const existingRequestReceived = await FriendRequest.findOne({ from: receiverId, to: senderId });
        if (existingRequestReceived) {
            return { success: false, message: 'Friend request already received' };
        }
        if (receiver.accountPrivate) {
            const friendRequest = new FriendRequest({
                from: senderId,
                to: receiverId,
                status: friendRequestStatus.PENDING
            });
            await friendRequest.save();
            return { success: true, message: 'Friend request sent successfully', data: friendRequest };
        } else {
            let alreadyFollowing = false;
    
            if (!receiver.followers.includes(senderId)) {
                receiver.followers.push(senderId);
                await receiver.save();
            } else {
                alreadyFollowing = true;
            }
    
            if (!sender.following.includes(receiverId)) {
                sender.following.push(receiverId);
                await sender.save();
            }
    
            if (alreadyFollowing) {
                return { success: false, message: 'You are already following the user.' };
            } else {
                return { success: true, message: 'You are now following the user.' };
            }
        }
    }

    // get all Request
    async getPendingRequests(userId) {
        try {
            const pendingRequests = await FriendRequest.find({ to: userId, status: friendRequestStatus.PENDING })
                .populate('from', 'userName'); 
            return { success: true, message: 'Pending requests fetched successfully', data: pendingRequests };
        } catch (error) {
            console.error('Error fetching pending requests:', error.message);
            throw error;
        }
    }
}

export default FriendRequestService;
