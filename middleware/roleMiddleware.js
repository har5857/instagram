import  { userRoles }  from '../config/enum.js';

export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ sucsess:false, message: 'Access Denied: You do not have the required permissions' });
        }
        next();
    };
};
