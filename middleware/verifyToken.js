import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../features/auth/user.model.js';

//user varification token
export const userVerifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Authentication and bearer token is required' });
    }
    const token = authHeader.replace('Bearer ', '');
    if(token){
        try {
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(verified.userId) || await User.findById(verified.id);
            if (!user) {
                return res.status(401).json({ message: 'User not found in database' });
            }
            req.user = user; 
            next();
        } catch (error) {
            console.error('Error verifying token:', error);
            return res.status(400).json({ message: 'Invalid Token' });
        }
    }else{
        return res.status(401).json({ message: 'Token is required' });
    }
    
};


