import jwt from 'jsonwebtoken';
import User from './user.model.js';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if (!user) {
      console.error('No user found:', info ? info.message : 'No additional info');
      return res.status(400).json({ message: info ? info.message : 'Authentication failed' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
    );
    console.log('Generated token:', token);
    res.redirect(`https://16c4-49-36-80-78.ngrok-free.app/auth/success#token=${token}`);
  })(req, res, next);
};

const authSuccess = async (req, res) => {
  const { token } = req.body; // Extract token from request body
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Google Login Successfully.', token, data: user });
    console.log('User data:', user);
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
