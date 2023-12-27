
import mongoose from "mongoose";
import _ from "lodash";

const messageSchema = new mongoose.Schema({
    sender: {type: mongoose.Schema.Types.ObjectId, ref: 'owners'},
    content: {type: String, trim: true},
    chat: {type: mongoose.Schema.Types.ObjectId, ref: 'chat'}
},{
    timestamps: true
  }
);

const MessageModel = mongoose.model('message', messageSchema);

export default MessageModel;
