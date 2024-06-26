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

router.post('/register-user', validateRegistration, UserController.registerUser);
router.post('/login-user', validateLogin, UserController.loginUser);
router.get('/get-all-user', userVerifyToken, UserController.getAllUser);
router.get('/get-user/:userId', userVerifyToken, UserController.getUser);
router.put('/update-user/:userId', userVerifyToken, validateUpdate, UserController.updateUser);
router.delete('/delete-user/:userId', userVerifyToken, UserController.deleteUser);
router.put('/change-password', userVerifyToken, validatechangePassword, UserController.changePassword);
router.post('/forgot-password', UserController.forgotPassword);
router.post('/reset-password', UserController.resetPassword);

export default router;