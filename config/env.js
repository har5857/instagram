import dotenv from 'dotenv';
dotenv.config();

const env = {
    database: {
        url: process.env.MONGO_DB_URL
    },
    jwtSecret: process.env.JWT_SECRET,
    port: process.env.PORT
};

export default env;
