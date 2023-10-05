import { Box, Container, Typography } from "@mui/material";


import featuredLogo from '../../images/featured_logo.png';
import Image from "next/image";


const Featured = () => {
  console.log(featuredLogo)
    return <Box className='feature_box_wrapper' sx={{pt: 12, pb: 6}}>
    <Container maxWidth="md">
      <Typography align="center" gutterBottom>
        UNLEASH THE REACH OF RESIDENTIALS
      </Typography>
      <Typography variant="h3" align="center" paragraph>
        Introducing the web app for <span className='highlight'>Supertech Eco Village 1</span>
      </Typography>
      <Typography variant="subtitle1" align="center" paragraph>
      a platform designed exclusively for residents and tenants. With this app, you can easily post buy/sell listings, make announcements, connect with other residents, and even showcase your businesses.
      </Typography>

    </Container>
   
  </Box>
}

export default Featured;