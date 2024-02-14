"use client"
import * as React from 'react';
import { red } from "@mui/material/colors"
import { Avatar, Box, Button, Card, CardContent, Grid, ImageList, ImageListItem, InputAdornment, Paper, TextField, ThemeProvider, Typography } from "@mui/material";
import { IBuySell, IOwnerData } from "@/Types";
import {  fetchListingById } from "@/api/ownerApis";
import { useRouter } from 'next/navigation';
import {  BACKEND_URL } from '@/constants';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import { LoadingBackDrop } from '@/components/dashboard/buySellInfoCard';
dayjs.extend(relativeTime)


const Announcement = HOC(({ params }) => {
    const [listing, setListing] = React.useState<IBuySell | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    /* ---------------------------------------------------------------------------------- */
    const router = useRouter()
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);

    const fetchListing = async () => {
        const listingId = params.listing;
        try {
            const apiResponse = await fetchListingById(listingId);
            if (apiResponse?.status === 200) {
                setListing(apiResponse?.data)
                console.log(apiResponse?.data)
                setIsLoading(false)
            } 

        } catch (e) {
            Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting listings from server'))
        }
    }

    React.useEffect(() => {
        fetchListing()
    }, []);

        return (<>
                    <LoadingBackDrop isLoading={isLoading}/>
                    <Grid container>
                        <Grid item xs={12} sm={12} md={8}>
                            <TextField 
                                placeholder={`Hi ${loggedInUser.firstName}, Type your message for your society...`}
                                hiddenLabel
                                multiline
                                rows={4}
                                InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start" sx={{alignItems: 'self-end'}}>
                                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={`${BACKEND_URL}${loggedInUser.imageUrl?.slice(1)}`}>
                                                {loggedInUser?.firstName?.charAt(0)} {loggedInUser?.lastName?.charAt(0)}
                                            </Avatar>
                                      </InputAdornment>
                                    ),
                                  }}
                            fullWidth/>
                            <Box sx={{display: 'flex', justifyContent: 'space-between', mt: 2}}>
                                <Typography>0/250 characters</Typography>
                                <Button variant="contained">Post</Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4}></Grid>
                       
                    </Grid>
          
        </>   
        )
  

})
interface ICardBox {
    title: string;
    value: string | null | undefined;
    priceFormat?: true;
}
const CardBox = (props: ICardBox) => {
    const {title, value, priceFormat} = props;
    return <Card variant="outlined">
    <CardContent>
        <Typography variant='h5' gutterBottom>{title}</Typography>
        <Typography variant='h4' sx={{ color: priceFormat ? 'green' : '' }}> <strong>{priceFormat ? <CurrencyRupeeIcon/> : '' } {value}</strong> </Typography>
    </CardContent>
</Card>
}

export default Announcement