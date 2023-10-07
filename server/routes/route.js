import express from 'express';
// import { addUser } from '../controller/userController.js';
import { addSociety, getAllSocieties } from '../controller/societyController.js';

const Route = express.Router();

Route.post('/addSociety', addSociety);

Route.get('/getAllSocieties', getAllSocieties)


export default Route