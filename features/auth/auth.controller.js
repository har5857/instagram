import jwt from 'jsonwebtoken';
import User from './user.model.js';
import env from '../../config/env.js';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();
app.use(cookieParser());

passport.use(new GoogleStrategy({
  clientID: env.google.clientId,
  clientSecret: env.google.clientSecret,
  callbackURL: 'http://localhost:5555/auth/google/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      // Create a new user if one doesn't exist
      user = await User.create({
        googleId: profile.id,
        email: profile.emails[0].value,
        // Add any other fields you need to save
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const googleAuthCallback = (req, res, next) => {
  if (req.isAuthenticated()) {
    const token = jwt.sign(
      { id: req.user._id, email: req.user.email },
      process.env.JWT_SECRET,
    );
    console.log('Generated token:', token);

    res.cookie('authToken', token, { httpOnly: true, secure: true });

    return res.redirect(`http://localhost:5555/auth/success`);
  }

  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      console.error('No user found:', info ? info.message : 'No additional info');
      return res.status(400).json({ message: info ? info.message : 'Authentication failed' });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        console.error('Error during login:', loginErr);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
      );
      console.log('Generated token:', token);

      res.cookie('authToken', token, { httpOnly: true, secure: true });

      res.redirect(`http://localhost:5555/auth/success`);
    });
  })(req, res, next);
};

const authSuccess = async (req, res) => {
  const token = req.cookies.authToken; 
  try {
    if (!token) {
      return res.status(400).json({ message: 'Token missing' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Google Login Successfully.', token, data: user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const authFailure = (req, res) => {
  res.status(401).send('Error during authentication');
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. No Token Provided.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

export default {
  googleAuthCallback,
  authSuccess,
  authFailure,
  authMiddleware
};
