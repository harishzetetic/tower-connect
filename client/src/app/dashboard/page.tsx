"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { Button, Grid, LinearProgress, ThemeProvider } from "@mui/material";
import { pushNotification } from "@/util";
import { useRouter } from 'next/navigation'
import BuySellInfoCard, { SkeletonCard } from "@/components/dashboard/buySellInfoCard";
import Sidebar from "@/components/dashboard/sidebar";
import { APP_THEME, IBuySell, IOwnerData } from "@/Types";
import SellItemWizard from "@/components/dashboard/sellItemWizard";
import { fetchAllListings } from "@/api/ownerApis";
import { Div } from '@/styled';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import notfound from '../../../../client/src/images/notfound.png';
import Image from "next/image";
import TopNavigation from '@/components/dashboard/topNavigation';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';


const drawerWidth = 240;
const Dashboard = () => {
    // const [listings, setListings] = React.useState<Array<IBuySell> | null>(null)
    const router = useRouter()
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    const [openSellWizard, setOpenSellWizard]= React.useState<boolean>(false);
    console.log('loggedInUser', loggedInUser)
    const fetchListings = async () => {
        
        try{
            const apiResponse = await fetchAllListings(loggedInUser?.society?._id);
            if (apiResponse?.data?.isTokenValid === false) {
                sessionStorage.removeItem('token');
                router.push('/login/owner')
            } else {
                return apiResponse?.data;
            }
            
        }catch(e){
            pushNotification('error', 'Error', 'Error while getting listings from server')
            return []
        }
    }

    const {data:listings, isLoading } = useQuery({
        queryFn: () => fetchListings(),
        queryKey: ['fetchAllListings'],
    })
  
    React.useEffect(()=>{
        if(!loggedInUser){
            router.push('/login/owner')
        }
    })


    if(loggedInUser){
        return (<ThemeProvider theme={APP_THEME}><Box sx={{ display: 'flex' }}>
        <CssBaseline />
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
                        {listings && listings.length ? (listings as IBuySell[]).map(item => (<BuySellInfoCard key={item._id} data={item}/>)) : 
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

export default Dashboard