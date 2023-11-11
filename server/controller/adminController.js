
import jwt from 'jsonwebtoken'
import OwnerModal from '../model/OwnerModel.js';
import { AccountStatus } from "../constants.js";

export const signInAdmin = async (request, response) => {
    try{
       const {userId, password} = request.body;
       if(userId === 'towerconnect8@gmail.com' && password === 'Summer@2024'){
        return response.status(200).json({message: "SUCCESS", token: jwt.sign({email: userId}, process.env.JWT_SECRETKEY)})
       } else {
        return response.status(200).json({message: "FAIL"})
       }    
        
    }catch(e){
        return response.status(500).json(e)
    }
}

export const getPendingStatusAccounts = async(request, response) => {
    try{
        const pendingAccounts = await OwnerModal.find({status: AccountStatus.PENDING})
        return response.status(200).json(pendingAccounts)
    } catch(e){
        return response.status(500).json(e)  
    }
}

