import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    user: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'User',
    },
    caption: { 
        type: String,
        },
    postImage: [{
         type: String,
        required: false 
    }],
    like: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    } ],
    comments: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
        },
    createdAt: {
         type: Date, 
         default: Date.now 
        }
});

const Post = mongoose.model('Post', postSchema);

export default Post;