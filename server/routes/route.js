import express from 'express';
import { addSociety, getAllSocieties } from '../controller/societyController.js';
import { addOwner, deleteOwner, verifyToken } from '../controller/ownerController.js';
import { signInAdmin, getPendingStatusAccounts } from '../controller/adminController.js';
import multer from 'multer';

const userDocs = multer({dest: 'userdocs/'})
const Route = express.Router();
// REMEMBER: WE NEED TO MAINTAIN JWT TOKEN AT THE TIME OF LOGIN var jwt = require('jsonwebtoken');

//admin Apis
Route.post('/adminSignIn', signInAdmin);
Route.get('/pendingAccounts', getPendingStatusAccounts);

// Society Apis
Route.post('/addSociety', addSociety);
Route.get('/getAllSocieties', getAllSocieties);

// Owner Apis
Route.post('/newOwner', userDocs.single('proofDocument'), addOwner); //signup request
Route.delete('/deleteOwner/:id/:token', verifyToken, deleteOwner);
Route.put('/approveOwnerAccount/:id', deleteOwner);
// Owner Collection
// societyObject, flatNumber, towerNumber, Owner name, ownerDOB, 
// ownerOccupation, ownerPhoneNumner, ownerEmail, accountStatus['ACTIVE', 'SUSPENDED', 'HOLD'],
// accountPendingReason, 
// flatId(A3-1001)
// after signup, we will send a postcard with a OTP,
// when owner enter that OTP only then account will active

/*
    //login Apis
Route.post('login', (req, res) => {
    const exampleUserDetails = {
        id: 1,
        name: 'Harish',
        email: 'harish@gmail.com'
    }
    jwt.sign({exampleUserDetails}, 'secretKey', {expiresIn: '300s'}, (err, token) => {
        res.json({token})
    })
})

Route.post("/profile", verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, data) => {
        if(err){
            res.send({result: "Invalid Token"})
        } else {
            res.json({
                message: "token accessed",
                data
            })
        }
    })
})
function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined'){
        const token = bearerHeader.split(' ')[1];
        req.token = token;
    } else {
        res.send({result: 'Token is not valid'})
    }
}
*/


export default Route