
import SocietyModel from "../model/SocietyModel.js";

export const addSociety = async (request, response) => {
    try{
        const newSociety = new SocietyModel(request.body);
        await newSociety.save();
        return response.status(200).json(newSociety)
    }catch(e){
        return response.status(500).json(e)
    }
}

export const getAllSocieties = async (request, response) => {
    try{
        const allSocieties = await SocietyModel.find();
        return response.status(200).json(allSocieties);
    }catch(e){
        return response.status(500).json(e)
    }
}