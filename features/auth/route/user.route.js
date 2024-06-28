import express from 'express';
import UserController from '../controller/user.controller.js';
import {
    validateUpdate,
    validateRegistration,
    validateLogin,
    validatechangePassword,
} from '../validation/user.validation.js';
import { userVerifyToken } from '../../../middleware/verifyToken.js';

const router = express.Router();

//register
router.post('/register-user', validateRegistration, UserController.registerUser);

//login
router.post('/login-user', validateLogin, UserController.loginUser);

//get all users
router.get('/get-all-user', userVerifyToken, UserController.getAllUser);

//get user
router.get('/get-user/:userId', userVerifyToken, UserController.getUser);

//update user
router.put('/update-user/:userId', userVerifyToken, validateUpdate, UserController.updateUser);

//delete user
router.delete('/delete-user/:userId', userVerifyToken, UserController.deleteUser);

//changepassword
router.put('/change-password', userVerifyToken, validatechangePassword, UserController.changePassword);

//forgotpassword
router.post('/forgot-password', UserController.forgotPassword);

//resetpassword
router.post('/reset-password', UserController.resetPassword);

export default router;
