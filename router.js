import express from 'express';
const router = express.Router();

import userRoutes from './features/auth/user.route.js';
import friendRequestRoutes from './features/request/request.route.js';
import notificationRoutes from './features/notification/notification.route.js';
import postRoutes from'./features/post/post.route.js'

// User routes
router.use('/user', userRoutes);

// Friend routes
router.use('/request', friendRequestRoutes);

// Notification Routes
router.use('/notification', notificationRoutes);

// Post routes
router.use('/post', postRoutes);

export default router;
