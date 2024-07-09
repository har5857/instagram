import Comment from './comment.model.js';

class CommentService{

    //Add Comment
    static async addComment(commentData,userId){
       try {
            const comment = new Comment(commentData)
            await comment.save();
            return comment;
       } catch (error) {
        throw new Error(`Unable to Add Comment: ${error.message}`);
       }
    }

    //Get Comment
    static async getComment(commentId) {
        try {
            const comment = await Comment.find({ _id: commentId});
            if (!comment) {
                throw new Error('Comment not found');
            }
            return { success: true, message:'Comment frtced successfully', data:comment };
        } catch (error) {
            console.error('Error fetching Comments :', error.message);
            throw error;
        }
    }

    //Update Comment
    static async updateComment(id, body) {
        try {
          console.log('Updating Comment with data:', body);
          return await Comment.findByIdAndUpdate(id, { $set: body }, { new: true });
        } catch (error) {
          console.error('Error updating Comment:', error.message);
          throw error;
        }
    }

    //Delete Comment

    

}

export default CommentService;