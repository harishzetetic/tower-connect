"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Toolbar from '@mui/material/Toolbar';
import { AppBar, Avatar, BadgeOwnProps, Button, Card, CardContent, Chip, Container, Drawer, Grid, IconButton, ImageList, ImageListItem, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField, ThemeProvider, Typography } from "@mui/material";
import Sidebar from "@/components/dashboard/sidebar";
import { APP_THEME, IBuySell, IChat, IIncomingMessage, IMessage, IOwnerData } from "@/Types";
import SellItemWizard from "@/components/dashboard/sellItemWizard";
import _ from 'lodash'
import {io} from 'socket.io-client'
import TopNavigation from '@/components/dashboard/topNavigation';
import { useRouter } from 'next/navigation';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSelector } from "react-redux";

import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchAllChats, fetchChatMessage, searchOwners, sendChatMessage } from '@/api/ownerApis';
import SeachOwnerDrawer from './searchOwnerDrawer';
import { BACKEND_URL, QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { StyledBadge } from '@/styled';
import { HOC } from '@/components/hoc/hoc';
import Swal from 'sweetalert2';
import { createParamsForInfoToast } from '@/util';
dayjs.extend(relativeTime)


const Messaging = HOC(({ params }) => {
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);

    const [onlineUsers, setOnlineUsers] = React.useState<string[]>([]);

    React.useEffect(()=>{
        io(BACKEND_URL).on('getOnlineUsers', users => setOnlineUsers(users))
    },[loggedInUser])

    const [openSellWizard, setOpenSellWizard] = React.useState<boolean>(false);
    const [toggleSeachOwner, setToggleSearchOwner] = React.useState<boolean>(false)
    const [activeChat, setActiveChat] = React.useState<string | null>(null);

    /* ---------------------------------------------------------------------------------- */
    const router = useRouter()
    
    const {data:myChats, isLoading:isFetchingMyChats} = useQuery({
        queryFn: () => fetchMyChats(),
        queryKey: [QUERY_KEYS.FETCH_MY_CHATS],
        enabled: true, // Now it will not immediately call the api when component mount
        refetchOnWindowFocus: false // this feature is really cool if true, browser check with the server if there are any latest data
    })

    const fetchMyChats = async () => {
        try{
            const apiResponse = await fetchAllChats()
            if (apiResponse?.status === 200) {
                return apiResponse?.data
            }
        }catch(e){
            console.log('There is some problem while searching owners', e)
        }
    }

    if (loggedInUser) {
        return (<ThemeProvider theme={APP_THEME}>
            <TopNavigation />
            <Sidebar loggedInUser={loggedInUser} setOpenSellWizard={setOpenSellWizard} />
            <Toolbar />
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={6} md={2}></Grid>
                <Grid item xs={6} md={10}>
                  
                    <Grid container spacing={2} sx={{ p: 2 }}>
                        <Grid item xs={6} md={4}>
                            <Typography variant='h6'>My Chat
                            <IconButton color="secondary" aria-label="add an alarm" sx={{verticalAlign: 'sub'}} onClick={() => setToggleSearchOwner(!toggleSeachOwner)}>
                            <AddCircleIcon />
                            </IconButton>
                            </Typography>
         
                            <List sx={{
                                width: '100%',
                                maxWidth: 360,
                                bgcolor: 'background.paper',
                                height: '70vh',
                                overflowY: 'scroll'
                            }}>
                                {isFetchingMyChats && <Typography>Loading your chat history...</Typography>}
                                {myChats && myChats.map(chat => <ChatListItem chat={chat} loggedInUser={loggedInUser} activeChat={activeChat} setActiveChat={setActiveChat} isOnline={onlineUsers.includes(loggedInUser._id || '')}/>)}
                            </List>
                        </Grid>
                        <Grid item xs={6} md={8}>
                            {activeChat && <ChatBox chat={(myChats as Array<IChat>).find(i=>i._id === activeChat) || {} as IChat}/>}
                        </Grid>
                    </Grid>


                   <SeachOwnerDrawer toggleSeachOwner={toggleSeachOwner} setToggleSearchOwner={setToggleSearchOwner} />

                </Grid>
            </Grid>
            <SellItemWizard openSellWizard={openSellWizard} setOpenSellWizard={setOpenSellWizard} />
        </ThemeProvider>)
    }
    return <>User probably not logged in. Kindly login again.</>

})

export default Messaging


interface IChatListItem {
    chat: IChat,
    loggedInUser:IOwnerData,
    setActiveChat: React.Dispatch<React.SetStateAction<string | null>>,
    activeChat: string | null,
    isOnline: boolean
}
const ChatListItem = (props: IChatListItem) => {
    const chatPerson = props.chat?.users.filter(item => item._id !== props.loggedInUser._id)[0]

    const getLatestPrompt = () => {
        if(props.loggedInUser._id === props?.chat?.latestMessage?.sender){
            return `You: ${props.chat?.latestMessage?.content}`
        } else {
            return `${chatPerson.firstName} ${chatPerson.lastName}: ${props.chat?.latestMessage?.content}`
        }
    }

    const onlineStyling = {
        overlap: "circular",
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        variant:"dot"
    }
    return <ListItem sx={{ bgcolor: props.activeChat === props.chat._id ? '#1976d2' : "#474747", color: 'white', borderRadius: '8px', mt: 0.5, 
    "&:hover": {backgroundColor: "#474747",}
     }} onClick={()=>{
        props.setActiveChat(props.chat._id || null)
     }}>
        <ListItemAvatar>
        <StyledBadge 
            {...(props.isOnline ? onlineStyling : {}) as BadgeOwnProps}>
                     <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {chatPerson.firstName?.charAt(0)} {chatPerson.lastName?.charAt(0)}
            </Avatar>
        </StyledBadge>
           
        </ListItemAvatar>
        <ListItemText 
            primary={<Typography>{chatPerson.firstName} {chatPerson.lastName}</Typography>} 
            secondary={<Typography sx={{ color: 'white', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {props.chat?.latestMessage ?  getLatestPrompt() : 'Be the first to drop a message'}
            </Typography>} />
    </ListItem>
}


interface IChatBox{
    chat: IChat
}
const ChatBox = (props:IChatBox) => {
    const [message, setMessage] = React.useState<string>('');
    const router = useRouter()
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const messageContainerRef = React.useRef<HTMLDivElement>()
    React.useEffect(()=>{
        io(BACKEND_URL).on('getMessage', (data: IIncomingMessage)=>{
            if(data.sendTo._id === loggedInUser._id){
                fetchCurrentChatMessages()
            }
            
        })

    }, [])
    const fetchMessages = async () => {
        if(!loggedInUser._id){
            console.log('loggedin user data is not ready yet.')
            return
        }
        try{
            const apiResponse = await fetchChatMessage(props.chat._id)
            if (apiResponse?.status === 200) {
                messageContainerRef.current?.scrollIntoView({ behavior: 'smooth' })
                return apiResponse?.data
            }
        }catch(e){
            console.log('There is some problem while sending message', e)
        }
    }

    const pingMessage = async () => {
        if(!message.trim()){
            Swal.fire(createParamsForInfoToast('info', 'Info', 'Blank message can not be sent'))
              return;
        }
        if(!loggedInUser._id){
            console.log('loggedin user data is not ready yet.')
            return
        }
        try{
            const apiResponse = await sendChatMessage({
                sender: loggedInUser._id,
                content: message,
                chat: props.chat._id
            })
            if (apiResponse?.status === 200) {
                io(BACKEND_URL).emit('sendMessage', {
                    sendTo: props.chat.users.find(user => user._id !== loggedInUser._id),
                    message: apiResponse?.data
                });
                fetchCurrentChatMessages();
                return apiResponse?.data
            }
        }catch(e){
            console.log('There is some problem while sending message', e)
        }
    }

    const {data:messages, refetch:fetchCurrentChatMessages} = useQuery({
        queryFn: () => fetchMessages(),
        queryKey: [QUERY_KEYS.FETCH_MESSAGES],
        enabled: true, // Now it will not immediately call the api when component mount
        refetchOnWindowFocus: false // this feature is really cool if true, browser check with the server if there are any latest data
    })

    const {refetch:sendMessage} = useQuery({
        queryFn: () => pingMessage(),
        queryKey: [QUERY_KEYS.SEND_MESSAGE],
        enabled: false, // Now it will not immediately call the api when component mount
        refetchOnWindowFocus: false // this feature is really cool if true, browser check with the server if there are any latest data
    })

    
    const onKeyPressHandler = (e) => {
        if(e.key === 'Enter'){
            setMessage('')
            sendMessage()  
        }
    }
    return <>
    <Typography variant='h6'>Messages</Typography>
                            <Box>
                                <Box sx={{height: '70vh', overflowY: 'scroll'}} ref={messageContainerRef}>
                                {messages && (messages as IMessage[]).map((msg, index, array) => <React.Fragment key={msg._id} >
                                    <SpeechBubble message={msg} isOwnerMessage={msg.sender._id === loggedInUser._id} />
                                </React.Fragment>)}
                                </Box>
                                    <TextField 
                                    placeholder='Type something or say hello 👋...'
                                    sx={{width: '90%'}}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonSearchIcon />
                                            </InputAdornment>
                                        ),
                                        }} label="" variant="standard" 
                                        onKeyDown={onKeyPressHandler}
                                        onChange={(e)=>setMessage(e.target.value)}
                                        value={message}
                                        />
                                <Button onClick={()=>{
                                     setMessage('')
                                     sendMessage()  
                                }}>Post</Button>
                            </Box>
    </>
}

interface ISpeechBubble{
    message: IMessage,
    isOwnerMessage: boolean
}
const SpeechBubble = ({message, isOwnerMessage}: ISpeechBubble) => {
    return <>
        <Box sx={{float: isOwnerMessage ? 'right' : 'left'}}>
        <Typography variant="caption" display="block" gutterBottom>
        {isOwnerMessage? 'You:' : `${message.sender.firstName} ${message.sender.lastName}`}
        </Typography>
        <Chip
        color={isOwnerMessage ? 'primary' : 'default'} //if loggedinuser
        sx={{
            height: 'auto',
            '& .MuiChip-label': {
            display: 'block',
            whiteSpace: 'normal',
            pt: '0.5px',
            pb: '0.5px'
            },
        }}
        label={message.content}
        />
        </Box>
        <br/><br/><br/>
    </>
}