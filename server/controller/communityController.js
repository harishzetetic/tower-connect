import { jwtDecode } from "jwt-decode";
import CommunityModel from "../model/CommunityModel.js";
import { getSecureUserDetails } from "../util.js";

export const dispatchPost = async(request, response)=>{
    try{
        const authHeader = request.headers['authorization'];
        const token = authHeader.substring(7, authHeader.length);
        const {user, societyId} = jwtDecode(token)
        const newPost = await new CommunityModel({
            user,
            society: societyId,
            content: request.body.content,
            likes: [],
            dislikes: [],
            comments: [],
        })
        await newPost.save();
        return response.status(200).json(newPost)

    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const fetchPosts = async (request, response) => {
    try{
        const authHeader = request.headers['authorization'];
        const token = authHeader.substring(7, authHeader.length);
        const {societyId} = jwtDecode(token);
        const limit = 30;
        const { page = 1} = request.query;
        const result = await CommunityModel.find({society: societyId}).populate(getSecureUserDetails('user')).populate('society').sort({updated_at: -1}).limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
        const totalPosts = await CommunityModel.countDocuments()
        return response.status(200).json({result, totalPages: Math.ceil(totalPosts / limit),
        currentPage: Number(page)})
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const likeToggle = async (request, response) => {
    try{
       const authHeader = request.headers['authorization'];
       const token = authHeader.substring(7, authHeader.length);
       const {user} = jwtDecode(token)
       const {postId, isPostLiked} = request.body;
       const query = isPostLiked ? { "$push": { likes: user }, "$pull": { dislikes: user } } : { "$pull": { likes: user } } 
       const updatedRecord = await CommunityModel.findOneAndUpdate({_id: postId}, query, { new: true }).populate('user').populate('society');
       return response.status(200).json(updatedRecord)

    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const dislikeToggle = async (request, response) => {
    try{
        const authHeader = request.headers['authorization'];
       const token = authHeader.substring(7, authHeader.length);
       const {user} = jwtDecode(token)
       const {postId, isPostDisLiked} = request.body;
       const query = isPostDisLiked ? { "$push": { dislikes: user }, "$pull": { likes: user } } : { "$pull": { dislikes: user } } 
       const updatedRecord = await CommunityModel.findOneAndUpdate({_id: postId}, query, { new: true }).populate('user').populate('society');
       return response.status(200).json(updatedRecord)
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const updatePost = async (request, response) => {
    try{
       const {postId, updatedContent} = request.body;
       const updatedRecord = await CommunityModel.findOneAndUpdate({_id: postId}, {$set: {content: updatedContent}}, { new: true }).populate('user').populate('society');
       return response.status(200).json(updatedRecord)
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const commentOnPost = async (request, response) => {
    try{
        const authHeader = request.headers['authorization'];
       const token = authHeader.substring(7, authHeader.length);
       const {user} = jwtDecode(token)
       const {postId, comment} = request.body;
       // const query = isPostDisLiked ? { "$push": { dislikes: user }, "$pull": { likes: user } } : { "$pull": { dislikes: user } } 
       const updatedRecord = await CommunityModel.findOneAndUpdate({_id: postId}, {$push: {comments: {user, content: comment}}}, { new: true }).populate(getSecureUserDetails('comments.user')).populate(getSecureUserDetails('user')).populate('society');
       return response.status(200).json(updatedRecord)
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const deleteComment = async (request, response) => {
    try{
       const {postId, commentId} = request.body;
       const confirmation = await CommunityModel.updateOne({_id: postId}, {$pull: {comments: {_id: commentId}}}).populate(getSecureUserDetails('comments.user')).populate(getSecureUserDetails('user')).populate('society');
       return response.status(200).json(confirmation)
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const editComment = async (request, response) => {
    try{
       const {postId, commentId, updatedContent} = request.body;
       const confirmation = await CommunityModel.updateOne({ _id: postId, "comments._id": commentId }, { $set: { "comments.$.content": updatedContent } }).populate(getSecureUserDetails('comments.user')).populate(getSecureUserDetails('user')).populate('society');
       return response.status(200).json(confirmation)
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const fetchPostComments = async (request, response) => {
    try{
       const {postId} = request.params;
       const postComments = await CommunityModel.findOne({_id: postId}, 'comments').populate(getSecureUserDetails('comments.user'));
       if(postComments?.comments){
        return response.status(200).json(postComments.comments)
       }
       return response.status(200).json([])
       
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const deletePost = async (request, response) => {
    try{
       const {postId} = request.params;
       await CommunityModel.deleteOne({_id: postId});
       return response.status(200).json({message: 'success'})
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}


