import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, CardHeader, IconButton } from "@mui/material"
import { red } from "@mui/material/colors"
import bullet from '../../images/bullet.jpeg';



const BuySellInfoCard = () => {
    console.log(bullet)
    return <Grid item xs={2} sm={4} md={3}>
    <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
        <CardHeader
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
                height="150"
                image={bullet.src}
                alt="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h6">
                    Bullet 350 Classic
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    INR 34000.00
                </Typography>
               
            </CardContent>
        </CardActionArea>
    </Card>
</Grid>
}


export default BuySellInfoCard