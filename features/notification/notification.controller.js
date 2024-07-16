import NotificationService from './notification.service.js';
const notificationService = new NotificationService();
// import  io  from '../../index.js';


class NotificationController {

    static async sendNotification(req, res){
        const { userId } = req.params;
        const senderId = req.user._id;
        const { message } = req.body;
      try {
        const result = await notificationService.sendNotification(senderId,userId,message);
        if(!result.success){
            return res.status(400).json({success: false , message: result.message});
        }
        io.emit(`notification_${userId}`, { message });
        res.status(200).json({ success: true , message : result.message, data : result.data});
      } catch (error) {
        console.error('Error sending Notification:', error.message);
        res.status(500).json({ success: false , message: 'Internal server Error'});
      }
    }

    static async readNotification(req, res){
      const { notificationId } = req.params;
      const senderId = req.user._id;
       try {
        const result = await notificationService.readNotification(notificationId,senderId);
        if(!result.success){
          return res.status(400).json({success: false , message: result.message});
        }
        res.status(200).json({ success: true , message: result.message, data : result.data});
       } catch (error) {
        console.error('Error sending Notification:', error.message);
        res.status(500).json({ success: false , message: 'Internal server Error'});
       }
    }

    static async getNotification(req,res){
      const userId = req.user.Id;
      try {
        const result = await notificationService.getNotification(userId);
        if(!result.success){
            return res.status(400).json({success:false , message: result.message});
        }
        res.status(200).json({success: true, message: result.message, data : result.data});
      } catch (error) {
        console.error('Error fetching Notifications', error.message);
        res.status(500).json({ success: false, message: 'Internal Servar Error'});
      }
    }

    static async getAllNotification(req,res){
      const userId = req.user.Id;
      try{
        const result = await notificationService.getAllNotification(userId);
        if(!result.success){
          return res.status(400).json({success:false , message: result.message});
        }
        res.status(200).json({success: true, message: result.message, data: result.data});
      }catch{error}{
        console.error('Error Fetching All Notification', error.message);
        res.status(500).json({ success: false, message: ' Iternal server Error'});
      }
    }

    

}

export default  NotificationController;