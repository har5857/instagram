import Notification from './notification.model.js';
import UserService from '../auth/user.service.js';
const userService = new UserService();
import io from '../../index.js';

class NotificationService {
    async sendNotification(senderId, receiverId, message ){
        const sender = await userService.getUserById(senderId);
        const receiver = await userService.getUserById(receiverId);
        if(!sender ||!receiver){
            return {success: false, message: 'User not found'};
        }
        else {
        const notification = new Notification({
            from: senderId,
            to: receiverId,
            message
        });
        await notification.save();
        return {success:true , message: 'notification sent successfully'};
    }
  }

  async sendFriendRequestNotification(senderId,receiverId){
    const sender = await userService.getUserById(senderId);
    const receiver = await userService.getUserById(receiverId);
    if(!sender || !receiver){
        return { success: false, message: 'User Not Found'};
    }else{
        const message = `${sender.userName} sent you a friend request`;
        io.emit(`notification_${senderId}`, {message});
        const notification = new Notification({ user: senderId ,message});
        await notification.save();
        return { success:true , notification};
    }
  }

  async acceptFriendRequestNotification(senderId,receiverId){
    const sender = await userService.getUserById(senderId);
    const receiver = await userService.getUserById(receiverId);
    if(!sender || !receiver){
        return { success: false, message: 'User Not Found'};
      }else{  
        const message = `${receiver.userName} accepted your Friend Request`;
        io.emit(`notification_${receiverId}`, { message});
        const notification = new Notification({ user: receiverId , message});
        await notification.save();
        return { success: true ,notification};
      }
  }

  async readNotification(notificationId , senderId){
    const existingNotification = await Notification.findOneAndUpdate({user:senderId, _id: notificationId , isRead:true });
    if (!existingNotification) {
        return { success: false, message: 'User Or Notification not Found' };
    }else{
      await existingNotification.save();
      return { success: true, message:'Notification Fetched SuccesFully', data :existingNotification};
    }
  }
  
  async getNotification(userId){
   try{
    const pendingNotification = await Notification.find({user : userId , isread: false});
    return{ success : true, message:'Notification Fetched Succesfully', data: pendingNotification};
    }catch(error){
    throw error;
    }
  }

  async getAllNotification(userId){
    try {
      const AllNotification = await Notification.find({user : userId});
      return{ success: true , message:' All Notification Fetched Success..', data: AllNotification};
    } catch (error){
      throw error;
    }
  }
}

export default NotificationService;