
import OwnerModal from "../model/OwnerModel.js";
import { AccountStatus } from "../constants.js";
import jwt from 'jsonwebtoken'
import _ from "lodash";
import BuySellModel from "../model/BuySellModel.js";
import mongoose from "mongoose";
import fs from 'fs'
import { promisify } from "util";


const unlinkAsync = promisify(fs.unlink)

export const deleteListing = async(request, response)=>{
    try{
        request.body.images.forEach(async(item) => await unlinkAsync(item))
        await BuySellModel.deleteOne({_id: request.body._id})
        return response.status(200).json({message: "SUCCESS"})
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}
export const toggleItemSold = async(request, response) => {
    try{
        const data = await BuySellModel.updateOne({_id: request.body.ownerId}, {$set: {isSold: request.body.value}})
        return response.status(200).json(data)
    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
    }
}

export const fetchMyListings= async(request, response) => {
    try{
        let data = await BuySellModel.find({'owner._id': request.body.ownerId, societyid: request.body.societyId});
        return response.status(200).json(data)

    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})

    }
}

export const fetchListingById= async(request, response) => {
    try{
        const data = await BuySellModel.aggregate([
          {$match: { _id: new mongoose.Types.ObjectId(request.body.id)}},
          {
            $lookup: {
              from: "owners",
              localField: "ownerid",
              foreignField: "_id",
              as: "ownerData"
            }, 
          },
          {$project:{
            'ownerData.password': 0,
            'ownerData.proofDocumentURL': 0,
            'ownerData._id': 0,
            'ownerData.society._id': 0
          }},
          { $unwind: "$ownerData"},
          {$limit: 1}
        ])
        return response.status(200).json(data[0])

    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})

    }
}

export const fetchAllListings= async(request, response) => {
    try{
        const data = await BuySellModel.aggregate([{$match: {
            societyid: new mongoose.Types.ObjectId(request.body.society)
          }},
          {
            $lookup: {
              from: "owners",
              localField: "ownerid",
              foreignField: "_id",
              as: "ownerData"
            }
          },
        ])
        return response.status(200).json(data)

    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})

    }
}
export const newListing = async(request, response) => {
    jwt.verify(request.params.token, process.env.JWT_SECRETKEY, async (err, data) => {
        if(err){
            response.send({result: "Invalid Token", isTokenValid: false})
            console.log('❌ Token Invalid')
        } else {
            console.log('👍  Token Valid')
            try{
                const imagesPaths = [];
                request.files.length && request.files.forEach(file => imagesPaths.push(`${file.destination}${file.filename}`))
                const {title, price, category, condition, description, ownerid, societyid} = request.body;
                const newListing = new BuySellModel({
                     images: imagesPaths,
                     title, price, category, condition, description, ownerid, societyid
                  });

                 await newListing.save();
                 return response.status(200).json(newListing)
                
            }catch(e){
                return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
            }
        }
    })
    
}

export const updateListing= async(request, response) => {
    jwt.verify(request.params.token, process.env.JWT_SECRETKEY, async (err, data) => {
        if(err){
            response.send({result: "Invalid Token", isTokenValid: false})
            console.log('❌ Token Invalid')
        } else {
            console.log('👍  Token Valid for update listing')
            try{
                const imagesPaths = [];
                const data = await BuySellModel.aggregate([
                    {$match: { _id: new mongoose.Types.ObjectId(request.params.listingId)}},
                    {$project:{
                      images: 1,
                      _id: 0
                    }},{$limit: 1}
                  ])
                request.files.length && request.files.forEach(file => imagesPaths.push(`${file.destination}${file.filename}`))
                const {title, price, category, condition, description, owner, societyid} = request.body;
                const newImageArr = [...request.body.images, ...imagesPaths]
                const shouldDelete = data[0].images.filter(value => newImageArr.indexOf(value) === -1)              
                shouldDelete.forEach(async(item) => await unlinkAsync(item))
                await BuySellModel.updateOne({
                    _id: request.params.listingId
                }, {
                    $set: {
                        images: newImageArr,
                        title,
                        price,
                        category,
                        condition,
                        description
                    }
                }) 
                return response.status(200).json({message: "SUCCESS"})
                
            }catch(e){
                return response.status(500).json({message: 'An error occured. Please try again later.', error: e})
            }
        }
    })
}

export const addOwner = async (request, response) => {
    try{ 
        //await OwnerModal.deleteMany({}); return;
        const {destination, filename} = request.file;
        
        const userProofDocumentFilePath = `${destination}${filename}`;
       
        let exist = await OwnerModal.findOne({society: JSON.parse(request.body.society), towerNumber: request.body.towerNumber, flatNumber: request.body.flatNumber});
        if(exist){
            switch(exist.status){
                case AccountStatus.PENDING:
                    return response.status(200).json({message: "Duplicate application found"}) 
                case AccountStatus.SUSPENDED:
                    return response.status(200).json({message: "Applied property has already been registered with us but for some reasons it got suspended. If you are applying again. Kindly delete your account by login first and apply again."})
                case AccountStatus.APPROVED:
                    return response.status(200).json({message: `Applied property is already being registered with us from the owner "${exist.firstName} ${exist.lastName}"`})
            }
        } else {
            const newOwner = new OwnerModal({
                society: JSON.parse(request.body.society),
                towerNumber: request.body.towerNumber,
                flatNumber: request.body.flatNumber,
                flatType: request.body.flatType,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                email: request.body.email,
                phone: request.body.phone,
                imageUrl: request.body.imageUrl,
                proofDocumentURL: userProofDocumentFilePath,
                status: AccountStatus.PENDING,
                password: request.body.password,
                other: {}
            });
            await newOwner.save();
            return response.status(200).json({owner: newOwner})
        }
        
    }catch(e){
        return response.status(500).json(e)
    }
}



export const deleteOwner = async(request, response) => {
    try{
        await OwnerModal.deleteOne({_id: request.params.id})
        return response.status(200).json({message: "SUCCESS"})
    }catch(e){
        return response.status(500).json(e)
    }
}

export const rejectOwnerAccount = async(request, response) => {
    try{
        const target = await OwnerModal.findOne({_id: request.body.id})
        target.status = AccountStatus.REJECTED;
        target.other = {...target.other, rejectionMessage: request.body.rejectionMessage};
        await target.save();
        return response.status(200).json(target)
    }catch(e){
        return response.status(500).json(e)
    }
}

export const approveOwnerAccount = async(request, response) => {
    try{
        const target = await OwnerModal.findOne({_id: request.body.id})
        target.status = AccountStatus.APPROVED;
        await target.save();
        return response.status(200).json(target)
    }catch(e){
        return response.status(500).json(e)
    }
}

export const ownerLogin = async (request, response) => {
    try{
        const {society, towerNumber, flatNumber, password} = request.body;
        const exist = await OwnerModal.findOne({society, towerNumber, flatNumber, password})
        const responseData = _.cloneDeep(exist);
        responseData.password = 'NO_PASSWORD_AVAILABLE';
        if(exist){
         return response.status(200).json({message: "SUCCESS", data: responseData, token: jwt.sign({society, towerNumber, flatNumber}, process.env.JWT_SECRETKEY)})
        } else {
         return response.status(200).json({message: "FAIL"})
        }    
        
    }catch(e){
        return response.status(500).json(e)
    }
}






