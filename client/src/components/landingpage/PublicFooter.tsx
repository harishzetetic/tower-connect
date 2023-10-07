import { App } from "@/constants"
import { Box, Typography } from "@mui/material"



const PublicFooter  = () => {
    return <Box sx={{ bgcolor: App.Background, p: 6 }} component="footer">
    <Typography variant="h6" align="center" gutterBottom fontSize={14} color={'white'}>
    Powered by The Luvi's
    </Typography>

  </Box>
}

export default PublicFooter