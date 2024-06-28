import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
            let role = 'USER'; 
            if (req.body.email === config.adminEmail){
                role = 'ADMIN';
            }
            user = await userService.addNewUser({
                ...req.body,
                password: hashPassword,
                role: role, 
            });
            res.status(201).json({ success: true, message: 'New User Is Added Successfully...', data: user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    }
    
    //Login user with password
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
            res.status(200).json({ success: true, message: 'Login Successfully',token});
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false ,message: `Internal Server Error...${error.message}` });
        }
    }

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
    }
    
    //get user information
    static async getUser(req, res) {
        try {
            const {userId} = req.params;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found...' });
            }
            res.status(200).json({success: true,message : 'User get Successfully' , data:user});
        } catch (error) {
            console.log(error);
            res.status(500).json({success: false, message: `Internal Server Error...${error.message}` });
        }
    }

    //update user information
    static async updateUser(req, res) {
        try {
            const {userId} = req.params;
            let user = await userService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User Not Found...' });
            }
            user = await userService.updateUser(userId, { ...req.body });
            res.status(200).json({success: true , message: 'User Updated Successfully...', data:user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false ,message: `Internal Server Error...${error.message}` });
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
            res.status(200).json({ success: true  , message: 'User Deleted Successfully...' , data:user});
        } catch (error) {
            console.log(error);
            res.status(500).json({  success: false ,message: `Internal Server Error...${error.message}` });
        }
    }

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
    }

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

}

export default UserController;
