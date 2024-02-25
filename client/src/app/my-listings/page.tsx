"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, Grid } from "@mui/material";
import BuySellInfoCard from "@/components/dashboard/buySellInfoCard";
import { IBuySell, IOwnerData } from "@/Types";
import { useRouter } from 'next/navigation';
import notfound from '../../../../client/src/images/notfound.png';
import Image from "next/image";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import dayjs from 'dayjs';
import relativeTime from "dayjs/plugin/relativeTime";
import { useQuery } from '@tanstack/react-query';
import { Div } from '@/styled';
import { fetchMyListings } from '@/api/ownerApis';
import { useSelector } from 'react-redux';
import { HOC } from '@/components/hoc/hoc';
import { createParamsForInfoToast } from '@/util';
import Swal from 'sweetalert2';
import { QUERY_KEYS } from '@/constants';
import LoadingBackDrop from '@/components/common/LoadingBackDrop';
dayjs.extend(relativeTime)

const MyListings = HOC(({ params }) => {
    const router = useRouter();
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [openSellWizard, setOpenSellWizard] = React.useState<boolean>(false);

    const fetchMyListing = async () => {
        try {
            const apiResponse = await fetchMyListings(loggedInUser?._id, loggedInUser?.societyId);
            if (apiResponse?.status === 200) {
                return apiResponse?.data as IBuySell[]
            }

        } catch (e) {
            Swal.fire(createParamsForInfoToast('error', 'Error', 'Error while getting listings from server'))
            return [] as IBuySell[]
        }
    }

    const {data:myListings, isLoading } = useQuery({
        queryFn: () => fetchMyListing(),
        queryKey: [QUERY_KEYS.FETCH_MY_LISTING], gcTime: 0
    })

        return (
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <LoadingBackDrop isLoading={isLoading} />
                        {myListings && myListings.length ? (myListings as IBuySell[]).map(item => (<BuySellInfoCard key={item._id} data={item}/>)) : 
                        <>
                        <Box sx={{textAlign: 'center', margin: 'auto'}}>
                            <Box> 
                                <Image src={notfound} alt={"owner-logo"} width={300} />
                                <Div> {'There are no live listing now. Create your first one.'}</Div>
                            </Box>
                        <Box><Button variant="contained" size="large" onClick={()=>setOpenSellWizard(true)}><AddPhotoAlternateIcon /> Add Item</Button></Box>
                        </Box>
                        
                        </>
                        }    
                    </Grid>
               )
   

})



export default MyListings