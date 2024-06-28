import { roleMiddleware} from '../config/enum'

// roleMiddleware
export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access Denied: You do not have the required permissions' });
        }
        next();
    };
};
