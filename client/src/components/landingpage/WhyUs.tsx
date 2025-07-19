import { Container, Typography, Grid, Box, Card, CardContent } from "@mui/material";
import { App } from "@/constants";
import Image from "next/image";

import listeningRental from '../../images/rent.png';
import buySell from '../../images/rupee.png';
import askSociety from '../../images/help.png';

const WhyUs = () => {
    const tiers = [
        {
            title: 'Buy/Sell',
            subheader: 'Anything',
            icon: buySell,
            description: 'We allows you to buy and sell used items with ease. It is a great alternative to yard sales and allows you to earn extra money from the comfort of your home. With a large user base, you are sure to find buyers for your items.',
            buttonVariant: 'outlined',
            stats: '₹50L+ items sold'
        },
        {
            title: 'Ask Society',
            subheader: 'Any Announcements',
            icon: askSociety,
            description: 'Tower Connect allows members to make announcements, ask for help from fellow citizens, and engage in open communication. It is a great way to build trust and establish relationships within your community.',
            buttonVariant: 'contained',
            stats: '10K+ announcements'
        },
        {
            title: 'Listening Rentals',
            subheader: 'Your property',
            icon: listeningRental,
            description: 'Tower Connect allows members to easily create a listing to rent their property. With our mobile-friendly platform, you can manage your rental property from anywhere. Try it out today and streamline your rental process!',
            buttonVariant: 'outlined',
            stats: '1000+ properties'
        },
    ];
    
    return (
        <>
            <Container style={{ backgroundImage: App.BlackGradient, color: "white", paddingBottom: '60px', paddingTop: '60px' }} maxWidth={false}>
                <Box sx={{ mb: 6 }}>
                    <Typography component="h6" variant="h6" align="center" sx={{ mb: 1, opacity: 0.8 }}>
                        TOWER CONNECT
                    </Typography>
                    <Typography component="h2" variant="h3" className='highlight' align="center" sx={{ fontWeight: 700 }}>
                        CORE FEATURES
                    </Typography>
                    <Typography variant="h6" align="center" sx={{ mt: 2, opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
                        Everything you need to build a thriving community
                    </Typography>
                </Box>
                
                <Grid container spacing={4} alignItems="stretch">
                    {tiers.map((tier) => (
                        <Grid item key={tier.title} xs={12} md={4}>
                            <Card sx={{
                                height: '100%',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.2)',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    transition: 'transform 0.3s ease',
                                    boxShadow: 4
                                }
                            }}>
                                <CardContent sx={{ p: 4, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
                                        <Image src={tier.icon} alt={"featuredLogo"} height={80} width={80} style={{ justifyContent: 'center' }} />
                                    </Box>
                                    
                                    <Typography component="h5" variant="h5" align="center" sx={{ fontWeight: 600, mb: 1 }}>
                                        {tier.title}
                                    </Typography>
                                    
                                    <Typography align="center" sx={{ mb: 2, opacity: 0.8, fontSize: '1.1rem' }}>
                                        {tier.subheader}
                                    </Typography>
                                    
                                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6, flex: 1 }}>
                                        {tier.description}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{
                                        color: '#4CAF50',
                                        fontWeight: 600,
                                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        display: 'inline-block'
                                    }}>
                                        {tier.stats}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
};

export default WhyUs;