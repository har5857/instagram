import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../features/auth/user.model.js";
import jwt from "jsonwebtoken";
import env from "../config/env.js";

// dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: env.google.clientId,
      clientSecret: env.google.clientSecret,
      callbackURL: "http://localhost:5555/auth/google/callback",
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
              accountType: "Public",
              role: "User",
              otp: null,
              otpExpiry: null,
              isDelete: false,
              isAdmin: false,
              profilePics: [],
            });
            await newUser.save();
            user = newUser;
          } else {
            user.googleId = profile.id;
            await user.save();
          }
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET
        );

        done(null, user, token);
      } catch (err) {
        done(err, false, { message: "Internal Server Error" });
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
