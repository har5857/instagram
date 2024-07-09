
import CommentService from './comment.service.js';
import Post from '../post/post.model.js';


class CommentController {
    static async addComment(req, res) {
        const { postId } = req.params;
        const senderId = req.user._id;

        try {
            const post = await Post.findById(postId);
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post Not Found' });
            }
            const comment = await CommentService.addComment({
                user: req.user._id,
                post: postId,
                ...req.body
            });
            if (!post.comments) {
                post.comments = [];
            }
            post.comments.push(senderId);
            await post.save();
            res.status(201).json({ success: true, message: 'Comment Added Successfully', data: comment });
        } catch (error) {
            console.error('Error Adding Comment', error);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }

    //update Comment
    static async updateComment(req , res){
        try {
            const { commentId } = req.params;
            let comment = await CommentService.getComment(commentId);
            if(!comment){
                return res.status(404).json({ message : `Comment Not Found...`});
            }
            const updateData = { ...req.body };
            comment = await CommentService.updateComment(commentId , updateData);
            res.status(200).json({
                success: true,
                message: `Comment Updated Successfully..`,
                data:{
                    updateData
                }
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: `Internal Server Error...${error.message}` });
        }
    }

}

export default CommentController;