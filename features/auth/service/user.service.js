import User from '../model/user.model.js'; 

class UserService {
    //add user
    async addNewUser(body) {
        try {
            return await User.create(body);
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    //get user
    async getUser(body) {
        try {
            return await User.findOne(body);
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    //get user by ID
    async getUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //get all users
    async getAllUsers(filter, skip, limit) {
        try {
            const users = await User.find(filter).skip(skip).limit(limit);
            return { users, totalUsers: await User.countDocuments(filter) };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    //count users
    async countUsers(filter) {
        try {
            return await User.countDocuments(filter);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    //update user
    async updateUser(id, body) {
        try {
            return await User.findByIdAndUpdate(id, { $set: body }, { new: true });
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default UserService;
