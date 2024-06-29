import express from 'express';
const router = express.Router();
import userRoutes from './features/auth/route/user.route.js';
import friendRequestRoutes from './features/request/request.route.js';

// User routes
router.use('/user', userRoutes);

// Friend request routes
router.use('/request', friendRequestRoutes);

export default router;
