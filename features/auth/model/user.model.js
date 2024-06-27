import mongoose from 'mongoose';
import { GENDER , userRoles } from '../../../config/enum.js';

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
    required: true,
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
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
posts: [{
   type: String,  
}],
  accountPrivate: {
    type: Boolean,
    default: false,
    select: false,
  },
  role: {
    type: String,
    enum: Object.values(userRoles),
    default: userRoles.USER,
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

