import MessageService from './message.service.js'

class MessageController{

  static async getMessage(req,res){
    const userId = req.user._id;
   try {
      const result = await MessageService.checkMessage(userId);
      if (!result.success) {
        return res.status(400).json({ success: false, message: result.message });
      }
      res.status(200).json({ success: true, message: result.message, data: result.data});
   } catch (error) {
      console.error(`Error fetched Message:`, error.message);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
}

static async sendMessage(req, res = null) {
   try {
     const { toId, fromId, messageContent } = req.body;
     const data = await MessageService.saveMessage({
       toUser: toId,
       fromUser: fromId,
       content: messageContent,
     });
     if (res) {
       res.status(201).json({ success: true, message: 'Message sent successfully', data });
     }
     return { success: true, data };
   } catch (error) {
     console.error('Error sending message:', error.message);
     if (res) {
       res.status(500).json({ success: false, message: 'Internal Server Error' });
     }
     return { success: false, message: 'Error sending message' };
   }
 }
 
 

}
   


export default MessageController;