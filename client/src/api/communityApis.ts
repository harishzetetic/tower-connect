import { IPostComment } from "@/Types";
import { BACKEND_URL } from "@/constants";
import { getToken } from "@/util";
import axios, { AxiosResponse } from "axios";

export const dispatchPost = async(content: string) => {
    try{
        const token = getToken();
    return await axios.post(`${BACKEND_URL}/community/dispatchPost`, {content}, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while dispatch post');
    }
}

export const fetchCommunityPosts = async() => {
    try{
        const token = getToken();
        return await axios.get(`${BACKEND_URL}/community/fetchPosts`, { headers: {"Authorization" : `Bearer ${token}`} })
    } catch(e){
        throw new Error('Getting Error while fetching posts');
    }   
}

export const likeToggle = async(postId:string, isPostLiked: boolean) => {
    try{
        const token = getToken();
    return await axios.put(`${BACKEND_URL}/community/likeToggle`, {postId, isPostLiked}, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while like this post');
    }
}

export const dislikeToggle = async(postId:string, isPostDisLiked: boolean) => {
    try{
        const token = getToken();
    return await axios.put(`${BACKEND_URL}/community/dislikeToggle`, {postId, isPostDisLiked}, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while dislike this post');
    }
}

export const updatePost = async(postId:string, updatedContent: string) => {
    try{
        const token = getToken();
    return await axios.put(`${BACKEND_URL}/community/updatePost`, {postId, updatedContent}, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while update this post');
    }
}

export const deletePost = async(postId:string) => {
    try{
        const token = getToken();
    return await axios.delete(`${BACKEND_URL}/community/deletePost/${postId}`, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while dislike this post');
    }
}

export const commentOnPost = async(postId:string, comment: string) => {
    try{
        const token = getToken();
    return await axios.put(`${BACKEND_URL}/community/commentOnPost`, {postId, comment}, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while dislike this post');
    }
}

export const deleteComment = async(postId:string, commentId: string) => {
    try{
        const token = getToken();
    return await axios.put(`${BACKEND_URL}/community/deleteComment`, {postId, commentId}, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while dislike this post');
    }
}

export const fetchPostComments = async(postId:string):Promise<AxiosResponse<IPostComment[]>> => {
    try{
        const token = getToken();
        return await axios.get(`${BACKEND_URL}/community/fetchPostComments/${postId}`, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while dislike this post');
    }
}