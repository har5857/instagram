import FriendRequest from './request.model.js';
import { friendRequestStatus ,
         accountType
} from '../../config/enum.js'; 
import UserService from '../auth/user.service.js';
// import User from '../auth/user.model.js';


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
        if (receiver.accountType === accountType.PRIVATE) {
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
                return { success: false, message: 'You are already following the user......' };
            } else {
                return { success: true, message: 'You are now following the user.' };
            }
        }
    }

    // async getAllFollowers(userId){
    //     try {
    //         const followers = await userService.getUserById(userId);
    //         if(!userId){
    //             return { success: false , message: 'user not found'};
    //         }
    //         else {
    //             return { success : true , message: 'Followers retrived succesfully' , data: user.followers , followers }
    //         }
    //     } catch (error) {
    //        console.error('Error fetching get All Followers:',error.message);
    //        throw error; 
    //     }
    // }
    

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

    // update request status
    async updateFriendRequestStatus(friendRequestId, newStatus) {
        try {
            const friendRequest = await FriendRequest.findById(friendRequestId);
            if (!friendRequest) {
                return { success: false, message: 'Friend Request Not Found' };
            }
            const { from: senderId, to: receiverId } = friendRequest;
            if (newStatus === friendRequestStatus.ACCEPTED) {
                friendRequest.status = newStatus;
                const sender = await userService.getUserById(senderId);
                const receiver = await userService.getUserById(receiverId);
                if (!sender || !receiver) {
                    return { success: false, message: 'Sender or Receiver Not Found' };
                }
                if (!receiver.followers.includes(senderId)) {
                    receiver.followers.push(senderId);
                }
                if (!sender.following.includes(receiverId)) {
                    sender.following.push(receiverId);
                }
                await sender.save();
                await receiver.save();
                await friendRequest.save();
                await FriendRequest.findByIdAndDelete(friendRequestId);
                return { success: true, message: 'Friend request accepted and successfully' };
            } else if (newStatus === friendRequestStatus.REJECTED) {
                await FriendRequest.findByIdAndDelete(friendRequestId);
                return { success: true, message: 'Friend request rejected successfully' };
            } else {
                return { success: false, message: 'Invalid Status' };
            }
        } catch (error) {
            console.error('Error updating friend request status:', error);
            throw error;
        }
    }
}

export default FriendRequestService;
