
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