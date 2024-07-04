import PostService from '../post/post.service.js';
import CommentService from './comment.service.js';


class CommentController {

    static async addComment(req, res){
        const { postId } = req.params;
        const senderId = req.user._id;
        try {
            const comment = await PostService.getPost(postId);
            if(!postId){
                return ({success: false, message:` Post Not Found`});
            }
            const comments = await CommentService.addComment({
                user: req.user._id,
                post: postId,
                ...req.body
            })
            res.status(201).json({ success: true, message: 'Comment Added Successfully', data: comments });
        } catch (error) {
            console.error('Error  Add Like', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' }); 
        }
    }

}

export default CommentController;