import { IOwnerData } from "@/Types";
import { Drawer, Box, Avatar, Chip, Typography, List, ListItem, ListItemButton, Button, Divider, ListItemIcon, ListItemText, SvgIconTypeMap, Badge } from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LogoutIcon from '@mui/icons-material/Logout';
import { Dispatch, SetStateAction, useState } from "react";
import TCConfirm from "../common/TCConfirm";
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { App, BACKEND_URL } from "@/constants";
import {usePathname} from 'next/navigation';
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
import VerifiedIcon from '@mui/icons-material/Verified';
import RouteItem from "./RouteItem/RouteItem";

interface ISidebarProps{
    loggedInUser: IOwnerData
    setOpenSellWizard: Dispatch<SetStateAction<boolean>>
}
const Sidebar = (props: ISidebarProps) => {
    const dispatch = useDispatch();
    const currentPath = usePathname();
    const router = useRouter()
    const {loggedInUser} = props
    const drawerWidth = 240;

 
    return <Drawer
    sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#292f33',
            border: 'none'
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
        <Avatar sx={{ m: 0.5, bgcolor: 'secondary.main', width: 56, height: 56 }}>
            {loggedInUser.firstName?.charAt(0)} {loggedInUser.lastName?.charAt(0)}
        </Avatar>
        <Typography component="h2" variant="h6" sx={{ color: 'white' , display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
             <VerifiedIcon sx={{color: 'green'}}/>{loggedInUser.firstName} {loggedInUser.lastName}
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
    <List>
        <RouteItem icon={DashboardIcon} isActive={currentPath === '/dashboard'} text='Dashboard' redirectURL = '/dashboard'/>
        <RouteItem icon={ReceiptLongIcon} isActive={currentPath === '/my-listings'} text='My Listings' redirectURL = '/my-listings' />
        <RouteItem icon={BusinessIcon} isActive={currentPath === '/my-business'} text='My Business' redirectURL = '/my-business' />
        <RouteItem icon={CampaignIcon} isActive={currentPath === '/announcement'} text='Announcements' redirectURL = '/announcement' />
        <RouteItem icon={Person4Icon} isActive={currentPath === '/profile'} text='Profile' redirectURL = '/profile' />
        <RouteItem icon={NotificationsActiveIcon} isActive={currentPath === '/messaging'} text='Messaging' redirectURL = '/messaging' />

    </List>
</Drawer>
}

export default Sidebar;