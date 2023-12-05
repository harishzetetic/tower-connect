import express from 'express';
import { addSociety, getAllSocieties } from '../controller/societyController.js';
import { addListening, addOwner, deleteOwner, verifyToken, rejectOwnerAccount, approveOwnerAccount, ownerLogin } from '../controller/ownerController.js';
import { signInAdmin, getPendingStatusAccounts } from '../controller/adminController.js';
import multer from 'multer';


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './userdocs')
    },
    filename: function(req, file, cb){
        return cb(null, `/${Date.now()}-${file.originalname}`)
    },
})

const listeningStorage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './itemImages')
    },
    filename: function(req, file, cb){
        return cb(null, `/${Date.now()}-${file.originalname}`)
    },
})
const userDocs = multer({storage});
const listeningImages = multer({listeningStorage});


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

Route.post('/addListening/:token', (request, response, next)=>{
    listeningImages.single('proofDocument')
    verifyToken(request, response, next)
}, addListening); //with File ✅ ✅ ✅ ✅ 


Route.post('/ownerLogin', ownerLogin)


export default Route