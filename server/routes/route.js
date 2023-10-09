import express from 'express';
import { addSociety, getAllSocieties } from '../controller/societyController.js';

const Route = express.Router();
// var jwt = require('jsonwebtoken');

// Society Apis
Route.post('/addSociety', addSociety);
Route.get('/getAllSocieties', getAllSocieties);
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