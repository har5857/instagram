import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from './user.service.js';
import config from '../../config/env.js';
import { sendResetEmail , sendOtp } from '../../helper/email.js';
import { userRoles } from '../../config/enum.js';
import {  
    accountType
} from '../../config/enum.js';

const userService = new UserService();

class UserController {
    //Register user
    static async registerUser(req, res) {
        try {
            let user = await userService.getUser({ email: req.body.email });
            if (user) {
                return res.status(400).json({ message: 'User is Already Registered...' });
            }
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            let role = 'User'; 
            if (req.body.email === config.adminEmail) {
                role = 'Admin';
            }
            let profilePicture = { single: null, multiple: [] };
            const baseURL = `${req.protocol}://${req.get('host')}`;
            if (req.files && req.files.length > 0) {
                if (req.files.length === 1) {
                    profilePicture.single = `${baseURL}/uploads/profile_picture/${req.files[0].filename}`;
                } else {
                    profilePicture.multiple = req.files.map(file => `${baseURL}/uploads/profile_picture/${file.filename}`);
                }
            }
            user = await userService.addNewUser({
                ...req.body,
                password: hashPassword,
                role: role,
                profilePicture: profilePicture,
            });
            console.log('User registered successfully:', user);
            res.status(201).json({ 
                success: true, 
                message: 'New User Is Added Successfully...', 
                data: { user } 
            });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    };
    
    //Login user with password
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            let user = await userService.getUser({ email, isDelete: false });
            if (!user) {
                return res.status(404).json({ message: 'Email Not Found' });
            }
            const checkPassword = await bcrypt.compare(password, user.password);
            if (!checkPassword) {
                return res.status(400).json({ message: 'Password is not correct' });
            }
            const otp = await sendOtp(email, user);
    
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 1 * 60 * 1000); 
            await user.save();
    
            console.log(`Storing OTP for email: ${email} | OTP: ${otp}`); 
            return res.status(200).json({ success: true, message: 'OTP Sent Successfully', otp });
        } catch (error) {
            console.error('Error in loginUser:', error);
            res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
        }
    };

    //Resend otp
    static async resendOtp(req, res) {
        try {
            const { email } = req.body;
            let user = await userService.getUser({ email, isDelete: false });
            if (!user) {
                return res.status(404).json({ message: 'Email Not Found' });
            }
            const otp = await sendOtp(email, user);
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 1 * 60 * 1000); 
            await user.save();
    
            console.log(`Resent OTP for email: ${email} | New OTP: ${otp}`); 
            return res.status(200).json({ success: true, message: 'New OTP Sent Successfully', otp });
        } catch (error) {
            console.error('Error in resendOtp:', error);
            res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
        }
    };
    
    //verify-otp
    static async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            let user = await userService.getUser({ email, isDelete: false });
            if (!user) {
                return res.status(404).json({ message: 'Email Not Found' });
            }
            if (user.otp !== otp || new Date() > user.otpExpiry) {
                return res.status(400).json({ message: 'OTP is incorrect or expired' });
            }
            const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, config.jwtSecret);
            user.otp = null;
            user.otpExpiry = null;
            await user.save();
            return res.status(200).json({ success: true, token ,data: user});
        } catch (error) {
            console.error('Error in verifyOtp:', error);
            res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
        }
    };
    
    //get all users
    static async getAllUser(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
            const { users, totalUsers } = await userService.getAllUsers({ isDelete: false }, skip, limit);
            const totalPages = Math.ceil(totalUsers / limit);
    
            res.status(200).json({
                success: true,
                message: "User list retrieved Successfully",
                pagination: {
                    page,
                    totalPages,
                    totalUsers,
                    limit
                },
                data:  users
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    };
    
    //get user information
    static async getUser(req, res) {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user.id;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            if (user.followers != requestingUserId && user.accountType === accountType.PRIVATE && userId !== requestingUserId){
                const limitedUserInfo = {
                    userName: user.userName,
                    profilePicture: user.profilePicture,
                    bio: user.bio,
                    followersCount: user.followers.length,
                    followingCount: user.following.length,
                    postsCount: user.posts.length
                };
                return res.status(200).json({ success: true, message: 'User retrieved successfully', data: limitedUserInfo });
            } else {
                return res.status(200).json({ success: true, message: 'User retrieved successfully....', data: user });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    };

    //update user information
    static async updateUser(req, res) {
        try {
            const { userId } = req.params;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User Not Found...' });
            }
    
            const updatedData = { ...req.body };
            const baseURL = `${req.protocol}://${req.get('host')}`;
            let profilePicture = { single: null, multiple: [] };
    
            if (req.files && req.files.length > 0) {
                if (req.files.length === 1) {
                    profilePicture.single = `${baseURL}/uploads/profile_picture/${req.files[0].filename}`;
                    updatedData.profilePicture = profilePicture;
                } else {
                    profilePicture.multiple = req.files.map(file => `${baseURL}/uploads/profile_picture/${file.filename}`);
                    updatedData.profilePicture = profilePicture;
                }
                console.log('Accessible Paths:', profilePicture.single || profilePicture.multiple);
            }
    
            user = await userService.updateUser(userId, updatedData);
            res.status(200).json({
                success: true,
                message: 'User Updated Successfully...',
                data: {
                    user
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    };
    
    //delete user
    static async deleteUser(req, res) {
        try {
            const {userId} = req.params;
            let user = await userService.find(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            user = await UserService.updateUser(userId, { isDelete: true });
            res.status(200).json({ success: true  , message: 'User Deleted Successfully...' , data:user});
        } catch (error) {
            console.log(error);
            res.status(500).json({  success: false ,message: `Internal Server Error...${error.message}` });
        }
    };

    //change user password
    static async changePassword(req, res) {
        try {
            const userId = req.user._id;
            const { currentPassword, newPassword } = req.body;
            const user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            await userService.updateUser(userId, { password: hashedNewPassword });
            res.status(200).json({ success: true ,message: 'Password changed successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false , message: `Internal Server Error...${error.message}` });
        }
    };

    //reset user password
    static async forgotPassword(req, res){
        const { email } = req.body;
        try {
            const user = await userService.getUser({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            const resetToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000;
            await user.save();
            await sendResetEmail(email, resetToken, user);
            res.status(200).json({ success: true, message: 'Password reset email sent', resetToken });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    };

    //reset user password
    static  async resetPassword(req, res) {
        const { token, newPassword } = req.body;
        try {
            console.log('Token received:', token); 
            const decoded = jwt.verify(token, config.jwtSecret);
            console.log('Decoded token:', decoded); 
            const user = await userService.getUserById(decoded.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            if (Date.now() > user.resetPasswordExpires) {
                return res.status(400).json({ message: 'Token expired. Please try again.' });
            }
            user.password = await bcrypt.hash(newPassword, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            res.status(200).json({success: true, message: 'Password reset successfully.' });
        } catch (error) {
            console.error('Error resetting password:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({ message: 'Invalid token.' });
            }
            res.status(500).json({ success: false ,message: 'Internal Server Error.' });
        }
    };

    //Assign-user-role
     static async assignUserRole(req, res) {
       try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!Object.values(userRoles).includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role specified' });
        }
        const updatedUser = await userService.updateUserRole(userId, role);
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User role updated successfully', data: updatedUser });
    } catch (error) {
        console.error('Error assigning user role:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    };

    //Search user
    static async searchUsers(req, res){
    try {
        const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required'});
    }
    const users = await userService.getUser({
      $or: [
        { userName: new RegExp(query, 'i') },
        { email: new RegExp(query, 'i') },
        { bio: new RegExp(query, 'i') },
        { accountType: new RegExp(query, 'i')}
      ]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
    };
    

}
export default UserController;
