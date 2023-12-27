
import { IBuySell, IOwnerData, IOwnerLoginData, ISociety } from "@/Types";
import { BACKEND_URL } from "@/constants";
import { getToken } from "@/util";
import axios from "axios";

/*
PUT is best used when you are updating or replacing existing data on the server, 
POST is best used when you are creating new data. 
*/
export const getLoggedInUser = async (token)=> {
    try{
        return await axios.get(`${BACKEND_URL}/getLoggedInUser/${token}`);
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
        return await axios.post(`${BACKEND_URL}/addListening/${token}`, formData);
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const updateListing = async(formData: FormData, listingId) => {
    try{
        const token = getToken();
        return await axios.put(`${BACKEND_URL}/updateListing/${listingId}/${token}`, formData);
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const deleteListing = async(listing) => {
    try{
        const token = getToken();
        return await axios.delete(`${BACKEND_URL}/deleteListing/${token}`, {data: listing});
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const fetchAllListings = async(society) => {
    try{
        const token = getToken();
        return await axios.post(`${BACKEND_URL}/fetchAllListings/${token}`, {society});
    }catch(e){
        console.log('Getting Error while fetchAllListings')
    }
}

export const fetchListingById = async(id:string)=> {
    try{
        const token = getToken();
        return await axios.post(`${BACKEND_URL}/fetchListingById/${token}`, {id});
    }catch(e){
        console.log('Getting Error while fetching listing by id')
    }
}

export const fetchMyListings = async(ownerId:string | undefined, societyId:string | undefined)=> {
    try{
        const token = getToken();
        return await axios.post(`${BACKEND_URL}/fetchMyListings/${token}`, {ownerId, societyId});
    }catch(e){
        console.log('Getting Error while fetching listing by id')
    }
}


export const toggleItemSold = async(ownerId:string | undefined, value:boolean)=> {
    try{
        const token = getToken();
        return await axios.put(`${BACKEND_URL}/toggleItemSold/${token}`, {ownerId, value});
    }catch(e){
        console.log('Getting Error while toggleItemSold')
    }
}