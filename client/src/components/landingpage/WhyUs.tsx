import { Container, Typography, Grid, Card, CardHeader, CardContent, Box, CardActions, Button } from "@mui/material";
import StarIcon from '@mui/icons-material/StarBorder';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { App } from "@/constants";
import Image from "next/image";

import listeningRental from '../../images/rent.png';
import buySell from '../../images/rupee.png';
import askSociety from '../../images/help.png';


const WhyUs  = () => {
    const tiers = [
        {
          title: 'Buy/Sell',
          subheader: 'Anything',
          icon: buySell,
          description: 'We allows you to buy and sell used items with ease. It is a great alternative to yard sales and allows you to earn extra money from the comfort of your home. With a large user base, you are sure to find buyers for your items. ',
          buttonVariant: 'outlined',
        },
        {
          title: 'Ask Society',
          subheader: 'Any Announcements',
          icon: askSociety,
          description: 'Tower Connect allows members to make announcements, ask for help from fellow citizens, and engage in open communication. It is a great way to build trust and establish relationships within your community. ',
          buttonVariant: 'contained',
        },
        {
          title: 'Listening Rentals',
          subheader: 'Your property',
          icon: listeningRental,
          description: 'Tower Connect allows members to easily create a listing to rent their property. With our mobile-friendly platform, you can manage your rental property from anywhere. Try it out today and streamline your rental process!',
          buttonVariant: 'outlined',
        },
       
        
      ];
    return <>
      <Container style={{backgroundImage: App.BlackGradient, color:"white", paddingBottom: '20px'}} maxWidth={false}>
        <Grid container spacing={5} alignItems="flex-end">
          <Grid item xs={12} md={3} >
            <Typography component="h6" variant="h6" align="right">TOWER CONNECT</Typography>
            <Typography component="h2" variant="h3" className='highlight' align="right">FEATURES</Typography>
          </Grid>
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={tier.title} xs={12} md={3}>
                  <Box sx={{display: 'flex', justifyContent: 'center',alignItems: 'center',mb: 2,}}>
                    <Typography component="h2" variant="h3">
                      <Image src={tier.icon} alt={"featuredLogo"} height={80} width={80} style={{justifyContent: 'center'}}/>
                    </Typography>
                  </Box>
                  <Typography component="h6" variant="h6" align="center">{tier.title}</Typography>
                  <Typography align="center">{tier.subheader}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
}

export default WhyUs;