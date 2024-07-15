import mongoose from "mongoose";
import { accountType, gender, userRoles } from "../../config/enum.js";
import { request } from "http";


const userSchema = new mongoose.Schema(
  {
    userName: {
       type: String, 
       require: true 
      },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
    },
    profilePic: {
      path: String,
    },
    profilePics: [
      {
        path: String
      }
    ],
    bio: {
      type: String,
      default: null,
    },
    contactNumber: {
      type: Number,
      require: true,
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
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: String,
      },
    ],
    accountType: {
      type: String,
      enum: Object.values(accountType),
      default: accountType.PUBLIC,
    },
    role: {
      type: String,
      enum: Object.values(userRoles),
      default: userRoles.USER,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    otpVarified: {
      type: Boolean,
      default: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
