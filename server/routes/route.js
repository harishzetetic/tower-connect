import express from 'express';
import { addSociety, getAllSocieties } from '../controller/societyController.js';
import { searchOwners, getLoggedInUser, deleteListing, toggleItemSold, updateListing, fetchMyListings, fetchListingById, fetchAllListings, newListing, updateProfileImage, addOwner, deleteOwner, rejectOwnerAccount, approveOwnerAccount, ownerLogin } from '../controller/ownerController.js';
import { signInAdmin, getPendingStatusAccounts } from '../controller/adminController.js';
import { fetchMessasges, sendMessage, fetchChats, accessChat } from '../controller/chatController.js';

import multer from 'multer';
import {verifyAuthorization} from '../middleware.js'
import {uniqueFileNameGenerator} from '../util.js'


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './userdocs')
    },
    filename: function(req, file, cb){
        return cb(null, `/${uniqueFileNameGenerator(file.originalname)}`)
    },
})

const buySellImageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './itemImages')
    },
    filename: function(req, file, cb){
        return cb(null, `/${uniqueFileNameGenerator(file.originalname)}`)
    },
})

const profileImageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './profilepictures')
    },
    filename: function(req, file, cb){
        return cb(null, `/${uniqueFileNameGenerator(file.originalname)}`)
    },
})
const userDocs = multer({storage});
const buySellImages = multer({storage: buySellImageStorage});
const profileImages = multer({storage: profileImageStorage});


const Route = express.Router();

//admin Apis
Route.post('/superadmin/adminSignIn', signInAdmin);
Route.get('/superadmin/pendingAccounts',verifyAuthorization, getPendingStatusAccounts);

// Society Apis
Route.post('/addSociety', addSociety);
Route.get('/getAllSocieties', getAllSocieties);

// Owner Apis
Route.get('/getLoggedInUser', verifyAuthorization, getLoggedInUser)
Route.post('/newOwner', userDocs.single('proofDocument'), addOwner); //with File
Route.put('/updateProfileImage', profileImages.single('profileImage'), updateProfileImage); //with File
Route.delete('/deleteOwner/:id', verifyAuthorization, deleteOwner);
Route.put('/rejectOwnerAccount/:id', verifyAuthorization, rejectOwnerAccount);
Route.put('/approveOwnerAccount/:id', verifyAuthorization, approveOwnerAccount)

Route.post('/addListening', buySellImages.array('images'), newListing); //with File ✅ ✅ ✅ ✅ 
Route.put('/updateListing/:listingId', buySellImages.array('images'), updateListing) //with File ✅ ✅ ✅ ✅ 
Route.delete('/deleteListing', verifyAuthorization, deleteListing)
Route.post('/fetchAllListings', verifyAuthorization, fetchAllListings);
Route.post('/fetchListingById', verifyAuthorization, fetchListingById);
Route.post('/fetchMyListings', verifyAuthorization, fetchMyListings);

Route.put('/toggleItemSold', verifyAuthorization, toggleItemSold);

Route.get('/searchOwners/:searchPhrase', verifyAuthorization, searchOwners)
// Chat Apis
/* This below route expected to create a new chat between two users(1-1). 
if chat already exist it would return the same
*/
 Route.post('/messaging/accessChatWith', verifyAuthorization, accessChat)
 /* Below route will expected to return all chat for the user */
 Route.get('/messaging/fetchAllChats', verifyAuthorization, fetchChats)
 Route.get('/messaging/fetchMessasges/:chat', verifyAuthorization, fetchMessasges)


 Route.post('/messaging/sendMessage', verifyAuthorization, sendMessage)

 /*
     Route.post('/messaging/group', verifyAuthorization, createGroupChat)
        Route.put('/messaging/rename', verifyAuthorization, renameGroup)
        Route.put('/messaging/groupadd', verifyAuthorization, addToGroup)
        Route.put('/messaging/groupremove', verifyAuthorization, removeFromGroup)
 */





Route.post('/ownerLogin', ownerLogin)


export default Route