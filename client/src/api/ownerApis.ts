
import { IOwnerData, IOwnerLoginData, ISociety } from "@/Types";
import { BACKEND_URL } from "@/constants";
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
