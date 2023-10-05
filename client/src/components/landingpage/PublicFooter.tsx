import { Box, Typography } from "@mui/material"


const PublicFooter  = () => {
    return <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
    <Typography variant="h6" align="center" gutterBottom fontSize={14}>
    Powered by The Luvi's
    </Typography>

  </Box>
}

export default PublicFooter