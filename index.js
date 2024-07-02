import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './helper/dbConnection.js';
import router from './router.js'; 
import path from 'path';
import cors from'cors';
import { Server } from 'socket.io';
import http from 'http'
// import cron from 'node-cron';
// import sendMail from './features/cron/testMailcron.js';

import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors())

const server = http.createServer(app);
const io = new Server(server);

io.on('connection',(socket)=> {
    console.log('User Connected');

    socket.on('disconnect',()=>{
        console.log('User disconnected');
    });
});
// cron.schedule("*/1 * * * *", function() { 
//     sendMail(); 
//     }); 

connectDB();

app.use(bodyParser.json());

app.use('/api', router);

const uploadsPath = path.join(new URL('.', import.meta.url).pathname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

export default io;