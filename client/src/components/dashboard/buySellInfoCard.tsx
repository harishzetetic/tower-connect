import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, CardHeader, Skeleton, Stack, Fab, Box, Button } from "@mui/material"
import { red } from "@mui/material/colors"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { App, BACKEND_URL } from "@/constants";
import { IBuySell } from "@/Types";
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import VisibilityIcon from '@mui/icons-material/Visibility';
import relativeTime from "dayjs/plugin/relativeTime";
import { NextLink } from "@/styled";
import { getLoggedInUserData } from "@/util";
dayjs.extend(relativeTime)

interface IBuySellInfoCard {
    data: IBuySell
}
const BuySellInfoCard = (props: IBuySellInfoCard) => {
    const {images, title, price, owner, _id, created_at, isSold} = props.data;
    const loggedUser = getLoggedInUserData()
    return <Grid item xs={2} sm={4} md={3}>
    
    <Card sx={{ maxWidth: 345, color: 'white', backgroundColor: App.DarkBlue }}>
        <CardActionArea>
        <CardHeader
        subheaderTypographyProps={{sx:{color: 'white'}}}
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            {owner?.firstName?.charAt(0)} {owner?.lastName?.charAt(0)}
          </Avatar>
        }
        action={<></>}
        title={`${owner?.firstName} ${owner?.lastName} from ${owner?.towerNumber}-${owner?.flatNumber}`}
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
                        <NextLink href={{pathname: `/dashboard/listing/${_id}`}}>
                        <Button color='secondary' variant="contained" size="small">
                            <VisibilityIcon />
                        </Button>
                    </NextLink> &nbsp;
                    {(loggedUser?.user._id === owner?._id) && <NextLink href={{pathname: `/dashboard/update-listing/${_id}`}}><Button variant="contained" size="small">
                        <EditIcon />
                    </Button> </NextLink>}

                    
                        
                    </Box>
                </Box>
                
                
            </CardContent>
        </CardActionArea>
    </Card>
    
</Grid>
}

export const SkeletonCard = () => {
    return <Grid item xs={2} sm={4} md={3}> <Card >
        <CardActionArea>
            <CardContent>
                <Stack spacing={1}>
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                    <Skeleton variant="rectangular" height={60} />
                    <Skeleton variant="rounded" height={60} />
                    <Skeleton variant="rounded" height={60} />
                    <Skeleton variant="rounded" height={60} />
                    <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                </Stack>
            </CardContent>
        </CardActionArea>
    </Card> </Grid>
}

export default BuySellInfoCard