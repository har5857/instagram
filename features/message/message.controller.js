import UserService from '../auth/user.service.js';
const userService = new UserService();
import MessageService from './message.service.js';
import Message from './message.model.js';


const socketController = (socket) => {
    console.log('A user connected');

    userService.getAllUsers()
        .then(users => {
            socket.emit('userList', users);
        })
        .catch(error => {
            console.error('Error sending user list:', error);
        });

    socket.on('sendMessage', async (data) => {
        const { fromUserId, toUserId, message } = data;
    
        try {
            const fromUserExists = await userService.getUserById(fromUserId);
            if (!fromUserExists) {
                throw new Error(`User with ID ${fromUserId} does not exist.`);
            }
            const toUserExists = await userService.getUserById(toUserId);
            if (!toUserExists) {
                throw new Error(`User with ID ${toUserId} does not exist.`);
            }
            const newMessage = await MessageService.saveMessage(fromUserId, toUserId, message);
            socket.emit('receiveMessage', { fromUserId, message, createdAt: newMessage.createdAt });
        } catch (error) {
            console.error('Error sending message:', error.message);
            socket.emit('sendMessageError', { error: error.message });
        }
    });
    

    socket.on('getMessages', async (data) => {
        const { userId } = data;
        try {
            const userIdExists = await userService.getUserById(userId);
            if (!userIdExists) {
                throw new Error(`User with ID ${userId} does not exist.`);
            }
            const messages = await MessageService.getMessagesByUserId(userId);
            socket.emit('userMessages', messages);
        } catch (error) {
            console.error('Error retrieving messages:', error);
        }
    });

    socket.on('readMessage', async (data) => {
        const { messageId } = data;
        try {
            const message = await Message.findByIdAndUpdate(messageId, { notRead: false }, { new: true });
            socket.emit('userReadMessage', message);
        } catch (error) {
            console.error('Error marking message as read:', error);
        }
    });

    socket.on('getAllMessages', async (data) => {
        const { userId } = data;
        try {
            const userIdExists = await userService.getUserById(userId);
            if (!userIdExists) {
                throw new Error(`User with ID ${userId} does not exist.`);
            }
            const messages = await Message.find({ toUserId: userId });
            socket.emit('userAllMessages', messages);
        } catch (error) {
            console.error('Error retrieving all messages:', error);
        }
    });

    socket.on('deleteMessage', async (data) => {
        const { messageId } = data;
        try {
            await Message.findByIdAndDelete(messageId);
            socket.emit('messageDeleted', { messageId });
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
};

export default socketController;