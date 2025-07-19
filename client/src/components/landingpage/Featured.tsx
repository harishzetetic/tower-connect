import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import featuredLogo from '../../images/tower-connect-logo.png';
import Image from "next/image";
import { App } from "@/constants";
import { useRouter } from 'next/navigation';

const Featured = () => {
    const router = useRouter();

    const stats = [
        { number: "500+", label: "Active Societies" },
        { number: "10K+", label: "Happy Residents" },
        { number: "₹50L+", label: "Items Sold" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <Box className='feature_box_wrapper' sx={{ pb: 6 }}>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography align="center" gutterBottom>
                            <Image src={featuredLogo} alt={"featuredLogo"} height={200} width={200} style={{ justifyContent: 'center' }} />
                        </Typography>
                        <Typography align="center" gutterBottom sx={{ color: '#fff', fontSize: '1.1rem', fontWeight: 500 }}>
                            UNLEASH THE REACH OF RESIDENTIALS
                        </Typography>
                        <Typography variant="h2" align="center" paragraph sx={{ color: '#fff', fontWeight: 700 }}>
                            Your Society's Digital Marketplace
                        </Typography>
                        <Typography variant="h4" align="center" paragraph sx={{ color: '#fff', fontWeight: 600 }}>
                            <span className='highlight' id="breathing-text">100% Broker Free</span>
                        </Typography>
                        <Typography variant="h6" align="center" paragraph sx={{ color: '#fff', lineHeight: 1.6 }}>
                            Connect, trade, and grow together in your community. Buy, sell, rent, chat, and manage your society all in one place. 
                            Join thousands of residents who trust Tower Connect for their community needs.
                        </Typography>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                sx={{ 
                                    backgroundColor: '#fff', 
                                    color: App.DarkBlue,
                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                                onClick={() => router.push('/signup/owner')}
                            >
                                Get Started Free
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="large" 
                                sx={{ 
                                    borderColor: '#fff', 
                                    color: '#fff',
                                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }
                                }}
                                onClick={() => router.push('/login/owner')}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Paper elevation={8} sx={{ p: 3, backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                            <Typography variant="h5" align="center" sx={{ color: '#fff', mb: 3 }}>
                                Community Impact
                            </Typography>
                            <Grid container spacing={2}>
                                {stats.map((stat, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Box sx={{ textAlign: 'center', p: 2 }}>
                                            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 700 }}>
                                                {stat.number}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8 }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Featured;