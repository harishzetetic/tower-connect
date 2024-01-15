"use client"
import * as React from 'react';
import { Grid, IconButton, List, ThemeProvider, Typography } from "@mui/material";
import { IChat, IOwnerData } from "@/Types";
import _ from 'lodash'
import {io} from 'socket.io-client'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useSelector } from "react-redux";
import './messaging.css'
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { fetchAllChats } from '@/api/ownerApis';
import SeachOwnerDrawer from './searchOwnerDrawer';
import { BACKEND_URL, QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { HOC } from '@/components/hoc/hoc';
import { ChatBox } from '@/components/messaging/ChatBox';
import { ChatListItem } from '@/components/messaging/ChatListItem';
dayjs.extend(relativeTime)


const Messaging = HOC(({ params }) => {
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);

    const [onlineUsers, setOnlineUsers] = React.useState<string[]>([]);

    React.useEffect(()=>{
        io(BACKEND_URL).on('getOnlineUsers', users => setOnlineUsers(users))
    },[loggedInUser])

    const [toggleSeachOwner, setToggleSearchOwner] = React.useState<boolean>(false)
    const [activeChat, setActiveChat] = React.useState<string | null>(null);
    /* ---------------------------------------------------------------------------------- */
    
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

        return (
            
                  <>
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
                                {myChats && myChats.map(chat => <ChatListItem key={chat._id} chat={chat} loggedInUser={loggedInUser} activeChat={activeChat} setActiveChat={setActiveChat} isOnline={onlineUsers.includes(loggedInUser._id || '')}/>)}
                            </List>
                        </Grid>
                        <Grid item xs={6} md={8}>
                            {activeChat && <ChatBox chat={(myChats as Array<IChat>).find(i=>i._id === activeChat) || {} as IChat}/>}
                        </Grid>
                    </Grid>


                   <SeachOwnerDrawer toggleSeachOwner={toggleSeachOwner} setToggleSearchOwner={setToggleSearchOwner} />

                   </>
        )
})

export default Messaging