import { IOwnerData } from "@/Types";
import { Drawer, Box, Avatar, Chip, Typography, List, ListItem, ListItemButton, Button, Divider, ListItemIcon, ListItemText, SvgIconTypeMap, Badge } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LogoutIcon from '@mui/icons-material/Logout';
import { Dispatch, SetStateAction, useState } from "react";
import TCConfirm from "../common/TCConfirm";
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { App, BACKEND_URL } from "@/constants";
import {usePathname} from 'next/navigation';
// import { default as NextLink } from "next/link";
import Swal from 'sweetalert2'
import { updatedLoggedInUser } from "@/store/slices/loggedInUserSlice";
import { useDispatch } from "react-redux";

import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';
import Person4Icon from '@mui/icons-material/Person4';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { NextLink } from "@/styled";
import { io } from "socket.io-client";

interface ISidebarProps{
    loggedInUser: IOwnerData
    setOpenSellWizard: Dispatch<SetStateAction<boolean>>
}
const Sidebar = (props: ISidebarProps) => {
    const dispatch = useDispatch();
    const currentPath = usePathname();
    const router = useRouter()
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
    const {loggedInUser} = props
    const drawerWidth = 240;

    const logout = () => {
        sessionStorage.removeItem('token');
        setOpenLogoutConfirm(false);
        dispatch(updatedLoggedInUser({} as IOwnerData))
        io(BACKEND_URL).emit('removeUser', loggedInUser);
        router.push('/login/owner')
    }
    return <Drawer
    sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: App.DarkBlue,
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
            {loggedInUser.firstName?.charAt(0)} {loggedInUser.lastName?.charAt(0)}
        </Avatar>
        <Chip icon={<VerifiedIcon />} label="verified" color="success" variant="outlined" />
        <Typography component="h2" variant="h6" sx={{ color: 'white' }}>
             {loggedInUser.firstName} {loggedInUser.lastName}
        </Typography>
        <Typography>
            {loggedInUser.society?.builderName} {loggedInUser.society?.societyName}
        </Typography>
        <Typography>
            {loggedInUser.towerNumber}-{loggedInUser.flatNumber}
        </Typography>
        
    </Box>
    <List>
        {['Add'].map((text, index) => (
            <ListItem key={text} disablePadding>
                <ListItemButton >
                    
                    <Button onClick={()=>{props.setOpenSellWizard(true)}} sx={{width: '-webkit-fill-available'}} startIcon={<AddPhotoAlternateIcon />} size="large" variant="contained">Add</Button>

                </ListItemButton>
            </ListItem>
        ))}
    </List>
    <Divider/>
    <List>
        <RouteItem icon={DashboardIcon} isActive={currentPath === '/dashboard'} text='Dashboard' redirectURL = '/dashboard'/>
        <RouteItem icon={ReceiptLongIcon} isActive={currentPath === '/my-listings'} text='My Listings' redirectURL = '/my-listings' />
        <RouteItem icon={BusinessIcon} isActive={currentPath === '/my-business'} text='My Business' redirectURL = '/my-business' />
        <RouteItem icon={CampaignIcon} isActive={currentPath === '/announcement'} text='Announcements' redirectURL = '/announcement' />
        <RouteItem icon={Person4Icon} isActive={currentPath === '/profile'} text='Profile' redirectURL = '/profile' />
        <RouteItem icon={NotificationsActiveIcon} isActive={currentPath === '/messaging'} text='Messaging' redirectURL = '/messaging' />

    </List>
    <Divider />
    <List>
        {['Log Out'].map((text, index) => (
            <ListItem key={text} disablePadding>
                <ListItemButton >
                    <Button sx={{width: '-webkit-fill-available'}} startIcon={<LogoutIcon />} size="large" variant="contained" color="error" onClick={()=>{
                        Swal.fire({
                            title: "Do you want to logout from Tower Connect?",
                            showCancelButton: true,
                            confirmButtonText: "Yes",
                            icon: 'question'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              logout()
                              return result.isConfirmed
                            }
                          }).then((isConfirmed)=>{
                            isConfirmed && Swal.fire("You have been logged out", "", "success");
                          });
                        // setOpenLogoutConfirm(true)
                        }}>Log out</Button>
                </ListItemButton>
            </ListItem>
        ))}
    </List>
    <TCConfirm open={openLogoutConfirm} handleClose={()=>{setOpenLogoutConfirm(false)}} handleConfirm={logout} title={"Confirm"} description={"Are you sure to logout?"} />
</Drawer>
}

interface IRouteItem {
    isActive: boolean;
    text: string;
    redirectURL: string;
    icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string; }
}
const RouteItem = ({isActive, text, redirectURL, icon}: IRouteItem) => {
    const Icon = icon;
    return <ListItem disablePadding sx={{borderLeft: isActive ? '4px solid white' : ''}}>
    <NextLink href={{ pathname: redirectURL }} >
        <ListItemButton>
            <ListItemIcon>
                <Icon sx={{ color: isActive ? 'white' : '#9e9e9e' }} />
            </ListItemIcon>
            <ListItemText primary={text} />
        </ListItemButton>
    </NextLink>
    
</ListItem>
}

export default Sidebar;