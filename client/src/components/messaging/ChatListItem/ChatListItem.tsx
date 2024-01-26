import './ChatListItem.scss'
import { IChat, IOwnerData } from "@/Types"
import { StyledBadge } from "@/styled"
import { ListItem, ListItemAvatar, BadgeOwnProps, Avatar, ListItemText, Typography } from "@mui/material"

interface IChatListItem {
    chat: IChat,
    loggedInUser:IOwnerData,
    setActiveChat: React.Dispatch<React.SetStateAction<string | null>>,
    activeChat: string | null,
    isOnline: boolean
}

export const ChatListItem = (props: IChatListItem) => {
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
    return <ListItem className={`chatListItem_wrapper ${props.activeChat === props.chat._id ? 'chatListItem_activeChat' : "#"}`} onClick={()=>{
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