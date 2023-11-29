import { Box, Container, Typography } from "@mui/material";


import featuredLogo from '../../images/tower-connect-logo.png';
import Image from "next/image";


const Featured = () => {
    return <Box className='feature_box_wrapper' sx={{pb: 6}}>
    <Container maxWidth="md">
      
      <Typography align="center" gutterBottom>
      <Image src={featuredLogo} alt={"featuredLogo"} height={250} width={250} style={{justifyContent: 'center'}}/>
      </Typography>
      <Typography align="center" gutterBottom>
        UNLEASH THE REACH OF RESIDENTIALS
      </Typography>
      <Typography variant="h2" align="center" paragraph>
        Introducing the web app for societies <span className='highlight'>100% Broker Free</span>
      </Typography>
      <Typography variant="h6" align="center" paragraph>
      a platform designed exclusively for residents and tenants. With this app, you can easily post buy/sell listings, make announcements, connect with other residents, and even showcase your businesses.
      </Typography>

    </Container>
   
  </Box>
}

export default Featured;