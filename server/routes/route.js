import express from 'express';
import { addSociety, getAllSocieties } from '../controller/societyController.js';
import { deleteListing, toggleItemSold, updateListing, fetchMyListings, fetchListingById, fetchAllListings, newListing, addOwner, deleteOwner, rejectOwnerAccount, approveOwnerAccount, ownerLogin } from '../controller/ownerController.js';
import { signInAdmin, getPendingStatusAccounts } from '../controller/adminController.js';
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
Route.post('/adminSignIn', signInAdmin);
Route.get('/pendingAccounts/:token',verifyToken, getPendingStatusAccounts);

// Society Apis
Route.post('/addSociety', addSociety);
Route.get('/getAllSocieties', getAllSocieties);

// Owner Apis
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


Route.post('/ownerLogin', ownerLogin)


export default Route