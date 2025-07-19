import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { App } from "@/constants";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import SecurityIcon from '@mui/icons-material/Security';

const Features = () => {
    const features = [
        {
            icon: <ShoppingCartIcon sx={{ fontSize: 50, color: App.DarkBlue }} />,
            title: "Buy & Sell Marketplace",
            description: "List items for sale or find great deals from your neighbors. Furniture, electronics, books, and more - all verified and safe.",
            stats: "₹50L+ items sold"
        },
        {
            icon: <HomeIcon sx={{ fontSize: 50, color: App.DarkBlue }} />,
            title: "Property Rentals",
            description: "Find or list rental properties within your society. Direct owner-tenant communication with no brokerage fees.",
            stats: "1000+ properties listed"
        },
        {
            icon: <ChatIcon sx={{ fontSize: 50, color: App.DarkBlue }} />,
            title: "Community Chat",
            description: "Stay connected with your neighbors through secure messaging. Share updates, ask questions, and build relationships.",
            stats: "10K+ active chats"
        },
        {
            icon: <BusinessIcon sx={{ fontSize: 50, color: App.DarkBlue }} />,
            title: "Business Listings",
            description: "Showcase your home-based business to your community. Perfect for home chefs, tutors, and service providers.",
            stats: "500+ businesses listed"
        },
        {
            icon: <AnnouncementIcon sx={{ fontSize: 50, color: App.DarkBlue }} />,
            title: "Society Announcements",
            description: "Post and view important society announcements, maintenance updates, and community events in real-time.",
            stats: "24/7 communication"
        },
        {
            icon: <SecurityIcon sx={{ fontSize: 50, color: App.DarkBlue }} />,
            title: "Verified Community",
            description: "All users are verified society residents. Safe, secure, and trusted transactions within your community.",
            stats: "100% verified users"
        }
    ];

    return (
        <Box sx={{ py: 8 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                    Everything Your Society Needs
                </Typography>
                <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 6 }}>
                    One platform for all your community needs
                </Typography>
                
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={6} lg={4} key={index}>
                            <Card elevation={2} sx={{ 
                                height: '100%', 
                                '&:hover': { 
                                    transform: 'translateY(-8px)', 
                                    transition: 'transform 0.3s ease',
                                    boxShadow: 4
                                } 
                            }}>
                                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                                    <Box sx={{ mb: 3 }}>
                                        {feature.icon}
                                    </Box>
                                    
                                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                        {feature.title}
                                    </Typography>
                                    
                                    <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.6 }}>
                                        {feature.description}
                                    </Typography>
                                    
                                    <Typography variant="body2" sx={{ 
                                        color: App.DarkBlue, 
                                        fontWeight: 600,
                                        backgroundColor: 'rgba(20, 26, 31, 0.1)',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        display: 'inline-block'
                                    }}>
                                        {feature.stats}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default Features; 