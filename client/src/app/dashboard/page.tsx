"use client"
import { useSelector } from "react-redux";
import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Avatar, Button, Card, CardActionArea, CardContent, CardMedia, Chip, Grid } from "@mui/material";
import { getLoggedInUserData } from "@/util";
import { useRouter } from 'next/navigation'
import {default as NextLink} from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import BuySellInfoCard from "@/components/admin/buySellInfoCard";
import VerifiedIcon from '@mui/icons-material/Verified';

const drawerWidth = 240;
const Dashboard = () => {
    const router = useRouter()
    const loggedInUser = getLoggedInUserData()
    React.useEffect(()=>{
        if(!loggedInUser){
            router.push('/login/owner')
        }
    })
    if(loggedInUser){
        return (<Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
            position="fixed"
            sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
            <Toolbar variant="regular" sx={{ boxShadow: 'none', backgroundColor: 'none' }}>
            <Box sx={{ flexGrow: 0 }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              
                  <Button style={{borderRadius: 0, color: 'white', borderBottom: '4px solid white'}} variant="text" size="large">
                  <NextLink href="/login/owner" style={{color: 'white', textDecoration: 'none'}}>Buy</NextLink> 
                  </Button>
                  <Button style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
                  <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}>Sell</NextLink> 
                  </Button>
                  <Button style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
                  <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}>Rent</NextLink> 
                  </Button>
                  <Button style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
                  <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}>Business</NextLink> 
                  </Button>
                    &nbsp; &nbsp;
                  
                </Box>
              </Box>
            </Toolbar>
        </AppBar>
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: 'black',
                    color: '#9e9e9e'
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Box
                sx={{
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginBottom: 2
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
                    {loggedInUser.user.firstName?.charAt(0)} {loggedInUser.user.lastName?.charAt(0)}
                </Avatar>
                <Chip icon={<VerifiedIcon />} label="verified" color="success" variant="outlined" />
                <Typography component="h2" variant="h6" sx={{ color: 'white' }}>
                     {loggedInUser.user.firstName} {loggedInUser.user.lastName}
                </Typography>
                <Typography>
                    {loggedInUser.user.society?.builderName} {loggedInUser.user.society?.societyName}
                </Typography>
                <Typography>
                    {loggedInUser.user.towerNumber}-{loggedInUser.user.flatNumber}
                </Typography>
                
            </Box>
            <List>
                {['Add'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton >
                            
                            <Button sx={{width: '-webkit-fill-available'}} startIcon={<AddPhotoAlternateIcon />} size="large" variant="contained">Add</Button>

                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider/>
            <List>
                {['Dashboard', 'My Listening', 'My Business', 'Announcements', 'Profile', 'Notifications'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {index % 2 === 0 ? <InboxIcon sx={{ color: '#9e9e9e' }} /> : <MailIcon sx={{ color: '#9e9e9e' }} />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Log Out'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton >
                            
                            <Button sx={{width: '-webkit-fill-available'}} startIcon={<LogoutIcon />} size="large" variant="contained" color="error">Log out</Button>

                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
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
    </Box>)
    }
    return <>User probably not logged in. Kindly login again.</>
    
}

export default Dashboard