import express from "express";
const router = express.Router();

import userRoutes from "./features/auth/user.route.js";
import friendRequestRoutes from "./features/request/request.route.js";
import notificationRoutes from "./features/notification/notification.route.js";
import postRoutes from "./features/post/post.route.js";
import commentRoutes from "./features/comment/comment.route.js";
import paymentRoutes from "./features/payment/payment.route.js";

// User routes
router.use("/user", userRoutes);

// Friend routes
router.use("/request", friendRequestRoutes);

// Notification Routes
router.use("/notification", notificationRoutes);

// Post Routes
router.use("/post", postRoutes);

// comment Routes
router.use("/comment", commentRoutes);

// payment Routes
router.use("/payment", paymentRoutes);

export default router;
