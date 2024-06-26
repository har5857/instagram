import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../features/auth/model/user.model.js';

export const userVerifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access Denied' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const verified = jwt.verify(token, env.jwtSecret);
        
        const user = await User.findById(verified.userId);
        if (!user) {
            return res.status(401).json({ message: 'user is not in database' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid Token' });
    }
};

