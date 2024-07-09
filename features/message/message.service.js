import Message  from "./message.model.js";


class MessageService{

  static async saveMessage (fromUserId, toUserId, message){
    const newMessage = new Message({ fromUserId, toUserId, message });
    await newMessage.save();
    return newMessage;
};

}

export default MessageService;