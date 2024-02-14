
import {  IMessage, IOwnerLoginData } from "@/Types";
import { BACKEND_URL, CHAT_MESSAGES_PER_SCROLL } from "@/constants";
import { createParamsForInfoToast, getToken } from "@/util";
import axios from "axios";
import Swal from "sweetalert2";

/*
PUT is best used when you are updating or replacing existing data on the server, 
POST is best used when you are creating new data. 
*/

  axios.interceptors.response.use(response => response, error => {
    if (error.response.status == 401 || error.response?.data?.isTokenValid === false) {
        sessionStorage.removeItem('token');
        Swal.fire({
           title: 'Invalid Token',
           text: `Your token has been invalid or deleted. Kindly login again.`,
           icon: 'info',
           confirmButtonText: 'Okay',
           allowOutsideClick: false
         }).then(res => {
           if(res.isConfirmed){
               window.location.href = '/login/owner'
           }
         })
    } else if([500].includes(error.response.status)){
        Swal.fire(createParamsForInfoToast('error', 'Error', 'Error occured'))
    }
  })

export const fetchChatMessage = async(chat:string, currentPageResult: number)=>{
    const token = getToken();
    try{
        return await axios.get(`${BACKEND_URL}/messaging/fetchMessasges/${chat}?page=${currentPageResult}&records=${CHAT_MESSAGES_PER_SCROLL}`, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while getting all messages for this active chat')
    }
}
export const sendChatMessage = async(data:any)=>{
    const token = getToken();
    try{
        return await axios.post(`${BACKEND_URL}/messaging/sendMessage`, data, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while setup this chat')
    }
}
export const fetchAllChats = async ()=> {
    const token = getToken();
    try{
        return await axios.get(`${BACKEND_URL}/messaging/fetchAllChats`, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while setup this chat')
    }
}

export const accessChatWith = async (chatWithUserId:string)=> {
    const token = getToken();
    try{
        return await axios.post(`${BACKEND_URL}/messaging/accessChatWith`, {chatWithUserId}, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while setup this chat')
    }
}

export const searchOwners = async (seachPhrase:string)=> {
    const token = getToken();
    try{
        return await axios.get(`${BACKEND_URL}/searchOwners/${seachPhrase}`, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while searching owners')
    }
}

export const updateProfileImage = async (formData: FormData)=> {
    try{
        const token = getToken();
        return await axios.put(`${BACKEND_URL}/updateProfileImage`, formData, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while updating profile image')
    }
}

export const getLoggedInUser = async (token)=> {
    try{
        return await axios.get(`${BACKEND_URL}/getLoggedInUser`, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while creating new Owner')
    }
}
export const newOwnerSignupRequest = async(formData: FormData) => {
    try{
        return await axios.post(`${BACKEND_URL}/newOwner`, formData);
    }catch(e){
        console.log('Getting Error while creating new Owner')
    }
}

export const ownerLoginRequest = async(formData: IOwnerLoginData) => {
    try{
        return await axios.post(`${BACKEND_URL}/ownerLogin`, formData);
    }catch(e){
        console.log('Getting Error while creating new Owner')
    }
}

export const addListening = async(formData: FormData) => {
    try{
        const token = getToken();
        return await axios.post(`${BACKEND_URL}/addListening`, formData, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const updateListing = async(formData: FormData, listingId) => {
    try{
        const token = getToken();
        return await axios.put(`${BACKEND_URL}/updateListing/${listingId}`, formData, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const deleteListing = async(listing) => {
    try{
        const token = getToken();
        return await axios.delete(`${BACKEND_URL}/deleteListing`, {data: listing, headers: {"Authorization" : `Bearer ${token}`}});
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const fetchAllListings = async(society, filterCategory:string, page, limit) => {
    try{
        const token = getToken();
        return await axios.post(`${BACKEND_URL}/fetchAllListings`, {society, filterCategory, page, limit}, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while fetchAllListings')
    }
}

export const fetchListingById = async(id:string)=> {
    try{
        const token = getToken();
        return await axios.post(`${BACKEND_URL}/fetchListingById`, {id}, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while fetching listing by id')
    }
}

export const fetchMyListings = async(ownerId:string | undefined, societyId:string | null)=> {
    try{
        const token = getToken();
        return await axios.post(`${BACKEND_URL}/fetchMyListings`, {ownerId, societyId}, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while fetching listing by id')
    }
}


export const toggleItemSold = async(ownerId:string | undefined, value:boolean)=> {
    try{
        const token = getToken();
        return await axios.put(`${BACKEND_URL}/toggleItemSold`, {ownerId, value}, { headers: {"Authorization" : `Bearer ${token}`} });
    }catch(e){
        console.log('Getting Error while toggleItemSold')
    }
}