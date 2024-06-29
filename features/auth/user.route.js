import express from 'express';
import UserController from './user.controller.js';
import {
    validateUpdate,
    validateRegistration,
    validateLogin,
    validatechangePassword,
} from './user.validation.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';
import upload from '../../middleware/upload.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';
import { userRoles } from '../../config/enum.js';

const router = express.Router();

//register
router.post('/register-user', upload ,validateRegistration, UserController.registerUser);

//login
router.post('/login-user', validateLogin, UserController.loginUser);

//get all users
router.get('/get-all-user', userVerifyToken , roleMiddleware([userRoles.ADMIN]), UserController.getAllUser);

//get user
router.get('/get-user/:userId', userVerifyToken,roleMiddleware([userRoles.ADMIN , userRoles.USER]), UserController.getUser);

// router.get('/get-all-followers', userVerifyToken, UserController.getAllFollowers);

//update user
router.put('/update-user/:userId', userVerifyToken,roleMiddleware([userRoles.ADMIN , userRoles.USER]),validateUpdate, UserController.updateUser);

//delete user
router.delete('/delete-user/:userId', userVerifyToken,roleMiddleware([userRoles.ADMIN]), UserController.deleteUser);

//changepassword
router.put('/change-password', userVerifyToken, validatechangePassword, UserController.changePassword);

//forgotpassword
router.post('/forgot-password', UserController.forgotPassword);

//resetpassword
router.post('/reset-password', UserController.resetPassword);

//Assign-user-role
router.put('/assign-role/:userId', userVerifyToken, roleMiddleware([userRoles.ADMIN]), UserController.assignUserRole);

export default router;
