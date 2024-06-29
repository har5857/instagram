import FriendRequestService from './request.service.js';
const friendRequestService = new FriendRequestService();

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
            res.status(200).json({ success: true, message: result.message, data: result.data });
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
}

export default FriendRequestController;
