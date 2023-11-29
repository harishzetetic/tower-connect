import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, CardHeader, IconButton } from "@mui/material"
import { red } from "@mui/material/colors"
import bullet from '../../images/bullet.jpeg';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { App } from "@/constants";

// Figma: https://www.figma.com/file/3YshaQtivDp7lf7G1DwaGd/Real-estate-dashboard-design-(Community)?type=design&node-id=701-10&mode=design&t=f9SpyRzgldCb8QMx-0

const BuySellInfoCard = () => {
    return <Grid item xs={2} sm={4} md={3}>
    <Card sx={{ maxWidth: 345, color: 'white', backgroundColor: App.DarkBlue }}>
        <CardActionArea>
        <CardHeader
        subheaderTypographyProps={{sx:{color: 'white'}}}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            HS
          </Avatar>
        }
        action={<></>}
        title="Harish Sharma from A3-1001"
        subheader="Posted 3 days ago"
      />
            <CardMedia
                component="img"
                height="250"
                image={bullet.src}
                alt="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h6">
                    Bullet 350 Classic
                </Typography>
                <Typography variant="body2" sx={{color: 'white'}}>
                    <CurrencyRupeeIcon sx={{verticalAlign: 'bottom'}}/> 34000.00
                </Typography>
               
            </CardContent>
        </CardActionArea>
    </Card>
</Grid>
}


export default BuySellInfoCard