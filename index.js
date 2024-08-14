import express from "express";
import bodyParser from "body-parser";
import connectDB from "./helper/dbConnection.js";
import router from "./router.js";
import path, { dirname } from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import session from "express-session";
import cookieParser from "cookie-parser";
import socketRoutes from "./features/message/message.route.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import ngrok from "@ngrok/ngrok";

dotenv.config();
const app = express();
// app.use(cors())

app.use(cookieParser());

connectDB();
const PORT = process.env.PORT || 5555;

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

/*_ _ _ _ _ _ _ _ 

   Npm socket.Io 
  _ _ _ _ _ _ _ _
*/
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.use(cors());

socketRoutes(io);

/*_ _ _ _ _ _ _ _ 

   Upload File
  _ _ _ _ _ _ _ _
*/

const uploads = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploads));

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

app.use("/api", router);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

export default io;
