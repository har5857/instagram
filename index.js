import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './helper/dbConnection.js';
import router from './router.js'; 
import path, { dirname } from 'path';
import cors from'cors';
import dotenv from 'dotenv';
import UserService from './features/auth/user.service.js';
const userService = new UserService();
import { fileURLToPath } from 'url';
import Message from './features/message/message.model.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
app.use(cors())

connectDB();
const PORT = process.env.PORT || 5000;

/*_ _ _ _ _ _ _ _ 

   Npm socket.Io 
  _ _ _ _ _ _ _ _
*/
import http from 'http';
import { Server as SocketIOServer  } from 'socket.io';

const server = http.createServer(app);
const io = new SocketIOServer(server,{
  cors: {
    origin: "http://localhost:5555",
    methods: [ "GET","POST" ],
  },
});

io.on('connection', (socket) => {
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

        const newMessage = new Message({ fromUserId, toUserId, message });
        await newMessage.save();

        socket.emit('receiveMessage', { fromUserId, message, createdAt: newMessage.createdAt });
    });

    socket.on('getMessages', async (data) => {
      const { userId } = data;
      try {
        const messages = await Message.find({ toUserId: userId, notRead: true });
        socket.emit('userMessages', messages);
      } catch (error) {
        console.error('Error retrieving messages:', error);
      }
    });

    socket.on('readMessage', async (data)=>{
      const { messageId } = data;  
      try {
        const message = await Message.findByIdAndUpdate(messageId, { notRead: false },{ new: true });
        socket.emit('userReadMessage', message);
      } catch (error) {
        console.error('Error retrieving messages:', error);
      }
      })

    socket.on('getAllMessage', async (data) => {
        const { userId } = data;
        try {
          const messages = await Message.find({ toUserId : userId });
          socket.emit('userAllMessages', messages);
        } catch (error) {
          console.error('Error retrieving messages:', error);
        }
    })

    socket.on('deleteMessage' , async (data) => {
        const { messageId } = data;
        try {
          const message = await Message.findByIdAndDelete({ _id: messageId});
        } catch (error) {
          console.error('Error retrieving messages:', error);
        }
    })

  socket.on('disconnect', () => {
      console.log('A user disconnected');
  });
});

/*_ _ _ _ _ _ _ _ 

   Npm node-cron
  _ _ _ _ _ _ _ _
*/
// import cron from 'node-cron';
// import sendMail from './features/cron/testMailcron.js';

// cron.schedule("*/1 * * * *", function() { 
//     sendMail(); 
//     }); 


app.use(bodyParser.json());

app.use('/api', router);

/*_ _ _ _ _ _ _ _ 

   Upload File
  _ _ _ _ _ _ _ _
*/

const uploads = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploads));

// socket
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default io;