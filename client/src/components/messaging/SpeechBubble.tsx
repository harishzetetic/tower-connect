import { IMessage } from "@/Types"
import { Box, Typography, Chip, Tooltip } from "@mui/material"
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)

interface ISpeechBubble{
    message: IMessage,
    isOwnerMessage: boolean
}
export const SpeechBubble = ({message, isOwnerMessage}: ISpeechBubble) => {
    return <>
        <Box sx={{float: isOwnerMessage ? 'right' : 'left'}}>
        <Typography variant="caption" display="block" gutterBottom>
        {isOwnerMessage? 'You:' : `${message.sender.firstName} ${message.sender.lastName}`}
        </Typography>
        <Tooltip title={dayjs(message.createdAt).fromNow()}>
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
        </Tooltip>
        
        </Box>
        <br/><br/><br/>
    </>
}