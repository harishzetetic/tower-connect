import { jwtDecode } from "jwt-decode";
import CommunityModel from "../model/CommunityModel.js";

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
        const {user, societyId} = jwtDecode(token)
        const result = await CommunityModel.find({society: societyId}).populate('user').populate('society').sort({updated_at: -1});
        return response.status(200).json(result)
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

//likeToggle, dislikeToggle