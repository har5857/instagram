import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../service/user.service.js';
import config from '../../../config/env.js';

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
}

export default UserController;
