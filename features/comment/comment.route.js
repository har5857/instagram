import express from 'express';
import CommentController from './comment.controller.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';
import { validateComment,
         validateupdate
 } from './comment.validation.js'

const router = express.Router();

//add comment
router.post('/add-comment/:postId', userVerifyToken, validateComment , CommentController.addComment);

//update Comment
router.put('/update-comment/:postId', userVerifyToken, validateupdate , CommentController.updateComment);

//delete Comment
router.delete('/delete-comment/:postId', userVerifyToken , CommentController.deleteComment);

export default router;