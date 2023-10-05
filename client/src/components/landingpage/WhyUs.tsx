import { Container, Typography, Grid, Card, CardHeader, CardContent, Box, CardActions, Button } from "@mui/material";
import StarIcon from '@mui/icons-material/StarBorder';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ApartmentIcon from '@mui/icons-material/Apartment';
import { App } from "@/constants";


const WhyUs  = () => {
    const tiers = [
        {
          title: 'Buy/Sell',
          subheader: 'Anything',
          icon: CurrencyRupeeIcon,
          description: 'We allows you to buy and sell used items with ease. It is a great alternative to yard sales and allows you to earn extra money from the comfort of your home. With a large user base, you are sure to find buyers for your items. ',
          buttonVariant: 'outlined',
        },
        {
          title: 'Ask Society',
          subheader: 'Any Announcements',
          icon: SupervisorAccountIcon,
          description: 'Tower Connect allows members to make announcements, ask for help from fellow citizens, and engage in open communication. It is a great way to build trust and establish relationships within your community. ',
          buttonVariant: 'contained',
        },
        {
          title: 'Listening Rentals',
          subheader: 'Your property',
          icon: ApartmentIcon,
          description: 'Tower Connect allows members to easily create a listing to rent their property. With our mobile-friendly platform, you can manage your rental property from anywhere. Try it out today and streamline your rental process!',
          buttonVariant: 'outlined',
        },
        
      ];
    return <>
        <Container disableGutters maxWidth="sm" component="main">
        <Typography component="h1" variant="h3" align="center" color="text.primary" gutterBottom sx={{ mb: 5 }} className='app_title'>
              Why Tower Connect?
            </Typography>
     
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === 'Enterprise' ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: 'center' }}
                  action={tier.title === 'Pro' ? <StarIcon /> : null}
                  subheaderTypographyProps={{
                    align: 'center',
                    color: App.White
                  }}
                  
                  style={{background: App.Background, color: App.White}}
                />
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'baseline',
                      mb: 2,
                    }}
                  >
                    <Box style={{background: App.Background, borderRadius: '50%', color: App.White, width: '100px', height:'100px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <Typography component="h2" variant="h3">
                      <tier.icon style={{fontSize: '80px'}}/> 
                    </Typography>
                    </Box>
                    
                  </Box>
                  <Typography paragraph component="h6" variant="h6" fontSize={14}> {tier.description}</Typography>
                 
                </CardContent>
                <CardActions>
                  
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
}

export default WhyUs;