"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, Card, CardContent, Grid, ImageList, ImageListItem, Paper, SvgIconTypeMap, ThemeProvider, Typography } from "@mui/material";
import { pushNotification } from "@/util";
import { SkeletonCard } from "@/components/dashboard/buySellInfoCard";
import Sidebar from "@/components/dashboard/sidebar";
import { APP_THEME, IBuySell, IOwnerData } from "@/Types";
import SellItemWizard from "@/components/dashboard/sellItemWizard";
import { NotificationContainer } from 'react-notifications';
import {  fetchListingById } from "@/api/ownerApis";
import TopNavigation from '@/components/dashboard/topNavigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';
import {  BACKEND_URL, Categories, Condition } from '@/constants';
import { default as NextLink } from "next/link";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import TCConfirm from '@/components/common/TCConfirm';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';

import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { debug } from 'console';
import { useSelector } from 'react-redux';
dayjs.extend(relativeTime)

// dayjs('2019-01-25').fromNow()}

const Listing = ({ params }) => {
    const [listing, setListing] = React.useState<IBuySell | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isContctConfirmOpen, setIsContctConfirmOpen] = React.useState<boolean>(false);
    const [showContactDetails, setShowContactDetails] = React.useState<boolean>(false);
    /* ---------------------------------------------------------------------------------- */
    const router = useRouter()
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [openSellWizard, setOpenSellWizard] = React.useState<boolean>(false);

    const fetchListing = async () => {
        const listingId = params.listing;
        try {
            const apiResponse = await fetchListingById(listingId);
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('token');
                router.push('/login/owner')
            } else {
                setListing(apiResponse?.data)
                setIsLoading(false)
            }

        } catch (e) {
            pushNotification('error', 'Error', 'Error while getting listings from server')
        }
    }

    React.useEffect(() => {
        fetchListing()
    }, []);

    React.useEffect(() => {
        if (!loggedInUser) {
            router.push('/login/owner')
        }
    })
    const getContactDetailsAction = () => {
        setIsContctConfirmOpen(true)
    }
    if (loggedInUser) {
        const itemOwner = listing?.ownerData && listing.ownerData;
        return (<ThemeProvider theme={APP_THEME}>
            <TopNavigation />
            <Sidebar loggedInUser={loggedInUser} setOpenSellWizard={setOpenSellWizard} />
            <Toolbar />
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={6} md={2}></Grid>
                <Grid item xs={6} md={10}>
                    {isLoading && <SkeletonCard />}
                    {!isLoading && listing && <>
                        &nbsp;&nbsp;
                        <Typography variant='h3' sx={{fontWeight: 'bold'}}><Button variant="text"><NextLink href={{ pathname: `/dashboard/` }}><ArrowBackIcon fontSize='large' /></NextLink></Button>  {listing.title} 
                            {!listing.isSold && <Button sx={{float: 'right'}}size="large" variant="contained" onClick={getContactDetailsAction}><LocalPhoneIcon /> Get Contact Details</Button>}
                        </Typography>
                        <Typography variant='h6'>{`By ${itemOwner?.firstName} ${itemOwner?.lastName} from ${itemOwner?.towerNumber}-${itemOwner?.flatNumber} on ${dayjs(listing?.created_at).fromNow()}`}  </Typography>
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
                                <CardBox title="Price" value={listing.isSold ? 'SOLD' : parseInt(listing.price || '0').toFixed(2)}  priceFormat={!!(!listing.isSold)}/>
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <CardBox title="Condition" value={listing.condition} showIcon />
                            </Grid>
                            <Grid item xs={6} md={4}>
                                <CardBox title="Category" value={listing.category} />
                            </Grid>

                        </Grid>
                        <Paper sx={{mt:2, p:2}}>
                        <Typography variant='h5'><strong>Description</strong></Typography>
                        <Typography variant='h6'>{` ${listing.description} `}  </Typography>

                        </Paper>
                        

                    </>}
                </Grid>
            </Grid>
            <SellItemWizard openSellWizard={openSellWizard} setOpenSellWizard={setOpenSellWizard} pushNotification={pushNotification} />
            <TCConfirm successBtnTitle='Show me the details' open={isContctConfirmOpen} handleClose={()=>{setIsContctConfirmOpen(false)}} handleConfirm={()=>{setIsContctConfirmOpen(false); setShowContactDetails(true)}} title={"Information"} description={"By this action we will let this product owner know that you have viewed the contact information for this product. Please confirm to view the contact details. "} />
            <TCConfirm successBtnTitle='Ok' hideCancel open={showContactDetails} handleClose={()=>{setShowContactDetails(false)}} handleConfirm={()=>{setShowContactDetails(false)}} title={"Contact Details"} description={<><strong>Phone Number:</strong> {itemOwner?.phone} <br/> <strong>Email:</strong> {itemOwner?.email}</>} />
        </ThemeProvider>)
    }
    return <>User probably not logged in. Kindly login again.</>

}
interface ICardBox {
    title: string;
    value: string | null | undefined;
    priceFormat?: boolean;
    showIcon?:boolean;
}
const CardBox = (props: ICardBox) => {
    const {title, value, priceFormat, showIcon} = props;

    const getValue = (title, value) => {
        switch(title){
            case 'Condition': 
                return Condition.find(item => item.value === value)?.label;
            case 'Category':
                return Categories.find(item => item.value === value)?.label;
        }
        return value
    }
    const getIcon = () => {
        if(showIcon){
            switch(value){
                case 'new':
                   return <ChildCareIcon />
                case 'like-new':
                  return <PersonIcon />
                case 'old':
                    return <ElderlyWomanIcon/>
            }
        }
        return <></>
    }
    return <Card variant="outlined">
    <CardContent>
        <Typography variant='h5' gutterBottom>{title}</Typography>
        <Typography variant='h4' sx={{ color: priceFormat ? 'green' : '' }}> <strong>{priceFormat ? <CurrencyRupeeIcon/> : '' } {getIcon()} {getValue(title, value)}</strong> </Typography>
    </CardContent>
</Card>
}

export default Listing