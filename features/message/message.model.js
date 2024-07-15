import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    },
    fromUserId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
    },
    message: { 
      type: String, 
    },
    notRead: { 
      type: Boolean, 
      default: true 
    },
    type:{
      type: String,
      enum: ['User','Admin' ],
      default: 'User'
    },
    timestamp: {
     type: Date, 
     default: Date.now 
    },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
