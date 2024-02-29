
import { BACKEND_URL } from "@/constants";
import axios from "axios";


export const adminSignIn = async(credentials) => {
    try{
        return await axios.post(`${BACKEND_URL}/superadmin/adminSignIn`, credentials);
    }catch(e){
        console.log('Getting Error while admin signin')
    }
}

export const fetchPendingAccounts = async()=>{
    const token = localStorage.getItem('token');
    try{

        return await axios.get(`${BACKEND_URL}/superadmin/pendingAccounts`, { headers: {"Authorization" : `Bearer ${token}`} })
    }catch(e){
        console.log('Getting Error while fetching pending account')
    }
}
export const deleteOwner = async(id:string)=>{
    const jwt_token = localStorage.getItem('token');
    try{    
        return await axios.delete(`${BACKEND_URL}/deleteOwner/${id}`, { headers: {"Authorization" : `Bearer ${jwt_token}`} })
    }catch(e){
        console.log('Getting Error while clear owner collection')
    }
}

export const rejectOwnerAccount = async(data: {id:string; rejectionMessage:string})=>{
    const jwt_token = localStorage.getItem('token');
    try{   
        return await axios.put(`${BACKEND_URL}/rejectOwnerAccount/${data.id}`, data, { headers: {"Authorization" : `Bearer ${jwt_token}`} })
    }catch(e){
        console.log('Getting Error while clear owner collection')
    }
}

export const approveOwnerAccount = async(id:string)=>{
    const jwt_token = localStorage.getItem('token');
    try{    
        return await axios.put(`${BACKEND_URL}/approveOwnerAccount/${id}`, {}, { headers: {"Authorization" : `Bearer ${jwt_token}`} })
    }catch(e){
        console.log('Getting error while approving the account')
    }
}