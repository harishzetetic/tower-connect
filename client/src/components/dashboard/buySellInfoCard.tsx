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
    <Card sx={{
        maxWidth: 345,
        color: 'white',
        background: 'rgba(30, 34, 44, 0.98)',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(20, 26, 31, 0.18)',
        transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)',
        '&:hover': {
            transform: 'translateY(-8px) scale(1.03)',
            boxShadow: '0 8px 32px 0 rgba(33, 150, 243, 0.18)',
        },
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(76,175,80,0.08)'
    }}>
        <CardActionArea sx={{ borderRadius: 4 }}>
        <CardHeader
        subheaderTypographyProps={{sx:{color: '#b0b8c9', fontWeight: 500}}}
        avatar={
          <Avatar sx={{ bgcolor: red[500], width: 54, height: 54, fontWeight: 700, fontSize: 22, boxShadow: '0 2px 8px 0 rgba(20, 26, 31, 0.18)' }} aria-label="recipe" src={`${BACKEND_URL}${itemOwner.imageUrl?.slice(1)}`}>
            {itemOwner?.firstName?.charAt(0)}{itemOwner?.lastName?.charAt(0)}
          </Avatar>
        }
        action={<></>}
        title={<Typography sx={{ fontWeight: 700, color: 'white', fontSize: 17 }}>{`${itemOwner?.firstName} ${itemOwner?.lastName}`}</Typography>}
        subheader={<>
            <span style={{ color: '#4CAF50', fontWeight: 600 }}>{itemOwner?.towerNumber}-{itemOwner?.flatNumber}</span>
            <span style={{ color: '#b0b8c9', marginLeft: 8 }}>{`• Posted ${dayjs(created_at).fromNow()}`}</span>
        </>}
      />
            <CardMedia
                component="img"
                height="220"
                image={`${BACKEND_URL}${(images[0] as string)?.substr(1)}`}
                alt="listing image"
                sx={{
                    borderRadius: 3,
                    boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
                    objectFit: 'cover',
                    mt: 1
                }}
            />
            <CardContent>
                <Typography gutterBottom variant="h6" sx={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontWeight: 700, color: 'white', fontSize: 18 }}>
                    {title}
                </Typography>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box>
                        {!isSold ? <Typography variant="h5" sx={{color: '#4CAF50', fontWeight: 'bold', fontSize: 22}}>
                            <CurrencyRupeeIcon sx={{verticalAlign: 'bottom', color: '#4CAF50', fontSize: 22}}/> {price}
                        </Typography> : <Typography variant="h5" sx={{color: '#cf2069', fontWeight: 'bold', fontSize: 22}}>
                            {'SOLD'}
                        </Typography>}
                    </Box>
                    <Box sx={{textAlign: 'right'}}>
                        {(loggedInUser?._id === itemOwner?._id) && <NextLink href={{pathname: `/dashboard/update-listing/${_id}`}}>
                            <EditIcon sx={{ color: '#2196F3', fontSize: 24, transition: 'color 0.2s', '&:hover': { color: '#4CAF50' } }} />
                        </NextLink>}
                    </Box>
                </Box>
            </CardContent>
        </CardActionArea>
    </Card>
    </NextLink>
</Grid>
}

export default BuySellInfoCard