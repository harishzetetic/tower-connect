import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Avatar, CardHeader, Skeleton, Stack } from "@mui/material"
import { red } from "@mui/material/colors"
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { App, BACKEND_URL } from "@/constants";
import { IBuySell } from "@/Types";
import {default as NextLink} from "next/link";
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)

interface IBuySellInfoCard {
    data: IBuySell
}
const BuySellInfoCard = (props: IBuySellInfoCard) => {
    const {images, title, price, owner, _id, created_at} = props.data;
    return <Grid item xs={2} sm={4} md={3}>
    <NextLink href={{pathname: `/dashboard/listing/${_id}`}}>
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
                <Typography variant="body2" sx={{color: 'white'}}>
                    <CurrencyRupeeIcon sx={{verticalAlign: 'bottom'}}/> {price}
                </Typography>
            </CardContent>
        </CardActionArea>
    </Card>
    </NextLink>
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