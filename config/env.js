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
    adminEmail: process.env.ADMIN_EMAIL
  };

export default env;
