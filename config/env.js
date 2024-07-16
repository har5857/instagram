import dotenv from 'dotenv';
dotenv.config();

const env = {
    database: {
        url: process.env.MONGO_DB_URL,
    },
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT,
    email: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        service: process.env.EMAIL_SERVICE,
    },
    adminEmail: process.env.ADMIN_EMAIL,
    sessionSecret: process.env.SESSION_SECRET,
    google: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    },
    razorpay: {
        keyId: process.env.RAZORPAY_KEY_ID,
        keySecret: process.env.RAZORPAY_KEY_SECRET,
    }
};

export default env;