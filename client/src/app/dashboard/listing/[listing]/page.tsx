"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, Card, CardContent, Grid, ImageList, ImageListItem, Paper, Typography } from "@mui/material";
import { IBuySell, IOwnerData } from "@/Types";
import {  accessChatWith, fetchListingById } from "@/api/ownerApis";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {  BACKEND_URL, Categories, Condition, QUERY_KEYS } from '@/constants';
import { default as NextLink } from "next/link";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TCConfirm from '@/components/common/TCConfirm';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';
import MessageIcon from '@mui/icons-material/Message';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'
import LoadingBackDrop from '@/components/common/LoadingBackDrop';
dayjs.extend(relativeTime)

// dayjs('2019-01-25').fromNow()}

const Listing = HOC(({ params }) => {
    const router = useRouter()
    const forwardToMessagingRef = React.useRef<HTMLElement>(null)
    const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [listing, setListing] = React.useState<IBuySell | null>(null)
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isContctConfirmOpen, setIsContctConfirmOpen] = React.useState<boolean>(false);
    const [showContactDetails, setShowContactDetails] = React.useState<boolean>(false);
    /* ---------------------------------------------------------------------------------- */
    const {refetch:accessChat  } = useQuery({
        queryFn: () => startAChatWith(),
        queryKey: [QUERY_KEYS.CREATE_ACCESS_CHAT],
        enabled: false, // Now it will not immediately call the api when component mount
    })

    const startAChatWith = async () => {
        try{
            if(listing?.ownerData?._id){
                const apiResponse = await accessChatWith(listing?.ownerData?._id)
                if (apiResponse?.status === 200) {
                    return apiResponse?.data
                }
            } 
        }catch(e){
            Swal.fire(createParamsForInfoToast('error', 'Error', 'Getting issues while setting up the chat'))
        }
    }
    
    const fetchListing = async () => {
        const listingId = params.listing;
        try {
            const apiResponse = await fetchListingById(listingId);
            if (apiResponse?.status === 200) {
                setListing(apiResponse?.data)
                setIsLoading(false)
            }

        } catch (e) {
            Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting listings from server'))
        }
    }


    const creatMessageThenRedirect = () => {
        Swal.fire(createParamsForInfoToast('info', '', 'Setting up your chat and redirecting...'))
        accessChat().then((result)=>{
            if(result.data._id){
                router.push(`/messaging?activeChat=${result.data._id}`)
            }
        })
    }

    const shouldMessageBtnDisplay = () => {
            if(loggedInUser._id === listing?.ownerData?._id){
                return false
            } else if(listing?.isSold){
                return false
            }
            return true
    }
        const itemOwner = listing?.ownerData && listing.ownerData;

        React.useEffect(() => {
            fetchListing()
        }, []);

        return (<>
                    <LoadingBackDrop isLoading={isLoading} />
                    {!isLoading && listing && <>
                        &nbsp;&nbsp;
                        <Typography variant='h3' sx={{fontWeight: 'bold'}}><Button variant="text"><NextLink href={{ pathname: `/dashboard/` }}><ArrowBackIcon fontSize='large' /></NextLink></Button>  {listing.title} 
                            {shouldMessageBtnDisplay() && <Button sx={{float: 'right'}} size="large" variant="contained" onClick={creatMessageThenRedirect}><MessageIcon /> &nbsp; Message to owner</Button>}
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
                        
                        <NextLink style={{display: 'none'}} href={{pathname: '/messaging',
                            query: {activeChat: 'MUST_BE_FILL'}}}><Typography ref={forwardToMessagingRef}>Hidden</Typography></NextLink>

                    </>}
            <TCConfirm successBtnTitle='Show me the details' open={isContctConfirmOpen} handleClose={()=>{setIsContctConfirmOpen(false)}} handleConfirm={()=>{setIsContctConfirmOpen(false); setShowContactDetails(true)}} title={"Information"} description={"By this action we will let this product owner know that you have viewed the contact information for this product. Please confirm to view the contact details. "} />
            <TCConfirm successBtnTitle='Ok' hideCancel open={showContactDetails} handleClose={()=>{setShowContactDetails(false)}} handleConfirm={()=>{setShowContactDetails(false)}} title={"Contact Details"} description={<><strong>Phone Number:</strong> {itemOwner?.phone} <br/> <strong>Email:</strong> {itemOwner?.email}</>} />
            </>
       )


})
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