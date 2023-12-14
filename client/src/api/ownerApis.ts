
import { IBuySell, IOwnerData, IOwnerLoginData, ISociety } from "@/Types";
import { BACKEND_URL } from "@/constants";
import { getLoggedInUserData } from "@/util";
import axios from "axios";

/*
PUT is best used when you are updating or replacing existing data on the server, 
POST is best used when you are creating new data. 
*/

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
        const loggedInUserInfo = getLoggedInUserData();
        return await axios.post(`${BACKEND_URL}/addListening/${loggedInUserInfo?.token}`, formData);
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const updateListing = async(formData: FormData, listingId) => {
    try{
        const loggedInUserInfo = getLoggedInUserData();
        return await axios.put(`${BACKEND_URL}/updateListing/${listingId}/${loggedInUserInfo?.token}`, formData);
    }catch(e){
        console.log('Getting Error while add your listening')
    }
}

export const fetchAllListings = async(society) => {
    try{
        const loggedInUserInfo = getLoggedInUserData();
        return await axios.post(`${BACKEND_URL}/fetchAllListings/${loggedInUserInfo?.token}`, {society});
    }catch(e){
        console.log('Getting Error while fetchAllListings')
    }
}

export const fetchListingById = async(id:string)=> {
    try{
        const loggedInUserInfo = getLoggedInUserData();
        return await axios.post(`${BACKEND_URL}/fetchListingById/${loggedInUserInfo?.token}`, {id});
    }catch(e){
        console.log('Getting Error while fetching listing by id')
    }
}

export const fetchMyListings = async(ownerId:string | undefined, societyId:string | undefined)=> {
    try{
        const loggedInUserInfo = getLoggedInUserData();
        return await axios.post(`${BACKEND_URL}/fetchMyListings/${loggedInUserInfo?.token}`, {ownerId, societyId});
    }catch(e){
        console.log('Getting Error while fetching listing by id')
    }
}


export const toggleItemSold = async(ownerId:string | undefined, value:boolean)=> {
    try{
        const loggedInUserInfo = getLoggedInUserData();
        return await axios.put(`${BACKEND_URL}/toggleItemSold/${loggedInUserInfo?.token}`, {ownerId, value});
    }catch(e){
        console.log('Getting Error while toggleItemSold')
    }
}