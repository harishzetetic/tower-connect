import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
// Our Imports
import Route from './routes/route.js';
import Connection from './database/db.js';

const app = express();
app.use(cors())
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', Route);
app.use('/userdocs', express.static('userdocs'))

Connection();
const PORT = 9000
app.listen(PORT, ()=>console.log('Server running successfull on PORT ',PORT))