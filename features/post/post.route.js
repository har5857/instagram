import express from 'express';
import PostController from './post.controller.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';
import upload from '../../middleware/uploadpost.js';

const router = express.Router();

//upload post
router.post('/upload-post',  upload.single('postImage') , userVerifyToken, PostController.uploadPost);

//get post
router.get('/get-post/:postId', userVerifyToken, PostController.getPost);

//get all post
router.get('/get-all-post', userVerifyToken, PostController.getAllPosts);

//delete post
router.delete('/delete-post/:postId', userVerifyToken, PostController.deletePost);

//add-like
router.post('/add-like/:postId', userVerifyToken, PostController.addLike);

//remove-like
router.delete('/remove-like/:postId',userVerifyToken,PostController.removeLike);

export default router;

