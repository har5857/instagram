import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
    //   required: true
    },
  fromUser: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
    //   required: true 
    },
  content: { 
      type: String, 
    //   required: true 
    },
  notRead: { 
      type: Boolean, 
      default: true 
    },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
