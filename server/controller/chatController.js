import ChatModel from '../model/ChatModel.js'
import { jwtDecode } from "jwt-decode";
import OwnerModal from '../model/OwnerModel.js';


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
        response.status(204).json({message: 'Chat not found'})
    }else {
        response.status(200).json(removed)
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
        response.status(204).json({message: 'Chat not found'})
    }else {
        response.status(200).json(added)
    }
}

export const renameGroup = async(request, response) => {
    const {chatId, chatName} = request.body;
    const updatedChat = await ChatModel.findByIdAndUpdate(chatId, {chatName}, {new: true})
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    if(!updatedChat){
        response.status(404).json({message: 'Chat not found'})
    } else {
        response.status(200).json(updatedChat)
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

        response.status(200).json(fullGroupChat)
    }catch(e){
        response.status(500).json(e)
    }
}


export const fetchChats= async(request, response) => {
    try{
        const loggedInUser = jwtDecode(request.params.token).user;
        const results = await ChatModel.find({users: {$elemMatch: {$eq: loggedInUser}}})
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({updatedAt: -1})

        const allChat = await OwnerModal.populate(results, {
            path: 'latestMessage.sender',
            select: 'firstName lastName imageUrl email'
        })
        response.status(200).json(allChat)
    }catch(e){
        response.status(500).json(e)
    }
}

export const accessChat = async (request, response) => {
    const {userId} = request.body;
    const loggedInUser = jwtDecode(request.params.token).user;
    if(!userId){
        console.log('userid param not send with request')
        return response.status(400).json({message: 'userid param not send with request'})
    }

    const isChat = await ChatModel.find({
        isGroupChat: false, 
        $and: [
            {users: {$elemMatch: {$eq: loggedInUser}}},
            {users: {$elemMatch: {$eq: userId}}}
        ]
    }).populate('users', '-password').populate('latestMessage');

    isChat = await OwnerModal.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'firstName lastName imageUrl email'
    })

    if(isChat.length){
        response.status(200).json(isChat[0])
    } else {
        let chatData = {
            chatName: 'sender',
            isGroupChat: false,
            users:[loggedInUser, userId]
        }
        try{
            const createdChat = await ChatModel.create(chatData)
            const fullChat = await ChatModel.findOne({_id: createdChat._id}).populate('users', '-password')
            response.status(200).send(fullChat)

        }catch(e){
            response.status(500).send(e)
        }
    }


}