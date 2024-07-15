import Message from './message.model.js';

const messageService = {
    saveMessage: async (fromUserId, toUserId, message) => {
        try {
            const newMessage = new Message({ fromUserId, toUserId, message });
            await newMessage.save();
            return newMessage;
        } catch (error) {
            console.error('Error saving message:', error);
            throw new Error('Error saving message');
        }
    },
    getMessagesByUserId: async (userId) => {
        try {
            return await Message.find({ toUserId: userId, notRead: true });
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw new Error('Error fetching messages');
        }
    },
   
};

export default messageService;