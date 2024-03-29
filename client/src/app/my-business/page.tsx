"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, Card, CardContent, Grid, ImageList, ImageListItem, Paper, Typography } from "@mui/material";
import {  IBuySell, IOwnerData } from "@/Types";
import {  fetchListingById } from "@/api/ownerApis";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {  BACKEND_URL, Categories, Condition } from '@/constants';
import { default as NextLink } from "next/link";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import TCConfirm from '@/components/common/TCConfirm';

import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import LoadingBackDrop from '@/components/common/LoadingBackDrop';
dayjs.extend(relativeTime)


const MyBusiness = HOC(({ params }) => {
    const [listing, setListing] = React.useState<IBuySell | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isContctConfirmOpen, setIsContctConfirmOpen] = React.useState<boolean>(false);
    const [showContactDetails, setShowContactDetails] = React.useState<boolean>(false);
    /* ---------------------------------------------------------------------------------- */
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

    const getContactDetailsAction = () => {
        setIsContctConfirmOpen(true)
    }
        return (<>
                    <LoadingBackDrop isLoading={isLoading} />
                    <h1>This is the my-business</h1>
                    {!isLoading && listing && <>
                        &nbsp;&nbsp;<Typography variant='h3' sx={{fontWeight: 'bold'}}><Button variant="text"><NextLink href={{ pathname: `/dashboard/` }}><ArrowBackIcon fontSize='large' /></NextLink></Button>  {listing.title} <Button sx={{float: 'right'}}size="large" variant="contained" onClick={getContactDetailsAction}><LocalPhoneIcon /> Get Contact Details</Button></Typography>
                        <Typography variant='h6'>{`By ${listing.ownerData?.firstName} ${listing.ownerData?.lastName} from ${listing.ownerData?.towerNumber}-${listing.ownerData?.flatNumber} on ${dayjs(listing?.created_at).fromNow()}`}  </Typography>
                        
                        <Box sx={{ display: 'inline-block', mt:2 }}>
                            <ImageList sx={{ width: 'auto', height: 'auto' }} cols={4} rowHeight={164}>
                                {
                                    listing.images.map((item, index) => (
                                        <ImageListItem key={index}>
                                            <img
                                                // srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                                src={`${BACKEND_URL}${item?.slice(1)}`}
                                                alt={`image${index + 1}`}
                                                loading="lazy"
                                            />
                                        </ImageListItem>
                                    ))
                                }
                            </ImageList>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={6} md={4}>
                                <CardBox title="Price" value={parseInt(listing.price || '0').toFixed(2)} priceFormat/>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <CardBox title="Condition" value={Condition.find(item => item.value === listing.condition)?.label } />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <CardBox title="Category" value={Categories.find(item => item.value === listing.category)?.label} />
                            </Grid>

                        </Grid>
                        <Paper sx={{mt:2, p:2}}>
                        <Typography variant='h5'><strong>Description</strong></Typography>
                        <Typography variant='h6'>{` ${listing.description} `}  </Typography>

                        </Paper>
                        

                    </>}
            <TCConfirm successBtnTitle='Show me the details' open={isContctConfirmOpen} handleClose={()=>{setIsContctConfirmOpen(false)}} handleConfirm={()=>{setIsContctConfirmOpen(false); setShowContactDetails(true)}} title={"Information"} description={"By this action we will let this product owner know that you have viewed the contact information for this product. Please confirm to view the contact details. "} />
            <TCConfirm successBtnTitle='Ok' hideCancel open={showContactDetails} handleClose={()=>{setShowContactDetails(false)}} handleConfirm={()=>{setShowContactDetails(false)}} title={"Contact Details"} description={<><strong>Phone Number:</strong> {listing?.ownerData?.phone} <br/> <strong>Email:</strong> {listing?.ownerData?.email}</>} />
            </>)                                


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

export default MyBusiness