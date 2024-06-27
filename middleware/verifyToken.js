import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../features/auth/model/user.model.js';

export const userVerifyToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authentication and bearer token is required.' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        const verified = jwt.verify(token, process.env.jwtSecret)
        const user = await User.findById(verified.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found in database' });
        }
        req.user = user; 
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

// export const authenticateAdmin = async (req, res, next) => {
//     const authHeader = req.header('Authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     const token = authHeader.replace('Bearer ', '');

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.userId);
//         if (!user || !user.isAdmin) {
//             return res.status(403).json({ message: 'Forbidden: Admin access required' });
//         }
//         req.user = user; 
//         next();
//     } catch (error) {
//         console.error('Authentication failed:', error);
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
// };

