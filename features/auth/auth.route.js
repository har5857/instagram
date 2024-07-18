import express from 'express';
import passport from 'passport';
import authController  from './auth.controller.js';
// import jwt from 'jsonwebtoken';


const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());



router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', authController.googleAuthCallback);

router.get('/success', authController.authSuccess);

router.get('/failure', authController.authFailure);

router.get('/profile',authController.authMiddleware, authController.authSuccess);

export default router;
