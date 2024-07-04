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

// static async getPendingRequests(req, res) {
//   const userId = req.user._id;
//   try {
//       const result = await friendRequestService.getPendingRequests(userId);
//       if (!result.success) {
//           return res.status(400).json({ success: false, message: result.message });
//       }
//       res.status(200).json({ success: true, message: result.message, data: result.data });
//   } catch (error) {
//       console.error('Error fetching pending requests:', error.message);
//       res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// }
}

export default MessageController;