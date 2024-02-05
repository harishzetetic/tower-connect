import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, CardHeader, Skeleton, Stack, Box, Button, Backdrop, CircularProgress } from "@mui/material"
import { red } from "@mui/material/colors"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { App, BACKEND_URL } from "@/constants";
import { IBuySell, IOwnerData } from "@/Types";
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import relativeTime from "dayjs/plugin/relativeTime";
import { NextLink } from "@/styled";
import { useSelector } from "react-redux";
dayjs.extend(relativeTime)

interface IBuySellInfoCard {
    data: IBuySell
}
const BuySellInfoCard = (props: IBuySellInfoCard) => {
    const {images, title, price, ownerData, _id, created_at, isSold} = props.data;
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const itemOwner = ownerData && ownerData[0]
    return <Grid item xs={2} sm={4} md={3}>
    <NextLink href={{pathname: `/dashboard/listing/${_id}`}}>
    <Card sx={{ maxWidth: 345, color: 'white', backgroundColor: App.DarkBlue }}>
        <CardActionArea>
        <CardHeader
        subheaderTypographyProps={{sx:{color: 'white'}}}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={`${BACKEND_URL}${itemOwner.imageUrl?.slice(1)}`}>
            {itemOwner?.firstName?.charAt(0)} {itemOwner?.lastName?.charAt(0)}
          </Avatar>
        }

        action={<></>}
        title={`${itemOwner?.firstName} ${itemOwner?.lastName} from ${itemOwner?.towerNumber}-${itemOwner?.flatNumber}`}
        subheader={`Posted on ${dayjs(created_at).fromNow()}`}
      />
            <CardMedia
                component="img"
                height="250"
                image={`${BACKEND_URL}${(images[0] as string)?.substr(1)}`}
                alt="green iguana"
            />
            <CardContent>
                <Typography gutterBottom variant="h6" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>
                    {title}
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                    <Box>
                        {!isSold ? <Typography variant="h5" sx={{color: '#0eb700', fontWeight: 'bold'}}>
                            <CurrencyRupeeIcon sx={{verticalAlign: 'bottom'}}/> {price}
                        </Typography> : <Typography variant="h5" sx={{color: '#cf2069', fontWeight: 'bold'}}>
                            {'SOLD'}
                        </Typography>}
                        
                    </Box>
                    
                    <Box sx={{textAlign: 'right'}}>
                        
                    {(loggedInUser?._id === itemOwner?._id) && <NextLink href={{pathname: `/dashboard/update-listing/${_id}`}}>
                        {/* <Button variant="contained" size="small"></Button> */}
                        <EditIcon />
                     </NextLink>}
                    </Box>
                </Box>
                
                
            </CardContent>
        </CardActionArea>
    </Card>
    </NextLink>
   
    
</Grid>
}

export const LoadingBackDrop = (props: {isLoading: boolean}) => {
    return <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={props.isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
}

export default BuySellInfoCard