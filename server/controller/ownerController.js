
import OwnerModal from "../model/OwnerModel.js";
import { AccountStatus } from "../constants.js";
import jwt from 'jsonwebtoken'
import _ from "lodash";
import BuySellModel from "../model/BuySellModel.js";
import mongoose from "mongoose";
import fs from 'fs'
import { promisify } from "util";
import { jwtDecode } from "jwt-decode";


const unlinkAsync = promisify(fs.unlink)

export const searchOwners = async (request, response) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        const loggedInUser = jwtDecode(token)
        try{
            if(loggedInUser.user){
                const searchPhrase = request.params.searchPhrase;
                const user = await OwnerModal.find({$or: [{firstName: {$regex:searchPhrase, $options : "i"}}, {lastName: {$regex:searchPhrase, $options : "i"}}], societyId: loggedInUser.societyId, _id: { $not: { $eq: loggedInUser.user } }  })
                return response.status(200).json(user)
            } else {
                return response.status(204).json({message: 'user not found'})
            }
            
        }catch(e){
            return response.status(500).json({message: 'An error occured', error: e})
        }
    }
}

export const getLoggedInUser = async(request, response) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        const loggedInUser = jwtDecode(token)
        try{
            if(loggedInUser.user){

                const user = await OwnerModal.aggregate([{$match: {
                    _id: new mongoose.Types.ObjectId(loggedInUser.user),
                    societyId: new mongoose.Types.ObjectId(loggedInUser.societyId)
                  }},
                  {
                    $lookup: {
                      from: "societies",
                      localField: "societyId",
                      foreignField: "_id",
                      as: "society"
                    }
                  },
                  { $unwind: "$society"},
                  {$limit: 1}
                ])
                return response.status(200).json(user[0])
            } else {
                return response.status(204).json({message: 'user not found'})
            }
            
        }catch(e){
            return response.status(500).json({message: 'An error occured', error: e})
        }
    }
    
}

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
        const data = await BuySellModel.aggregate([{$match: {
            ownerid: new mongoose.Types.ObjectId(request.body.ownerId),
            societyid: new mongoose.Types.ObjectId(request.body.societyId)
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
        const {page, limit, filterCategory} = request.body;
        const authHeader = request.headers['authorization'];
        const token = authHeader.substring(7, authHeader.length);
        const {societyId} = jwtDecode(token)
        const data = await BuySellModel.aggregate([{$match: {
            societyid: new mongoose.Types.ObjectId(societyId),
            ...(filterCategory ? {category: filterCategory} : {})
          }},
          {
            $lookup: {
              from: "owners",
              localField: "ownerid",
              foreignField: "_id",
              as: "ownerData"
            }
          },
          { 
            $sort: { "created_at": -1 }  
          },
          {
            $skip: limit*(page-1)
          },
          {
            $limit: limit
          }
        ])
        return response.status(200).json(data)

    }catch(e){
        return response.status(500).json({message: 'An error occured. Please try again later.', error: e})

    }
}
export const newListing = async(request, response) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        jwt.verify(token, process.env.JWT_SECRETKEY, async (err, data) => {
            if(err){
                console.log('❌ Token Invalid')
                return response.status(401).json({result: "Invalid Token", isTokenValid: false})    
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
    
}

export const updateListing= async(request, response) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        jwt.verify(token, process.env.JWT_SECRETKEY, async (err, data) => {
            if(err){
                response.status(401).json({result: "Invalid Token", isTokenValid: false})
                console.log('❌ Token Invalid')
            } else {
                console.log('👍  Token Valid for update listing')
                try{
                    const newImagesPaths = [];
                    let alreadySavedImages = await BuySellModel.aggregate([
                        {$match: { _id: new mongoose.Types.ObjectId(request.params.listingId)}},
                        {$project:{
                          images: 1,
                          _id: 0
                        }},{$limit: 1}
                      ])
                    alreadySavedImages = alreadySavedImages[0].images;
    
                    request.files.length && request.files.forEach(file => newImagesPaths.push(`${file.destination}${file.filename}`))
                    const {title, price, category, condition, description} = request.body;
                    let newImageArr = [...newImagesPaths]
                    if(request.body.images){
                        if(_.isArray(request.body.images)){
                            newImageArr=  newImageArr.concat(request.body.images)
                        }else{
                            newImageArr.push(request.body.images)
                        }
                    }
                    const shouldDelete = alreadySavedImages.filter(value => newImageArr.indexOf(value) === -1)              
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
}

export const updateProfileImage = async(request, response) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
        const loggedInUser = jwtDecode(token)
        jwt.verify(token, process.env.JWT_SECRETKEY, async (err, data) => {
            if(err){
                response.status(401).json({result: "Invalid Token", isTokenValid: false})
                console.log('❌ Token Invalid')
            } else {
                console.log('👍  Token Valid')
                try{
                    const {destination, filename} = request.file;
                    const userProfilePicPathPath = `${destination}${filename}`;
                    const {imageUrl: oldImage} = await OwnerModal.findOne({_id: loggedInUser.user, societyId: loggedInUser.societyId}, {imageUrl: 1, _id:0});
                    console.log(oldImage)
                    if(fs.existsSync(oldImage)){
                        fs.unlink(oldImage, (err)=>{
                            if(err){
                                console.log('File found but got error', err)
                            } else {
                                console.log('old profile picture successfully deleted.')
                            }
                        })
                    }                    
                    await OwnerModal.updateOne({_id: loggedInUser.user, societyId: loggedInUser.societyId}, {$set: {imageUrl: userProfilePicPathPath}})
                    const result = await OwnerModal.aggregate([{$match: {
                        _id: new mongoose.Types.ObjectId(loggedInUser.user),
                        societyId: new mongoose.Types.ObjectId(loggedInUser.societyId)
                      }},
                      {
                        $lookup: {
                          from: "societies",
                          localField: "societyId",
                          foreignField: "_id",
                          as: "society"
                        },
                      },
                      { $unwind: "$society"},
                    ])
                    return response.status(200).json(result[0])
                }catch(e){
                    return response.status(500).json({message: 'Error while saving your profile picture'})
                }
            }
        })
    }
}

export const addOwner = async (request, response) => {
    try{ 
        //await OwnerModal.deleteMany({}); return;
        const {destination, filename} = request.file;
        
        const userProofDocumentFilePath = `${destination}${filename}`;
       
        let exist = await OwnerModal.findOne({societyId: request.body.societyId, towerNumber: request.body.towerNumber, flatNumber: request.body.flatNumber});
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
                societyId: request.body.societyId,
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
        const {societyId, towerNumber, flatNumber, password} = request.body;
        let exist = await OwnerModal.aggregate([{$match: {
            societyId: new mongoose.Types.ObjectId(societyId),
            towerNumber, 
            flatNumber, 
            password
          }},
          {
            $lookup: {
              from: "societies",
              localField: "societyId",
              foreignField: "_id",
              as: "society"
            }
          },
          { $unwind: "$society"},
          {$limit: 1}
        ])
        exist = exist[0]
        // const exist = await OwnerModal.findOne({societyId, towerNumber, flatNumber, password})
        const responseData = _.cloneDeep(exist);
        responseData.password = 'NO_PASSWORD_AVAILABLE';
        if(exist){
         return response.status(200).json({message: "SUCCESS", data: responseData, token: jwt.sign({user: exist._id, societyId, towerNumber, flatNumber}, process.env.JWT_SECRETKEY)})
        } else {
         return response.status(200).json({message: "FAIL"})
        }    
        
    }catch(e){
        return response.status(500).json(e)
    }
}






