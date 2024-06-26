import express from 'express';
import UserController from '../controller/user.controller.js';
import {
    validateUpdate,
    validateRegistration,
    validateLogin
} from '../validation/user.validation.js';
import { userVerifyToken } from '../../../middleware/verifyToken.js';

const router = express.Router();

router.post('/register-user', validateRegistration, UserController.registerUser);
router.post('/login-user', validateLogin, UserController.loginUser);
router.get('/get-all-user', userVerifyToken, UserController.getAllUser);
router.get('/get-user/:userId', userVerifyToken, UserController.getUser);
router.put('/update-user/:userId', userVerifyToken, validateUpdate, UserController.updateUser);
router.delete('/delete-user/:userId', userVerifyToken, UserController.deleteUser);

export default router;
