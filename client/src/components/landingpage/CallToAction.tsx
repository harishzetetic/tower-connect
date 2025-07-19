import { Box, Container, Typography, Button, Grid, Paper } from "@mui/material";
import { App } from "@/constants";
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CallToAction = () => {
    const router = useRouter();

    const benefits = [
        "✓ No brokerage fees",
        "✓ Verified community members",
        "✓ Secure messaging",
        "✓ 24/7 support"
    ];

    return (
        <Box sx={{ 
            py: 8, 
            background: App.BlackGradient,
            color: 'white'
        }}>
            <Container maxWidth="lg">
                <Grid container spacing={6} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                            Ready to Transform Your Society?
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
                            Join thousands of residents who are already using Tower Connect to build stronger, more connected communities.
                        </Typography>
                        
                        <Box sx={{ mb: 4 }}>
                            {benefits.map((benefit, index) => (
                                <Typography key={index} variant="body1" sx={{ mb: 1, opacity: 0.9 }}>
                                    {benefit}
                                </Typography>
                            ))}
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button 
                                variant="contained" 
                                size="large" 
                                endIcon={<ArrowForwardIcon />}
                                sx={{ 
                                    backgroundColor: '#fff', 
                                    color: App.DarkBlue,
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { backgroundColor: '#f5f5f5' }
                                }}
                                onClick={() => router.push('/signup/owner')}
                            >
                                Start Free Today
                            </Button>
                            <Button 
                                variant="outlined" 
                                size="large"
                                sx={{ 
                                    borderColor: '#fff', 
                                    color: '#fff',
                                    px: 4,
                                    py: 1.5,
                                    '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.1)' }
                                }}
                                onClick={() => router.push('/login/owner')}
                            >
                                Sign In
                            </Button>
                        </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                        <Paper elevation={8} sx={{ 
                            p: 4, 
                            backgroundColor: 'rgba(255,255,255,0.1)', 
                            backdropFilter: 'blur(10px)', 
                            border: '1px solid rgba(255,255,255,0.2)',
                            textAlign: 'center'
                        }}>
                            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                                Get Started in Minutes
                            </Typography>
                            
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h2" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                                    ₹0
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.8 }}>
                                    Setup Fee
                                </Typography>
                            </Box>
                            
                            <Box sx={{ textAlign: 'left' }}>
                                <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    ✓ <span style={{ marginLeft: 8 }}>Free registration</span>
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    ✓ <span style={{ marginLeft: 8 }}>Unlimited listings</span>
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    ✓ <span style={{ marginLeft: 8 }}>Community chat</span>
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                                    ✓ <span style={{ marginLeft: 8 }}>Society management</span>
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default CallToAction; 