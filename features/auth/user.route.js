import express from 'express';
import UserController from './user.controller.js';
import {
    validateUpdate,
    validateRegistration,
    validateLogin,
    validatechangePassword,
    validateverifyOtp
} from './user.validation.js';
import { userVerifyToken } from '../../middleware/verifyToken.js';
import upload from '../../middleware/upload.js';
import { roleMiddleware } from '../../middleware/roleMiddleware.js';
import { userRoles } from '../../config/enum.js';
import multer from 'multer';

const router = express.Router();

//register
router.post('/register-user',(req, res, next) => {
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
},validateRegistration, UserController.registerUser);

//login
router.post('/login-user', validateLogin, UserController.loginUser);

//Resend-otp 
router.post('/resend-otp', UserController.resendOtp);

// otp-verify
router.post('/varify-otp',validateverifyOtp, UserController.verifyOtp);

//get all users
router.get('/get-all-user', userVerifyToken , roleMiddleware([userRoles.ADMIN]), UserController.getAllUser);

//get user
router.get('/get-user/:userId', userVerifyToken,roleMiddleware([userRoles.ADMIN , userRoles.USER]), UserController.getUser);

//update user
router.put('/update-user/:userId', (req, res, next) => {
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
}, userVerifyToken, roleMiddleware([userRoles.ADMIN, userRoles.USER]), validateUpdate, UserController.updateUser);

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

//search user
router.get('/search-user', UserController.searchUsers);

export default router ; 

