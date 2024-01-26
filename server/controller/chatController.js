import ChatModel from '../model/ChatModel.js'
import { jwtDecode } from "jwt-decode";
import OwnerModal from '../model/OwnerModel.js';
import MessageModel from '../model/Messagemodel.js';
import { skippableItems } from '../util.js';



export const sendMessage = async(request, response) => {
    // await MessageModel.deleteMany({})
    // return;
    const {sender, content, chat} = request.body;
    if(!sender || !chat){
        return response.status(204).json({message: 'Request body content not complete or invalid'})
    }
    const data = await MessageModel.create({sender, content, chat}) 
    if(data){
        await ChatModel.updateOne({_id: chat}, {$set: {latestMessage: data._id}})
    }
    return response.status(200).json(data)
}

/*
export const removeFromGroup = async(request, response) => {
    const {chatId, userId} = request.body;
    const removed = await ChatModel.findByIdAndUpdate(chatId, {
        $pull: {users: userId},
    },
    {new: true}
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(!removed){
        return response.status(204).json({message: 'Chat not found'})
    }else {
        return response.status(200).json(removed)
    }
}

export const addToGroup = async(request, response) => {
    const {chatId, userId} = request.body;
    const added = await ChatModel.findByIdAndUpdate(chatId, {
        $push: {users: userId},
    },
    {new: true}
    )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

    if(!added){
        return response.status(204).json({message: 'Chat not found'})
    }else {
        return response.status(200).json(added)
    }
}

export const renameGroup = async(request, response) => {
    const {chatId, chatName} = request.body;
    const updatedChat = await ChatModel.findByIdAndUpdate(chatId, {chatName}, {new: true})
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    if(!updatedChat){
        return response.status(404).json({message: 'Chat not found'})
    } else {
        return response.status(200).json(updatedChat)
    }
}

export const createGroupChat = async(request, response) => {
    const loggedInUser = jwtDecode(request.params.token).user;
    if(!request.body.users || !request.body.name){
        return response.status(200).json({message: 'Please fill all fields'})
    }
    const users = JSON.parse(request.body.users);
    if(users.length < 2){
        return response.status(200).json({message: 'More than two users are required for a group chat'})
    }
    users.push(loggedInUser)
    try{
        const groupChat = await ChatModel.create({
            chatName: request.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: loggedInUser
        })

        const fullGroupChat = await ChatModel.findOne({_id: groupChat._id})
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

        return response.status(200).json(fullGroupChat)
    }catch(e){
        return response.status(500).json(e)
    }
}

*/

export const fetchMessasges= async(request, response) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        try{
            // UI is seding page starting from 1 but we have to calculate from last page 
            const chatId = request.params.chat;
            const itemsPerPage = parseInt(request.query.records);
            let page = parseInt(request.query.page);
            const totalItems = await MessageModel.find({chat: chatId}).countDocuments()
            // const numberOfPages = Math.floor((totalItems + itemsPerPage - 1) / itemsPerPage);
            if(page < 1){
                return response.status(200).json([])
            }
            
            const results = await MessageModel.find({chat: chatId})
                .sort({createdAt: -1}).populate('sender').populate('chat')   
                .skip(skippableItems(itemsPerPage, page)).limit(itemsPerPage)
                .sort({createdAt: 1})
            return response.status(200).json(results)
        }catch(e){
            return response.status(500).json(e)
        }
    }
    
}

export const fetchChats= async(request, response) => {
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        try{
            const token = authHeader.substring(7, authHeader.length);
            const loggedInUser = jwtDecode(token).user;
            const results = await ChatModel.find({users: {$elemMatch: {$eq: loggedInUser}}})
            .populate('users') //populate function will get user details from user collection because of ref inside the model
            .populate('latestMessage')
            .sort({updatedAt: -1})
    
            return response.status(200).json(results)
        }catch(e){
            return response.status(500).json(e)
        }
    }
    
}

export const accessChat = async (request, response) => {
    const {chatWithUserId} = request.body;
    const authHeader = request.headers['authorization'];
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7, authHeader.length);
    const loggedInUser = jwtDecode(token).user;
    if(!chatWithUserId){
        console.log('userid param not send with request')
        return response.status(400).json({message: 'userid param not send with request'})
    }

    const isChatAvailable = await ChatModel.findOne({
        isGroupChat: false, 
        $and: [
            {users: {$elemMatch: {$eq: loggedInUser}}},
            {users: {$elemMatch: {$eq: chatWithUserId}}}
        ]
    });
    if(isChatAvailable){
        return response.status(200).json(isChatAvailable)
    } else {
        try{
            // const chatWithUser = await OwnerModal.findOne({_id: chatWithUserId})
            let chatData = {
                users:[loggedInUser, chatWithUserId]
            }
            const createdChat = await ChatModel.create(chatData)
            return response.status(200).send(createdChat)

        }catch(e){
            return response.status(500).send(e)
        }
    }
    }
    


}