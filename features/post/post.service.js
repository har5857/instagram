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
            const post = await Post.findById(postId);
            return post; 
        } catch (error) {
            console.error('Error fetching post:', error);
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

    //update Post
    static async updatePost(id, body) {
        try {
          console.log('Updating post with data:', body);
          return await Post.findByIdAndUpdate(id, { $set: body }, { new: true });
        } catch (error) {
          console.error('Error updating user:', error.message);
          throw error;
        }
    }

    //add Like
    static async addLike( postId , userId ){
        try {
            const post = await Post.findById({_id: postId});
            if(!post){
                return { success: false , message: `post not found`};
            }
            if(!post.like.includes(userId)){
                post.like.push(userId);
                
                await post.save();
                return { success: true, message: `Add like succesfully`, data: post};
            }else{
                return{ success: false, message:`Alredy like in this post`};
            }
        } catch (error) {
            console.error('Error Add Like:', error.message);
            throw error;
        }
    }

    //Remove Like
    static async removeLike(postId , userId){
        try {
            const post = await Post.findById({_id: postId});
            if(!post){
                return {success: false , message: `post not Found`};
            }else{
                post.like.splice(post.like.indexOf(userId),1);
                await post.save();
                return{ success: true , message:`Remove Like Successfully`, data: post};
            }
        } catch (error) {
            console.error('Error Remove Like:', error.message);
            throw error;
        }
    }
}   

export default PostService;