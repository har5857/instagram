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
    res.redirect(`/auth/success?token=${token}`);
  })(req, res, next);
};

const authSuccess = async (req, res) => {
  const token = req.query.token;
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

export default {
  googleAuthCallback,
  authSuccess,
  authFailure,
};
