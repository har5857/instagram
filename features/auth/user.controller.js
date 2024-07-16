import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from './user.service.js';
import config from '../../config/env.js';
import path from 'path';
import { userRoles } from '../../config/enum.js';
import fs from 'fs';
// import path from 'path';
import {  
    accountType
} from '../../config/enum.js';
import { generateOtp } from '../../helper/otpGounrater.js';
import { sendEmail } from '../../helper/email.js';

const userService = new UserService();


class UserController {
    //Register user
    // static async registerUser(req, res) {
    //     try {
    //         let user = await userService.getUser({ email: req.body.email });
    //         if (user) {
    //             return res.status(400).json({ message: 'User is already registered.' });
    //         }
    
    //         if (req.files['profilePic'] && req.files['profilePic'].length > 1) {
    //             return res.status(400).json({ message: 'Only 1 file allowed for profilePic.' });
    //         }
    //         if (req.files['profilePics'] && (req.files['profilePics'].length < 2 || req.files['profilePics'].length > 5)) {
    //             return res.status(400).json({ message: 'Minimum 2 and maximum 5 files allowed for profilePics.' });
    //         }
    
    //         let hashPassword = await bcrypt.hash(req.body.password, 10);
    
    //         let role = userRoles.USER; 
    //     if (req.body.email === config.adminEmail) {
    //         role = userRoles.ADMIN;
    //     }
    //         let profilePic = null;
    //         let profilePics = [];
    //         const baseURL = `${req.protocol}://${req.get('host')}`;
    //         if (req.files['profilePic']) {
    //             profilePic = {
    //                 path: `${baseURL}/uploads/profile_picture/${req.files['profilePic'][0].filename}`
    //             };
    //         }
    //         if (req.files['profilePics']) {
    //             profilePics = req.files['profilePics'].map(file => ({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 path: `${baseURL}/uploads/profile_picture/${file.filename}`
    //             }));
    //         }
    //         user = await userService.addNewUser({
    //             ...req.body,
    //             password: hashPassword,
    //             role: role,
    //             profilePic: profilePic,
    //             profilePics: profilePics
    //         });
    
    //         const otp = generateOtp();

    //         user.otp = otp;
    //         user.otpExpiry = new Date(Date.now() + 1 * 60 * 1000); 
    //         await user.save();

    //         const resetUrl = 'http://localhost:5555/Otp-verification';
    //         const templateData = { user, otp };
    //         const subject = 'OTP Verification Request';
    //         const templateName = 'otp';
    
    //         await sendEmail(user.email, subject, templateName, templateData);
    
    //         res.status(201).json({ 
    //             success: true, 
    //             message: 'OTP sent to email.', 
    //            otp:otp
    //         });
    //     } catch (error) {
    //         console.error('Error registering user:', error);
    //         res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
    //     }
    // }

    //Login user with password
    // static async loginUser(req, res) {
    //     try {
    //         const { email, password } = req.body;
    //         let user = await userService.getUser({ email });
    //         if (!user) {
    //             return res.status(404).json({ message: 'Email Not Found' });
    //         }
    //         if (!user.otpVarified) {
    //             return res.status(403).json({ message: 'Please verify your OTP first.' });
    //         }
    //         const checkPassword = await bcrypt.compare(password, user.password);
    //         if (!checkPassword) {
    //             return res.status(400).json({ message: 'Password is not correct' });
    //         }
    //         const token = jwt.sign(
    //             { userId: user._id, email: user.email, role: user.role },
    //             config.jwtSecret
    //         );
    //         let userObj = user.toObject();
    //         user.isDelete = true;
    //         delete userObj.password;
    //         return res.status(200).json({ success: true, message: 'Login Successful', token, data: userObj });
    //     } catch (error) {
    //         console.error('Error in loginUser:', error);
    //         res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
    //     }
    // };

    //register user
    static async registerUser(req, res) {
        try {
            let user = await userService.getUser({ email: req.body.email });
            if (user) {
                return res.status(400).json({ message: 'User is Already Registered...' });
            }
            if (req.files['profilePic'] && req.files['profilePic'].length > 1) {
                return res.status(400).json({ message: 'Only 1 file allowed for profilePic.' });
            }
            if (req.files['profilePics'] && (req.files['profilePics'].length < 2 || req.files['profilePics'].length > 5)) {
            return res.status(400).json({ message: 'Minimum 2 and maximum 5 files allowed for profilePics.' });
            }
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            let role = 'User'; 
            if (req.body.email === config.adminEmail) {
                role = 'Admin';
            }
            let profilePic = null;
                    let profilePics = [];
                    const baseURL = `${req.protocol}://${req.get('host')}`;
                    if (req.files['profilePic']) {
                        profilePic = {
                            path: `${baseURL}/uploads/profile_picture/${req.files['profilePic'][0].filename}`
                        };
                    }
                    if (req.files['profilePics']) {
                        profilePics = req.files['profilePics'].map(file => ({
                            path: `${baseURL}/uploads/profile_picture/${file.filename}`
                        }));
                    }
                    user = await userService.addNewUser({
                        ...req.body,
                        password: hashPassword,
                        role: role,
                        profilePic: profilePic,
                        profilePics: profilePics
                    });
                    return res.status(200).json({ success:true, message: `User Register Succesfully`, user})
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    };
    
    //Login user with password
    static async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            
            let user = await userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'Email Not Found' });
            }
            
            if (user.isDelete) {
                return res.status(403).json({ message: 'Your account is inactive. Please contact admin.' });
            }
            
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Password is not correct' });
            }
            
            const otp = generateOtp();
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 1 * 60 * 1000); 
        
            await user.save();
            
            const resetUrl = 'http://localhost:5555/Otp-verification';
            const templateData = { user, otp };
            const subject = 'OTP Verification Request';
            const templateName = 'otp';
            
            await sendEmail(user.email, subject, templateName, templateData);
            
            return res.status(200).json({ success: true, message: 'OTP Sent Successfully', otp });
        } catch (error) {
            console.error('Error in loginUser:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
    
    //Resend otp
    static async resendOtp(req, res) {
        try {
            const { email } = req.body;
            let user = await userService.getUser({ email, isDelete: false });
            if (!user) {
                return res.status(404).json({ message: 'Email Not Found' });
            }
            const otp = generateOtp();
            user.otp = otp;
            user.otpExpiry = new Date(Date.now() + 1 * 60 * 1000); 
            await user.save();

            const resetUrl = 'http://localhost:5555/Otp-verification';
            const templateData = { user, otp };
            const subject = 'OTP Verification Request';
            const templateName = 'otp';
    
            await sendEmail(user.email, subject, templateName, templateData, resetUrl);
    
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
            user.otp = null;
            user.otpExpiry = null;
            user.otpVarified = true;
            await user.save();
            const token = jwt.sign({ userId: user._id, email: user.email }, config.jwtSecret); 
            let userObj = user.toObject();
            delete userObj.password;
            return res.status(200).json({ success: true, message: 'OTP Verified Successfully' ,token , data: userObj});
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
            const usersWithoutPassword = users.map(user => {
                const userObj = user.toObject();
                delete userObj.password;
                return userObj;
            });
            res.status(200).json({
                success: true,
                message: "User list retrieved Successfully",
                pagination: {
                    page,
                    totalPages,
                    totalUsers,
                    limit
                },
                
                data:  usersWithoutPassword
            });
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
            let profilePic;
            let profilePics = [];
            if (req.files && req.files['profilePic']) {
                if (req.files['profilePic'].length > 1) {
                    return res.status(400).json({ message: 'Only 1 file allowed for profilePic' });
                }
                profilePic = {

                    path:`${baseURL}/uploads/profile_picture/${req.files['profilePic'][0].filename}`
    
                };
            }
            if (req.files && req.files['profilePics']) {
                if (req.files['profilePics'].length < 2 || req.files['profilePics'].length > 5) {
                    return res.status(400).json({ message: 'Minimum 2 and maximum 5 files allowed for profilePics' });
                }
                profilePics = req.files['profilePics'].map(file => ({
                    path: `${baseURL}/uploads/profile_picture/${file.filename}`
                }));
            }
            updatedData.profilePic = profilePic;
            if (profilePics.length > 0) {
                updatedData.profilePics = profilePics;
            }
            user = await userService.updateUser(userId, updatedData);
            res.status(200).json({
                success: true,
                message: 'User Updated Successfully...',
                data: { user }
            });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    };

    //get user
    static async getUser(req, res) {
        try {
            const { userId } = req.params;
            const requestingUserId = req.user.id;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            if (!user.isDelete) {
                if (user.followers != requestingUserId && user.accountType === accountType.PRIVATE && userId !== requestingUserId) {
                    const limitedUserInfo = {
                        userName: user.userName,
                        profilePic: user.profilePic,
                        profilePics: user.profilePic,
                        bio: user.bio,
                        followersCount: user.followers.length,
                        followingCount: user.following.length,
                        postsCount: user.posts.length
                    };
                    return res.status(200).json({ success: true, message: 'User retrieved successfully', data: limitedUserInfo });
                } else {
                    let userObj = user.toObject();
                    delete userObj.password;
                    return res.status(200).json({ success: true, message: 'User retrieved successfully....', data: userObj });
                }
            } else {
                return res.status(404).json({ message: 'User not found...' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    }
    
    //delete user
    static async deleteUser(req, res) {
        try {
            const {userId} = req.params;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            user = await userService.updateUser(userId, { isDelete: true });
            user.save();
            res.status(200).json({ success: true  , message: 'User Deleted Successfully...'});
        } catch (error) {
            console.log(error);
            res.status(500).json({  success: false ,message: `Internal Server Error...${error.message}` });
        }
    };

    //active-deactive user
    static async activeDeactiveUser(req, res) {
        try {
            const { userId } = req.params;
            const { isDelete } = req.body;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            let updatedIsDelete;
            if (isDelete.toLowerCase() === 'active') {
                updatedIsDelete = false;
            } else if (isDelete.toLowerCase() === 'inactive') {
                updatedIsDelete = true;
            } else {
                return res.status(400).json({ message: 'Invalid isDelete value. Use "active" or "inactive".' });
            }
            user = await userService.updateUser(userId, { isDelete: updatedIsDelete });
            res.status(200).json({
                success: true,
                message: updatedIsDelete ? 'User Deactivated Successfully...' : 'User Activated Successfully...'
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
        }
    }
    
    //Remove ProfilePics 
    static async removeProfilePics(req, res) {
    try {
        const userId = req.user._id;
        const { pictureId } = req.params;
        let user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User Not Found' });
        }
        const profilePicsIndex = user.profilePics.findIndex(picture => picture._id.toString() === pictureId);
        if (profilePicsIndex === -1) {
            return res.status(404).json({ message: 'Profile picture not found' });
        }
        const picturePath = user.profilePics[profilePicsIndex].path;
        if (!picturePath) {
            return res.status(404).json({ message: 'Profile picture path not found' });
        }
        const relativePath = picturePath.replace(/^http:\/\/localhost:5555\/uploads\/profile_picture\//, '');
        const filePath = path.join('D:/instagram/uploads/profile_picture', relativePath);
        user.profilePics.splice(profilePicsIndex, 1);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
            } else {
                console.log('File deleted:', filePath);
            }
        });
        await user.save();
        let userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({ success: true, message: 'ProfilePics Deleted Successfully', data: userObj });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
    }
    };

    //Remove ProfilePic
    static async removeProfilePic(req, res) {
        try {
            const userId = req.user._id;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User Not Found' });
            }
            const profilePic = user.profilePic;
            if (profilePic && typeof profilePic.path === 'string') {
                const picturePath = profilePic.path;
                const relativePath = picturePath.replace(/^http:\/\/localhost:5555\/uploads\/profile_picture\//, '');
                const filePath = path.join('D:/instagram/uploads/profile_picture', relativePath);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error('Error deleting file:', err);
                    } else {
                        console.log('File deleted:', filePath);
                    }
                });
                user.profilePic = null;
            } else {
                console.warn('Profile picture path is not a valid string:', profilePic);
            }
            await user.save();
            let userObj = user.toObject();
            delete userObj.password;
            res.status(200).json({ success: true, message: 'ProfilePic Deleted Successfully', data: userObj });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
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
     static async forgotPassword(req, res) {
    const { email } = req.body;
    try {
        const user = await userService.getUser({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
        const resetLink = `http://localhost:5555/reset-password?token=${resetToken}`;
        const templateData = { userName: user.userName, resetUrl: resetLink };
        const subject = 'Password Reset Request';
        const templateName = 'resetpassword';
        await sendEmail(user.email, subject, templateName, templateData);

        console.log(`Password reset email sent to: ${email}`); 
        return res.status(200).json({ success: true, message: 'Password reset email sent', resetToken });
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
    static async searchUsers(req, res) {
        try {
            const { query, page, limit } = req.query;
            
            if (!query) {
                return res.status(400).json({ message: 'Query is required' });
            }
            
            const result = await userService.searchUsers(query, page, limit);
            
            res.status(200).json(result);
        } catch (error) {
            console.error('Error in searchUsers controller:', error);
            res.status(500).json({ success: false, message: `Internal Server Error: ${error.message}` });
        }
    };
     
  
}
export default UserController;
