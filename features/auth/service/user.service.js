import User from '../model/user.model.js'; 

class UserService {
    //add user
    async addNewUser(body) {
            return await User.create(body);
    }

    //get user
    async getUser(body) {
        return await User.findOne(body);
    }

    //get user by ID
    async getUserById(id) {
            return await User.findById(id);
        }

    //get all users
    async getAllUsers(filter, skip, limit) {
            const users = await User.find(filter).skip(skip).limit(limit);
            return { users, totalUsers: await User.countDocuments(filter) };
        }
    
    //count users
    async countUsers(filter) {
            return await User.countDocuments(filter);
    }

    //update user
    async updateUser(id, body) {
            return await User.findByIdAndUpdate(id, { $set: body }, { new: true });
    }
}

export default UserService;
