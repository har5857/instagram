import mongoose from 'mongoose';
import env from '../config/env.js'; 

//database connection
const connectDB = async () => {
    try {
        await mongoose.connect(env.database.url);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
};

export default connectDB;
