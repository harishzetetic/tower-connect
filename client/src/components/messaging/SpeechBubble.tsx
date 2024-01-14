import { IMessage } from "@/Types"
import { Box, Typography, Chip } from "@mui/material"

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