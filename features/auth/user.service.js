import User from "./user.model.js";

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
    try {
      const user = await User.findById(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found.`);
      }
      return user;
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }

  //get-user-by-email
  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  async getPictureById(pictureId) {
    return await User.findById(pictureId);
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
    try {
      console.log("Updating user with data:", body);
      return await User.findByIdAndUpdate(id, { $set: body }, { new: true });
    } catch (error) {
      console.error("Error updating user:", error.message);
      throw error;
    }
  }

  //update user role
  async updateUserRole(userId, role) {
    return await User.findByIdAndUpdate(userId, { role: role }, { new: true });
  }

  //Delete Single Picture
  async removePicture(pictureId) {
    return await User.findByIdAndDelete(pictureId);
  }

  // search user
  async searchUsers(query, page, limit) {
    const skip = (page - 1) * limit;
    const usersQuery = User.find({
      $or: [
        { userName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { bio: new RegExp(query, "i") },
        { accountType: new RegExp(query, "i") },
      ],
    })
      .skip(skip)
      .limit(parseInt(limit));

    const users = await usersQuery.exec();
    const totalUsers = await User.countDocuments({
      $or: [
        { userName: new RegExp(query, "i") },
        { email: new RegExp(query, "i") },
        { bio: new RegExp(query, "i") },
        { accountType: new RegExp(query, "i") },
      ],
    });
    const totalPages = Math.ceil(totalUsers / limit);

    return {
      success: true,
      message: "Users retrieved Successfully",
      pagination: {
        page,
        totalPages,
        totalUsers,
        limit,
      },
      data: users,
    };
  }
}

export default UserService;
