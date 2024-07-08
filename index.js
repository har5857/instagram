import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './helper/dbConnection.js';
import router from './router.js'; 
import path, { dirname } from 'path';
import cors from'cors';
import dotenv from 'dotenv';
import UserService from './features/auth/user.service.js';
const userService = new UserService();
import MessageService from './features/message/message.service.js';
const messageService = new MessageService();
import { fileURLToPath } from 'url';
import Message from './features/message/message.model.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const user = {}; 


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
import MessageController from './features/message/message.controller.js';

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
          // console.log(users);
      })
      .catch(error => {
          console.error('Error sending user list:', error);
      });

      socket.on('checkMessages', async (token) => {
        try {
            const decoded = jwt.verify(token, 'user'); 
            const userId = decoded.userId; 
    
            const result = await MessageService.checkMessage(userId);
            if (result.success) {
                socket.emit('messages', result.data);
            } else {
                socket.emit('error', 'Could not retrieve messages.');
            }
        } catch (error) {
            socket.emit('error', 'An error occurred while retrieving messages.');
        }
    });

     socket.on('getAllMessages', async (userId)=> {
      try {
        const result = await MessageService.getAllMessages(userId);
        if(!result.success){
          socket.emit('messages', result.data);
        } else {
          socket.emit('error', 'An error occurred while retrieving messages.');
        }
      } catch (error) {
        socket.emit('error', 'An error occurred while retrieving messages.');
      }
     });


     socket.on('sendMessage', async (data) => {
      try {
        const { toId, fromId, messageContent } = data;
        const newMessage = new Message({
          toUser: toId,
          fromUser: fromId,
          content: messageContent,
        });
        await newMessage.save();
        console.log('Message saved to Database');
        socket.broadcast.emit('newMessage', newMessage);
      } catch (error) {
        console.error('Error saving message:', error.message);
      }
    });
    
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
// const uploadsPath = path.join(new URL('.', import.meta.url).pathname, 'uploads');
// app.use('/uploads', express.static(uploadsPath));

const uploads = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploads));

// socket
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// export default io;