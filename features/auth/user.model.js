import mongoose from 'mongoose';
import { accountType, gender , userRoles } from '../../config/enum.js';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    default: null,
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
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  contactNumber: {
    type: Number,
    required: true,
  },
  DOB: {
    type: Date,
    default: null,
  },
  gender: {
    type: String,
    enum: Object.values(gender),
    default: null,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
} ],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
} ],
  posts: [{
   type: String,  
} ],
  accountType: {
    type : String,
    enum: Object.values(accountType),
    default : accountType.PUBLIC
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

