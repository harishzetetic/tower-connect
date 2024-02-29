import { ISociety } from "@/Types";
import { BACKEND_URL } from "@/constants";
import { createParamsForInfoToast, getToken } from "@/util";
import axios from "axios";
import Swal from "sweetalert2";

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

export const commentOnPost = async(postId:string, comment: string) => {
    try{
        const token = getToken();
    return await axios.put(`${BACKEND_URL}/community/commentOnPost`, {postId, comment}, { headers: {"Authorization" : `Bearer ${token}`} });
    }
    catch(e){
        throw new Error('Getting Error while dislike this post');
    }
}