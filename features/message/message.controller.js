import UserService from '../auth/user.service.js';
const userService = new UserService();
import MessageService from './message.service.js';
import Message from './message.model.js';
import io from '../../index.js';


const users= {}

const socketController = (socket) => {
    const userId = socket.handshake.query.userId;
    users[userId] = socket.id;

  console.log('User connected:', userId, socket.id);

    // User Lists
    userService.getAllUsers()
        .then(users => {
            socket.emit('userList', users);
        })
        .catch(error => {
            console.error('Error sending user list:', error);
        });

    //  sending messages
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

            console.log("Successful", fromUserId, toUserId, message);

            const newMessage = await MessageService.saveMessage(fromUserId, toUserId, message);
            console.log("Emitting receiveMessage event", { fromUserId, toUserId, message, createdAt: newMessage.createdAt });

            io.emit('receiveMessage', { fromUserId, toUserId, message, createdAt: newMessage.createdAt });

        } catch (error) {
            console.error('Error sending message:', error.message);
            socket.emit('sendMessageError', { error: error.message });
        }
    });
    
    // retrieving messages 
    socket.on('getMessages', async (data) => {
        const { userId } = data;
        try {
            const userIdExists = await userService.getUserById(userId);
            if (!userIdExists) {
                throw new Error(`User with ID ${userId} does not exist.`);
            }

            const messages = await MessageService.getMessagesByUserId( userId );
            socket.emit('userMessages', messages);
        } catch (error) {
            console.error('Error retrieving messages:', error);
            socket.emit('getMessagesError', { error: error.message });
        }
    });

    // messages Count
    socket.on('countMessage', async (data) => {
        const { userId } = data;
        try {
            const userIdExists = await userService.getUserById(userId);
            if (!userIdExists) {
                throw new Error(`User with Id ${userId} does not exist.`);
            }
            const messages = await MessageService.getMessagesByUserId(userId);
            const unreadMessages = messages.filter(message => message.notRead === true);
            const unreadCount = unreadMessages.length;
    
            socket.emit('getcountMessage', { unreadCount });
        } catch (error) {
            console.error('Error retrieving messages:', error);
            socket.emit('countMessage', { error: error.message });
        }
    });

    // marking a message as read
    socket.on('readMessage', async (data) => {
        const { messageId } = data;

        try {
            const message = await Message.findByIdAndUpdate(messageId, { notRead: false }, { new: true });
            socket.emit('userReadMessage', message);
        } catch (error) {
            console.error('Error marking message as read:', error);
            socket.emit('readMessageError', { error: error.message });
        }
    });

    // retrieving all messages 
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
            socket.emit('getAllMessagesError', { error: error.message });
        }
    });

    // deleting a message
    socket.on('deleteMessage', async (data) => {
        const { messageId } = data;

        try {
            await Message.findByIdAndDelete(messageId);
            socket.emit('messageDeleted', { messageId });
        } catch (error) {
            console.error('Error deleting message:', error);
            socket.emit('deleteMessageError', { error: error.message });
        }
    });

    // user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
};

export default socketController;
