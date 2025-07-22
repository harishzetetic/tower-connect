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
                        <Box sx={{
                            background: 'rgba(30, 34, 44, 0.98)',
                            borderRadius: 4,
                            boxShadow: '0 4px 24px 0 rgba(20, 26, 31, 0.18)',
                            p: { xs: 2, md: 4 },
                            mb: 4,
                            mt: 2,
                            mx: { xs: 0, md: 2 },
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                <Button variant="text" sx={{ minWidth: 0, p: 0, color: '#2196F3' }}>
                                    <NextLink href={{ pathname: `/dashboard/` }}><ArrowBackIcon fontSize='large' /></NextLink>
                                </Button>
                                {shouldMessageBtnDisplay() && <Button size="large" variant="contained" onClick={creatMessageThenRedirect} sx={{
                                    background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.10)',
                                    px: 4,
                                    py: 1.2,
                                    fontSize: 16,
                                    letterSpacing: 0.5,
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                                    }
                                }}><MessageIcon /> &nbsp; Message to owner</Button>}
                            </Box>
                            <Typography variant='h3' sx={{ fontWeight: 'bold', color: '#fff', mb: 1 }}>{listing.title}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{
                                    background: 'rgba(44, 52, 70, 0.85)',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
                                    p: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    mr: 2
                                }}>
                                    <PersonIcon sx={{ color: '#4CAF50', fontSize: 32, mr: 1 }} />
                                    <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>{`${itemOwner?.firstName} ${itemOwner?.lastName}`}</Typography>
                                    <Typography sx={{ color: '#b0b8c9', fontSize: 15, ml: 2 }}>{`${itemOwner?.towerNumber}-${itemOwner?.flatNumber}`}</Typography>
                                    <Typography sx={{ color: '#b0b8c9', fontSize: 14, ml: 2 }}>{`• ${dayjs(listing?.created_at).fromNow()}`}</Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'inline-block', mt: 2, width: '100%' }}>
                                <ImageList sx={{ width: '100%', height: 'auto', borderRadius: 3, boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)', background: 'rgba(44, 52, 70, 0.85)', p: 1 }} cols={4} rowHeight={164}>
                                    {
                                        listing.images.map((item, index) => (
                                            <ImageListItem key={index} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: '0 2px 8px 0 rgba(20, 26, 31, 0.10)', m: 0.5 }}>
                                                <img
                                                    src={`${BACKEND_URL}${item?.slice(1)}`}
                                                    alt={`image${index + 1}`}
                                                    loading="lazy"
                                                    style={{ borderRadius: 12, width: '100%', height: '100%', objectFit: 'cover', background: '#222' }}
                                                />
                                            </ImageListItem>
                                        ))
                                    }
                                </ImageList>
                            </Box>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} md={4}>
                                    <CardBox title="Price" value={listing.isSold ? 'SOLD' : parseInt(listing.price || '0').toFixed(2)} priceFormat={!!(!listing.isSold)} />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <CardBox title="Condition" value={listing.condition} showIcon />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <CardBox title="Category" value={listing.category} />
                                </Grid>
                            </Grid>
                            <Box sx={{ mt: 3 }}>
                                <Card sx={{
                                    background: 'rgba(44, 52, 70, 0.85)',
                                    borderRadius: 3,
                                    boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
                                    p: 2,
                                    color: '#fff',
                                    border: '1px solid rgba(76,175,80,0.08)'
                                }}>
                                    <CardContent>
                                        <Typography variant='h5' sx={{ color: '#fff', fontWeight: 700 }}><strong>Description</strong></Typography>
                                        <Typography variant='h6' sx={{ color: '#b0b8c9', fontWeight: 400 }}>{` ${listing.description} `}</Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                        <NextLink style={{display: 'none'}} href={{pathname: '/messaging', query: {activeChat: 'MUST_BE_FILL'}}}><Typography ref={forwardToMessagingRef}>Hidden</Typography></NextLink>
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
    return <Card variant="outlined" sx={{
        background: 'rgba(44, 52, 70, 0.85)',
        borderRadius: 3,
        boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
        color: '#fff',
        border: '1px solid rgba(76,175,80,0.08)',
        p: 1,
        mb: 1
    }}>
        <CardContent>
            <Typography variant='h5' gutterBottom sx={{ fontWeight: 700 }}>{title}</Typography>
            <Typography variant='h4' sx={{ color: priceFormat ? '#4CAF50' : '#fff', fontWeight: 700, display: 'flex', alignItems: 'center' }}> <strong>{priceFormat ? <CurrencyRupeeIcon sx={{ color: '#4CAF50', fontSize: 28, mr: 0.5 }} /> : '' } {getIcon()} {getValue(title, value)}</strong> </Typography>
        </CardContent>
    </Card>
}

export default Listing