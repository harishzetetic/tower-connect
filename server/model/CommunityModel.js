
import mongoose from "mongoose";
import _ from "lodash";

const commentSchema = new mongoose.Schema({ user: {
    type: mongoose.Schema.Types.ObjectId, 
        ref: 'owners',
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const communitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'owners',
        required: true
    },
    society: {
        type: mongoose.Schema.Types.ObjectId, ref: 'societies',
        required: true
    },
    content: {
        type: String,
        required:true
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'owners',
    },
    dislikes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'owners',
    },
    comments: {
        type: [commentSchema],
    }
},{
    timestamps: {
      createdAt: 'created_at', // Use `created_at` to store the created date
      updatedAt: 'updated_at' // and `updated_at` to store the last updated date
    }
  }
);

const CommunityModel = mongoose.model('community', communitySchema);

export default CommunityModel;
