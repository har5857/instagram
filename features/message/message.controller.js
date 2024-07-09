import MessageService from './message.service.js'
import io from '../../index.js'

class MessageController{

  static async sendMessage(req, res){
    const { fromUserId, toUserId, message } = req.body;

    if (!fromUserId || !toUserId || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    try {
        const newMessage = await MessageService.saveMessage(fromUserId, toUserId, message);
        io.to(toUserId).emit('receiveMessage', { fromUserId, message, createdAt: newMessage.createdAt });
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

}
   


export default MessageController;