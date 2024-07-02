import Post from './post.model.js';

class PostService {
    //add new post
    static async addNewPost(postData) {
        try {
            const post = new Post(postData);
            await post.save();
            return post;
        } catch (error) {
            throw new Error(`Unable to save post: ${error.message}`);
        }
    }

    //get post
    static async getPost(postId) {
        try {
            const post = await Post.find({ _id:postId});
            if (!post) {
                throw new Error('Post not found');
            }
            return { success: true, message:'post frtced successfully', data:post };
        } catch (error) {
            console.error('Error fetching posts:', error.message);
            throw error;
        }
    }

    //get all posts
    static async getAllPosts(userId) {
        try {
            const posts = await Post.find({ user:userId});
            return { success: true, message:'posts fetched successfully', data:posts };
        } catch (error) {
            console.error('Error fetching posts:', error.message);
            throw error;
        }
    }

    //delete post
    static async deletePost(postId) {
        try {
            const post = await Post.findOneAndDelete({ _id:postId});
            if (!post) {
                throw new Error('Post not found');
            }
            return { success: true, message:'post deleted successfully', data:post };
        } catch (error) {
            console.error('Error deleting post:', error.message);
            throw error;
        }
    }
}   

export default PostService;