import { Box, Container, Typography, Grid, Card, CardContent, Avatar, Rating } from "@mui/material";
import { App } from "@/constants";

const Testimonials = () => {
    const testimonials = [
        {
            name: "Priya Sharma",
            role: "Resident, Green Valley Society",
            rating: 5,
            content: "Tower Connect has transformed how we interact in our society. I sold my old furniture within hours and found a reliable tenant for my apartment. The community chat feature keeps everyone connected!"
        },
        {
            name: "Rajesh Kumar",
            role: "Society Secretary, Sunshine Towers",
            rating: 5,
            content: "As a society secretary, managing announcements and complaints was a nightmare. Tower Connect streamlined everything. Now residents can directly post issues and we can track them efficiently."
        },
        {
            name: "Meera Patel",
            role: "Business Owner, Royal Heights",
            rating: 5,
            content: "I started my home bakery business through Tower Connect. The platform helped me reach my neighbors directly. Now I have regular customers from my own society!"
        },
        {
            name: "Amit Singh",
            role: "Tenant, Lake View Apartments",
            rating: 5,
            content: "Found my perfect rental through Tower Connect. The verification system gave me confidence, and the chat feature helped me connect with the owner before moving in."
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
            <Container maxWidth="lg">
                <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 700, mb: 1 }}>
                    What Our Residents Say
                </Typography>
                <Typography variant="h6" align="center" sx={{ color: 'text.secondary', mb: 6 }}>
                    Join thousands of satisfied residents who trust Tower Connect
                </Typography>
                
                <Grid container spacing={4}>
                    {testimonials.map((testimonial, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Card elevation={3} sx={{ height: '100%', '&:hover': { transform: 'translateY(-4px)', transition: 'transform 0.3s ease' } }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: App.DarkBlue, mr: 2 }}>
                                            {testimonial.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {testimonial.role}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                                    
                                    <Typography variant="body1" sx={{ lineHeight: 1.6, fontStyle: 'italic' }}>
                                        "{testimonial.content}"
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

export default Testimonials; 