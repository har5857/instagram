import express from 'express';
import CommentController from './comment.controller.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';

const router = express.Router();

//add comment
router.post('/add-comment/:postId', userVerifyToken, CommentController.addComment);

export default router;