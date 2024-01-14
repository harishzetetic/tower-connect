import { IChat, IOwnerData, IIncomingMessage, IMessage } from "@/Types";
import { fetchChatMessage, sendChatMessage } from "@/api/ownerApis";
import { BACKEND_URL, QUERY_KEYS } from "@/constants";
import { createParamsForInfoToast } from "@/util";
import { Typography, Box, TextField, InputAdornment, Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { SpeechBubble } from "./SpeechBubble";
import React from "react";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';


interface IChatBox{
    chat: IChat,
}
export const ChatBox = (props:IChatBox) => {
    const [message, setMessage] = React.useState<string>('');
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const messageContainerRef = React.useRef<HTMLDivElement>()

    React.useEffect(()=>{
        io(BACKEND_URL).on('getMessage', (data: IIncomingMessage)=>{
            if(data.sendTo._id === loggedInUser._id){
                fetchCurrentChatMessages()
            }
        })
    }, [])

    React.useEffect(()=>{
        fetchCurrentChatMessages()
    }, [props.chat._id])
    
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
        enabled: false, // Now it will immediately call the api when component mount
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