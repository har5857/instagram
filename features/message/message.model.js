import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema ({

    user:{
        type:String
    },
    toNumber:{
        type:Number
    },
    fromNumber:{
        type: Number
    },
    notRead:{
        type:Boolean,
        default:true
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },

})

const Message = mongoose.model('message', messageSchema);

export default Message;