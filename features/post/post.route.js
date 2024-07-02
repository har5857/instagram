import express from 'express';
import PostController from './post.controller.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';

const router = express.Router();

//upload post
router.post('/upload-post', userVerifyToken, PostController.uploadPost);

//get post
router.get('/get-post/:postId', userVerifyToken, PostController.getPost);

//get all post
router.get('/get-all-post', userVerifyToken, PostController.getAllPosts);

//delete post
router.delete('/delete-post/:postId', userVerifyToken, PostController.deletePost);

export default router;

