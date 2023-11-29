"use client"
import { useSelector } from "react-redux";
import * as React from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SellIcon from '@mui/icons-material/Sell';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import { Avatar, Button, Card, CardActionArea, CardContent, CardMedia, Chip, Dialog, Divider, Grid, IconButton, List, ListItem, ListItemText, Slide, ThemeProvider, Typography } from "@mui/material";
import { getLoggedInUserData } from "@/util";
import { useRouter } from 'next/navigation'
import {default as NextLink} from "next/link";
import BuySellInfoCard from "@/components/dashboard/buySellInfoCard";
import Sidebar from "@/components/dashboard/sidebar";
import { APP_THEME } from "@/Types";
import { App } from "@/constants";
import { TransitionProps } from "@mui/material/transitions";
import CloseIcon from '@mui/icons-material/Close';
import SellItemWizard from "@/components/dashboard/sellItemWizard";

const drawerWidth = 240;
const Dashboard = () => {
    const router = useRouter()
    const loggedInUser = getLoggedInUserData()
    const [openSellWizard, setOpenSellWizard]= React.useState<boolean>(false)
    React.useEffect(()=>{
        if(!loggedInUser){
            router.push('/login/owner')
        }
    })
    if(loggedInUser){
        return (<ThemeProvider theme={APP_THEME}><Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: App.DarkBlue }}
        >
            <Toolbar variant="regular" sx={{ boxShadow: 'none', backgroundColor: 'none' }}>
            <Box sx={{ flexGrow: 0 }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button style={{borderRadius: 0, color: 'white', borderBottom: '4px solid white'}} variant="text" size="large">
                  <NextLink href="/login/owner" style={{color: 'white', textDecoration: 'none'}}><ShoppingBagIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Buy</NextLink> 
                  </Button>
                  <Button style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
                  <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}><SellIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Sell</NextLink> 
                  </Button>
                  <Button style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
                  <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}><StorefrontIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Business</NextLink> 
                  </Button>
                  <Button style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
                  <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}><PeopleIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Community</NextLink> 
                  </Button>
                    &nbsp; &nbsp;
                </Box>
              </Box>
            </Toolbar>
        </AppBar>
        <Sidebar loggedInUser={loggedInUser} setOpenSellWizard={setOpenSellWizard}/>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
            <Toolbar />
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                        <BuySellInfoCard />
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    </Box>
    <SellItemWizard openSellWizard={openSellWizard} setOpenSellWizard={setOpenSellWizard} />
    </ThemeProvider>)
    }
    return <>User probably not logged in. Kindly login again.</>
    
}

export default Dashboard