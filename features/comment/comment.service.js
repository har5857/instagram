import PostService from '../post/post.service.js';
import Comment from './comment.model.js';
// import PostService from '../post/post.service.js';
// import Post from '../post/post.model.js';
// const postService = new PostService();

class CommentService{

    static async addComment(commentData,userId){
       try {
            const comment = new Comment(commentData)
            await comment.save();
            return comment;
       } catch (error) {
        throw new Error(`Unable to Add Comment: ${error.message}`);
       }
    }

}

export default CommentService;