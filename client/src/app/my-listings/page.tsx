"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { Button, Grid, ThemeProvider } from "@mui/material";
import { getLoggedInUserData, pushNotification } from "@/util";
import BuySellInfoCard, { SkeletonCard } from "@/components/dashboard/buySellInfoCard";
import Sidebar from "@/components/dashboard/sidebar";
import { APP_THEME, IBuySell } from "@/Types";
import SellItemWizard from "@/components/dashboard/sellItemWizard";
import { NotificationContainer } from 'react-notifications';
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
dayjs.extend(relativeTime)

const MyListings = ({ params }) => {
    const router = useRouter();
    const loggedUser = getLoggedInUserData();
    const loggedInUser = getLoggedInUserData();
    const [openSellWizard, setOpenSellWizard] = React.useState<boolean>(false);

    const fetchMyListing = async () => {
        try {
            const apiResponse = await fetchMyListings(loggedUser?.user._id, loggedInUser?.user.society?._id);
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('loggedInUserInfo');
                router.push('/login/owner')
            } else {
                return apiResponse?.data as IBuySell[]
            }

        } catch (e) {
            pushNotification('error', 'Error', 'Error while getting listings from server');
            return [] as IBuySell[]
        }
    }

    const {data:myListings, isLoading } = useQuery({
        queryFn: () => fetchMyListing(),
        queryKey: ['fetchAllListings'], gcTime: 0
    })

    React.useEffect(() => {
        if (!loggedInUser) {
            router.push('/login/owner')
        }
    })

    if(loggedInUser){
        return (<ThemeProvider theme={APP_THEME}><Box sx={{ display: 'flex' }}>
        <TopNavigation />
        <Sidebar loggedInUser={loggedInUser} setOpenSellWizard={setOpenSellWizard}/>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
            <Toolbar />
            <Grid container spacing={2}>
                <Grid item xs={12}>
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
                </Grid>
            </Grid>
        </Box>
    </Box>
    <SellItemWizard openSellWizard={openSellWizard} setOpenSellWizard={setOpenSellWizard} pushNotification={pushNotification}/>
    </ThemeProvider>)
    }
    return <>User probably not logged in. Kindly login again.</>

}



export default MyListings