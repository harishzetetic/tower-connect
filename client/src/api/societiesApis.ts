
import { ISociety } from "@/Types";
import { BACKEND_URL } from "@/constants";
import axios from "axios";

/*
PUT is best used when you are updating or replacing existing data on the server, 
POST is best used when you are creating new data. 
*/

export const addSociety = async(data: ISociety) => {
    try{
        return await axios.post(`${BACKEND_URL}/addSociety`, data);
    }catch(e){
        console.log('Getting Error while creating campaign')
    }
}

export const getAllSocieties = async() => {
    try{
        return await axios.get(`${BACKEND_URL}/getAllSocieties`);
    }catch(e){
        console.log('Getting Error while getting all societies info')
    }
}
