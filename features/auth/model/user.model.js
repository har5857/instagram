import mongoose from 'mongoose';
import { GENDER } from '../../../config/enum.js';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePicture: {
    type: String,
  },
  bio: {
    type: String,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  DOB: {
    type: Date,
  },
  gender: {
    type: String,
    enum: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
  posts: {
    type: Number,
    default: 0,
  },
  accountPrivate: {
    type: Boolean,
    default: false,
    select: false,
  },
  isDelete: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
}, {
  versionKey: false,
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;
