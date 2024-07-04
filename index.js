import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './helper/dbConnection.js';
import router from './router.js'; 
import path from 'path';
import cors from'cors';
import dotenv from 'dotenv';
import UserService from './features/auth/user.service.js';
const userService = new UserService();
import MessageService from './features/message/message.service.js';
const messageService = new MessageService();

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

      socket.on('checkMessages', async (userId) => {
          // const { userId } = message;
        try {
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


    // socket.on('sendMessage', (message) => {
    //     const { usrId, toNumber, fromNumber } = message;
    //     const toSocketId = user[toNumber];
        
    //     if (toSocketId) {
    //         io.to(toSocketId).emit('receiveMessage', {
    //             usrId,
    //             toNumber,
    //             fromNumber,
    //             message: message.content
    //         });
    //         console.log(`Message sent from ${fromNumber} to ${toNumber}`);
    //     } else {
    //         console.log(`User with number ${toNumber} is not connected.`);
    //     }
    // });

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
const uploadsPath = path.join(new URL('.', import.meta.url).pathname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// socket
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// export default io;