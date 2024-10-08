import PostService from "./post.service.js";
const postService = new PostService();
import NotificationService from "../notification/notification.service.js";
const notificationService = new NotificationService();

class PostController {
  //uploads posts
  static async uploadPost(req, res) {
    try {
      const { caption } = req.body;
      let postImage = null;
      let postImages = [];
      const baseURL = `${req.protocol}://${req.get("host")}`;
      if (req.files["postImage"] && req.files["postImage"].length > 1) {
        return res
          .status(400)
          .json({ message: "Only 1 file allowed for postImage." });
      }
      if (req.files["postImage"]) {
        postImage = {
          path: `${baseURL}/uploads/post/${req.files["postImage"][0].filename}`,
        };
      }
      if (req.files["postImages"]) {
        postImages = req.files["postImages"].map((file) => ({
          path: `${baseURL}/uploads/profile_picture/${file.filename}`,
        }));
      }
      const post = await PostService.addNewPost({
        user: req.user._id,
        caption,
        postImage: postImage,
        postImages: postImages,
        ...req.body,
      });
      res
        .status(201)
        .json({
          success: true,
          message: "Post uploaded successfully",
          data: post,
        });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          success: false,
          message: `Internal Server Error...${error.message}`,
        });
    }
  }

  //update-post
  static async updatePost(req, res) {
    try {
      const { postId } = req.params;
      let post = await PostService.getPost(postId);
      if (!post) {
        return res.status(404).json({ message: `Post Not Found....` });
      }
      const updateData = { ...req.body };
      post = await PostService.updatePost(postId, updateData);
      res.status(200).json({
        success: true,
        message: "post Updated Successfully...",
        data: {
          post,
        },
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({
          success: false,
          message: `Internal Server Error...${error.message}`,
        });
    }
  }

  //get post
  static async getPost(req, res) {
    const { postId } = req.params;
    try {
      const result = await PostService.getPost(postId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      res
        .status(200)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      console.error("Error Fetching post", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  //get all posts
  static async getAllPosts(req, res) {
    const userId = req.user._id;
    try {
      const result = await PostService.getAllPosts(userId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      res
        .status(200)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      console.error("Error Fetching All post", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  //delete posts
  static async deletePost(req, res) {
    const { postId } = req.params;
    try {
      const result = await PostService.deletePost(postId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      res
        .status(200)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      console.error("Error Deleting post", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  //add like
  static async addLike(req, res) {
    const { postId } = req.params;
    const userId = req.user._id;
    try {
      const result = await PostService.addLike(postId, userId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      const Notification = await notificationService.sendPostLikeNotification(
        userId
      );
      res
        .status(200)
        .json({
          success: true,
          message: result.message,
          data: result.data,
          Notification,
        });
    } catch (error) {
      console.error("Error  Add Like", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  //remove like
  static async removeLike(req, res) {
    const { postId } = req.params;
    const userId = req.user.Id;
    try {
      const result = await PostService.removeLike(postId, userId);
      if (!result.success) {
        return res
          .status(400)
          .json({ success: false, message: result.message });
      }
      res
        .status(200)
        .json({ success: true, message: result.message, data: result.data });
    } catch (error) {
      console.error("Error Remove Like", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
}

export default PostController;
