import Message  from "./message.model.js";


class MessageService{

  static async checkMessage(userId) {
    try {
        const messages = await Message.find({ user: userId, notRead: true });
        return { success: true, message: 'Data fetched successfully', data: messages };
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        throw error;
    }
}
 static async getAllMessages(userId){
  try {
    const messages = await Message.find({ user: userId });
    return { success: true, message: 'Data fetched successfully', data: messages };
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    throw error;
  }
 }


 static async saveMessage(data) {
  try {
    const message = new Message(data);
    await message.save();
    return message;
  } catch (error) {
    console.error('Error saving message:', error.message);
    throw new Error('Error saving message to the database');
  }
}



}

export default MessageService;