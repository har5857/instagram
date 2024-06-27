import User from '../model/user.model.js'; 

class UserService {
    async addNewUser(body) {
        try {
            return await User.create(body);
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    async getUser(body) {
        try {
            return await User.findOne(body);
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    }

    async getUserById(id) {
        try {
            return await User.findById(id);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    // async getAllUsers(query) {
    //     try {
    //         return await User.find(query);
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // }

    async getAllUsers(filter, skip, limit) {
        try {
            const users = await User.find(filter).skip(skip).limit(limit);
            return { users, totalUsers: await User.countDocuments(filter) };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async countUsers(filter) {
        try {
            return await User.countDocuments(filter);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

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
