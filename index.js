import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './helper/dbConnection.js';
import router from './router.js'; 

import dotenv from 'dotenv';
dotenv.config();

const app = express();

connectDB();

app.use(bodyParser.json());

app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
