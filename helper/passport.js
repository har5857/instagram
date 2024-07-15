import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../features/auth/user.model.js';
import env from '../config/env.js'


//Passport Integration
passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: 'https://f22a-49-36-80-78.ngrok-free.app/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });
          
          if (!user) {
            const newUser = new User({
              googleId: profile.id,
              userName: profile.displayName,
              email: profile.emails[0].value,
              profilePic: { _id: undefined, path: profile.photos[0].value },
              bio: null,
              contactNumber: null,
              DOB: null,
              gender: null,
              followers: [],
              following: [],
              posts: [],
              accountType: 'Public',
              role: 'User',
              otp: null,
              otpExpiry: null,
              isDelete: false,
              isAdmin: false,
              profilePics: [],
            });
            await newUser.save();
            return done(null, newUser);
          } else {
            user.googleId = profile.id;
            await user.save();
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, false, { message: 'Internal Server Error' });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userid, done) => {
  try {
    const user = await User.findById(userid);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
