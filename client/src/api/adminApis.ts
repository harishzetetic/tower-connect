
import { ISociety } from "@/Types";
import { BACKEND_URL } from "@/constants";
import axios from "axios";


export const adminSignIn = async(credentials) => {
    try{
        return await axios.post(`${BACKEND_URL}/adminSignIn`, credentials);
    }catch(e){
        console.log('Getting Error while admin signin')
    }
}

export const fetchPendingAccounts = async()=>{
    try{
        return await axios.get(`${BACKEND_URL}/pendingAccounts`)
    }catch(e){
        console.log('Getting Error while fetching pending account')
    }
}
export const deleteOwner = async(id:string, token:string | null = sessionStorage.getItem('token'))=>{
    try{    
        return await axios.delete(`${BACKEND_URL}/deleteOwner/${id}/${token}`)
    }catch(e){
        console.log('Getting Error while clear owner collection')
    }
}
export const approveOwnerAccount = async(id:string)=>{
    try{    
        return await axios.put(`${BACKEND_URL}/approveOwnerAccount/${id}`)
    }catch(e){
        console.log('Getting Error while clear owner collection')
    }
}
export const rejectOwnerAccount = async(id:string)=>{
    try{    
        return await axios.delete(`${BACKEND_URL}/rejectOwnerAccount/${id}`)
    }catch(e){
        console.log('Getting Error while clear owner collection')
    }
}
