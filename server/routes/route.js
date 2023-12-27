import express from 'express';
import { addSociety, getAllSocieties } from '../controller/societyController.js';
import { getLoggedInUser, deleteListing, toggleItemSold, updateListing, fetchMyListings, fetchListingById, fetchAllListings, newListing, addOwner, deleteOwner, rejectOwnerAccount, approveOwnerAccount, ownerLogin } from '../controller/ownerController.js';
import { signInAdmin, getPendingStatusAccounts } from '../controller/adminController.js';
import { removeFromGroup, addToGroup, renameGroup, createGroupChat, fetchChats, accessChat } from '../controller/chatController.js';

import multer from 'multer';
import {verifyToken} from '../middleware.js'
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
const userDocs = multer({storage});
const buySellImages = multer({storage: buySellImageStorage});


const Route = express.Router();

//admin Apis
Route.post('/superadmin/adminSignIn', signInAdmin);
Route.get('/superadmin/pendingAccounts/:token',verifyToken, getPendingStatusAccounts);

// Society Apis
Route.post('/addSociety', addSociety);
Route.get('/getAllSocieties', getAllSocieties);

// Owner Apis
Route.get('/getLoggedInUser/:token', verifyToken, getLoggedInUser)
Route.post('/newOwner', userDocs.single('proofDocument'), addOwner); //with File
Route.delete('/deleteOwner/:id/:token', verifyToken, deleteOwner);
Route.put('/rejectOwnerAccount/:id/:token', verifyToken, rejectOwnerAccount);
Route.put('/approveOwnerAccount/:id/:token', verifyToken, approveOwnerAccount)

Route.post('/addListening/:token', buySellImages.array('images'), newListing); //with File ✅ ✅ ✅ ✅ 
Route.put('/updateListing/:listingId/:token', buySellImages.array('images'), updateListing) //with File ✅ ✅ ✅ ✅ 
Route.delete('/deleteListing/:token', verifyToken, deleteListing)
Route.post('/fetchAllListings/:token', verifyToken, fetchAllListings);
Route.post('/fetchListingById/:token', verifyToken, fetchListingById);
Route.post('/fetchMyListings/:token', verifyToken, fetchMyListings);

Route.put('/toggleItemSold/:token', verifyToken, toggleItemSold);

// Chat Apis
/* This below route expected to create a new chat between two users(1-1). 
if chat already exist it would return the same
*/
 Route.post('/messaging/chat', verifyToken, accessChat)
 /* Below route will expected to return all chat for the user */
 Route.get('/messaging/chat', verifyToken, fetchChats)
 Route.post('/messaging/group', verifyToken, createGroupChat)
 Route.put('/messaging/rename', verifyToken, renameGroup)
 Route.put('/messaging/groupadd', verifyToken, addToGroup)
 Route.put('/messaging/groupremove', verifyToken, removeFromGroup)




Route.post('/ownerLogin', ownerLogin)


export default Route