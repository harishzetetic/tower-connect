import express from 'express';
import cors from 'cors'
import bodyParser from 'body-parser';
// Our Imports
import Route from './routes/route.js';
import Connection from './database/db.js';
import multer from 'multer';
import {Server} from 'socket.io';
import {createServer} from 'http';

const app = express();

const server = createServer(app);
const io = new Server(server, {
       pingTimeout: 60000,
       cors: {
           origin: 'http://localhost:3000'
       }})

app.use(cors())
app.use(bodyParser.json({extended: true}))
app.use(bodyParser.urlencoded({extended: true}))
app.use('/', Route);

app.use('/userdocs', express.static('userdocs'))
app.use('/itemImages', express.static('itemImages'))

Connection();

let onlineUsers= [];

const addUser = (userData, socketId)=>{
    !onlineUsers.some(user => user._id == userData._id) && onlineUsers.push({...userData, socketId})
} 

const removeUser = (userData) => {
    onlineUsers = onlineUsers.filter(user => user._id !== userData._id)
}

io.on('connection', (socket)=>{
    console.log('Connected to socket.io, current online users are ', onlineUsers.length);
    socket.on("addUser", (userData)=>{
        addUser(userData, socket.id)
    })

    socket.on("removeUser", userData => {
        removeUser(userData)
    })

    socket.on('sendMessage', (data)=>{
        if(data){
            const user = onlineUsers.find(user => user._id === data.sendTo._id)
            console.log(user?.socketId)
            if(user?.socketId){
                socket.broadcast.emit('getMessage', data)
                console.log('data emmited to  ', user )
            }
        }
       
    })

    socket.emit('getOnlineUsers', onlineUsers.map(item => item._id))

    
})

server.listen(9000, ()=>console.log('Server running successfull on PORT ',9000))

