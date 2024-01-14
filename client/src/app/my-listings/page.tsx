"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, Grid, ThemeProvider } from "@mui/material";
import BuySellInfoCard, { SkeletonCard } from "@/components/dashboard/buySellInfoCard";
import Sidebar from "@/components/dashboard/sidebar";
import { APP_THEME, IBuySell, IOwnerData } from "@/Types";
import SellItemWizard from "@/components/dashboard/sellItemWizard";
import TopNavigation from '@/components/dashboard/topNavigation';
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
        queryKey: ['fetchMyListings'], gcTime: 0
    })

        return (
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {isLoading && [1,2,3,4,5,6,7,8].map((_, index)=><SkeletonCard key={index} />)}
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