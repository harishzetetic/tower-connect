import './topNavigation.scss'
import { App, BACKEND_URL } from "@/constants";
import { AppBar, Toolbar, Box, Button, Typography, Avatar, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material"
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SellIcon from '@mui/icons-material/Sell';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import { useRouter } from 'next/navigation';
import {usePathname} from 'next/navigation';
import { NextLink } from "@/styled";
import SettingsIcon from '@mui/icons-material/Settings';
import StreamIcon from '@mui/icons-material/Stream';
import React, { useState } from 'react';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Swal from 'sweetalert2';
import { IOwnerData } from '@/Types';
import loggedInUser from '@/store/slices/loggedInUserSlice';
import router from 'next/router';
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";
import { updatedLoggedInUser } from "@/store/slices/loggedInUserSlice";


const TopNavigation = () => {
  const dispatch = useDispatch();
    const router = useRouter()
    const currentPath = usePathname();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const logout = () => {
      handleClose()
        Swal.fire({
            title: "Do you want to logout from Tower Connect?",
            showCancelButton: true,
            confirmButtonText: "Yes",
            icon: 'question'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.removeItem('token');
              dispatch(updatedLoggedInUser({} as IOwnerData))
              io(BACKEND_URL).emit('removeUser', loggedInUser);
              router.push('/login/owner')
              return result.isConfirmed
            }
          }).then((isConfirmed)=>{
            isConfirmed && Swal.fire("You have been logged out", "", "success");
          });      

      
  }

    
    return <AppBar position="fixed">
    <Toolbar variant="regular" sx={{ boxShadow: 'none', backgroundColor: 'none' }}>
    <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          
          
          
          <Typography variant="h5" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'flex', alignItems: 'center'}, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'}}>
          <StreamIcon className='TopNavigation_rotate'/>&nbsp;TOWER CONNECT
          </Typography>
          


          {/*
            <Button className="TopNavigation_btn" style={{borderRadius: 0, color: 'white', borderBottom: currentPath === '/dashboard' ? '4px solid white' : ''}} variant="text" size="large">
          <NextLink href="/dashboard" style={{color: 'white', textDecoration: 'none'}}><ShoppingBagIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Buy</NextLink> 
          </Button>
          */}
          
          <Button className="TopNavigation_btn" style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
          <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}><StorefrontIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Business</NextLink> 
          </Button>
          <Button className="TopNavigation_btn" style={{ borderRadius: 0, color: 'white', borderBottom: ''}} variant="text" size="large">
          <NextLink href="/community" style={{color: 'white', textDecoration: 'none'}}><PeopleIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Community</NextLink> 
          </Button>
          <Button className="TopNavigation_btn" style={{borderRadius: 0, color: 'white'}} variant="text" size="large">
          <NextLink href="/messaging" style={{color: 'white', textDecoration: 'none'}}><ShoppingBagIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Messaging</NextLink> 
          </Button>

          
          
            &nbsp; &nbsp;
        </Box>
      </Box>
      <Button color="inherit" sx={{float: "right"}} onClick={handleClick}><SettingsIcon/></Button>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Help & FAQs
        </MenuItem>
        <MenuItem onClick={logout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      
    </Toolbar>
</AppBar>
}

export default TopNavigation





