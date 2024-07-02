import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
    },
    caption: { 
        type: String,
        },
    postImage: {
         type: String,
        required: false 
    },
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    } ],
      comment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
    } ],
    createdAt: {
         type: Date, 
         default: Date.now 
        }
});

const Post = mongoose.model('Post', postSchema);

export default Post;