
import mongoose from "mongoose";
import _ from "lodash";

const chatSchema = new mongoose.Schema({
    chatName: {type: String, trim:true},
    isGroupChat: {type: Boolean, default: false},
    users:[{
        type: mongoose.Schema.ObjectId,
        ref: 'owners'
    }],
    latestMessage: {
        type: mongoose.Schema.ObjectId,
        ref: 'message'
    },
    groupAdmin: {
        type: mongoose.Schema.ObjectId,
        ref: 'owners'
    }
},{
    timestamps: true
  }
);

const ChatModel = mongoose.model('chat', chatSchema);

export default ChatModel;
