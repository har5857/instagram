import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import UserService from '../service/user.service.js';
import config from '../../../config/env.js';
import { sendResetEmail } from '../../../helper/email.js';


const userService = new UserService();

class UserController {
    static async registerUser(req, res) {
        try {
            let user = await userService.getUser({ email: req.body.email });
            if (user) {
                return res.status(400).json({ message: 'User is Already Registered...' });
            }
            let hashPassword = await bcrypt.hash(req.body.password, 10);
            user = await userService.addNewUser({
                ...req.body,
                password: hashPassword,
            });
            res.status(201).json({ user: user, message: 'New User Is Added Successfully...' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error...${error.message}` });
        }
    }

    static async loginUser(req, res) {
        try {
            let user = await userService.getUser({ email: req.body.email, isDelete: false });
            if (!user) {
                return res.status(404).json({ message: 'Email Not Found' });
            }
            let checkPassword = await bcrypt.compare(req.body.password, user.password);
            if (!checkPassword) {
                return res.status(400).json({ message: 'Password is not match...' });
            }
            let token = jwt.sign({ userId: user._id }, config.jwtSecret);
            res.status(200).json({ token, message: 'Login Successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error...${error.message}` });
        }
    }

    
    // static async getAllUser(req, res) {
    //     try {
    //         let userList = await userService.getAllUsers({ isDelete: false });
    //         res.status(200).json(userList);
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ message: `Internal Server Error...${error.message}` });
    //     }
    // }

    static async getAllUser(req, res) {
        try {
             const page = parseInt(req.query.page) ;
             const limit = parseInt(req.query.limit) ;
             const { users, totalUsers } = await userService.getAllUsers({ isDelete: false }, page, limit);
            res.status(200).json({
                users,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page
            });
         } catch (error) {
             console.log(error);
             res.status(500).json({ message: `Internal Server Error...${error.message}` });
         }
    }

    static async getUser(req, res) {
        try {
            const userId = req.params.userId;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            res.status(200).json(user);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error...${error.message}` });
        }
    }

    static async updateUser(req, res) {
        try {
            const userId = req.params.userId;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User Not Found...' });
            }
            user = await userService.updateUser(userId, { ...req.body });
            res.status(200).json({ user, message: 'User Updated Successfully...' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error...${error.message}` });
        }
    }

    static async deleteUser(req, res) {
        try {
            const userId = req.params.userId;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            user = await userService.updateUser(userId, { isDelete: true });
            res.status(200).json({ user, message: 'User Deleted Successfully...' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error...${error.message}` });
        }
    }

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
            res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: `Internal Server Error...${error.message}` });
        }
    }

    static  async forgotPassword (req, res){
        const { email } = req.body;
    
        try {
            const user = await userService.getUser({ email });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
    
            const resetToken = crypto.randomBytes(20).toString('hex');
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = Date.now() + 3600000;
            await user.save();
    
            await sendResetEmail(email, resetToken);
            res.status(200).json({ message: 'Password reset email sent', resetToken });
        } catch (error) {
            console.error('Error sending password reset email:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    // static async resetPassword(req, res){
    //     const { token, newPassword } = req.body;
    
    //     try {
    //         const decoded = jwt.verify(token, 'user');
    //         const user = await userService.getUserById(decoded.userId);
    //         if (!user) {
    //             return res.status(404).json({ message: 'User not found.' });
    //         }
    //         if (Date.now() > user.resetPasswordExpires) {
    //             return res.status(400).json({ message: 'Token expired. Please try again.' });
    //         }
    //         user.password = await bcrypt.hash(newPassword, 10);
    //         user.resetPasswordToken = undefined;
    //         user.resetPasswordExpires = undefined;
    //         await user.save();
    
    //         res.status(200).json({ message: 'Password reset successfully.' });
    //     } catch (error) {
    //         console.error('Error resetting password:', error);
    //         res.status(500).json({ message: 'Internal Server Error.' });
    //     }
    // };
    
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
    
            res.status(200).json({ message: 'Password reset successfully.' });
        } catch (error) {
            console.error('Error resetting password:', error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(400).json({ message: 'Invalid token.' });
            }
            res.status(500).json({ message: 'Internal Server Error.' });
        }
    };

}

export default UserController;
