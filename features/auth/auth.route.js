import express from 'express';
import passport from 'passport';
import authController from './auth.controller.js';

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', authController.googleAuthCallback);

router.get('/success', authController.authSuccess);

router.get('/failure', authController.authFailure);

export default router;

