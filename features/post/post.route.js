import express from 'express';
import PostController from './post.controller.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';
import upload from '../../middleware/uploadpost.js';
import { validateUpdate } from './post.validation.js'
import multer from 'multer';

const router = express.Router();

//upload post
router.post('/upload-post',(req, res, next) => {
    upload(req, res, function (err) {
        if (req.fileValidationError) {
            return res.status(400).json({ message: req.fileValidationError });
        } else if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: 'Only images allowed' });
        }
        next();
    });
},userVerifyToken, PostController.uploadPost);

//get post
router.get('/get-post/:postId', userVerifyToken, PostController.getPost);

//Update Post
router.put('/update-post/:postId', userVerifyToken, validateUpdate , PostController.updatePost);

//get all post
router.get('/get-all-post', userVerifyToken, PostController.getAllPosts);

//delete post
router.delete('/delete-post/:postId', userVerifyToken, PostController.deletePost);

//add-like
router.post('/add-like/:postId', userVerifyToken, PostController.addLike);

//remove-like
router.delete('/remove-like/:postId',userVerifyToken,PostController.removeLike);

export default router;

