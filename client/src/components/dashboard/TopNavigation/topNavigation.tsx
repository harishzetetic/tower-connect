import './topNavigation.scss'
import { BACKEND_URL } from "@/constants";
import { AppBar, Toolbar, Box, Button, Typography, Avatar, Divider, ListItemIcon, Menu, MenuItem } from "@mui/material"
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import { useRouter } from 'next/navigation';
import {usePathname} from 'next/navigation';
import { NextLink } from "@/styled";
import SettingsIcon from '@mui/icons-material/Settings';
import StreamIcon from '@mui/icons-material/Stream';
import React from 'react';
import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Swal from 'sweetalert2';
import { IOwnerData } from '@/Types';
import loggedInUser from '@/store/slices/loggedInUserSlice';
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

    
    return <AppBar position="fixed" elevation={0} sx={{
        background: 'rgba(30, 34, 44, 0.98)',
        boxShadow: '0 4px 24px 0 rgba(20, 26, 31, 0.18)',
        backdropFilter: 'blur(8px)',
        borderRadius: '0 0 24px 24px',
        px: { xs: 1, md: 4 },
        py: 1,
        minHeight: 72,
        ml: { xs: 0, md: '260px' },
        width: { xs: '100%', md: 'calc(100% - 260px)' },
        zIndex: (theme) => theme.zIndex.drawer + 1,
    }}>
        <Toolbar variant="regular" sx={{ boxShadow: 'none', background: 'none', minHeight: 64, px: 0 }}>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="h5" noWrap component="a" href="/" sx={{
                    mr: 4,
                    display: 'flex',
                    alignItems: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    letterSpacing: '.2rem',
                    color: 'transparent',
                    background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textDecoration: 'none',
                    textShadow: '0 2px 8px rgba(33,150,243,0.10)',
                    fontSize: { xs: 20, md: 28 },
                }}>
                    <StreamIcon className='TopNavigation_rotate' sx={{ fontSize: 32, mr: 1 }} />TOWER CONNECT
                </Typography>
                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                    <Button className="TopNavigation_btn" sx={{
                        borderRadius: 2,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 16,
                        px: 3,
                        py: 1,
                        background: currentPath === '/signup/owner' ? 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)' : 'transparent',
                        boxShadow: currentPath === '/signup/owner' ? '0 2px 8px 0 rgba(33, 150, 243, 0.10)' : 'none',
                        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                            color: '#fff',
                        },
                    }} variant="text" size="large">
                        <NextLink href="/signup/owner" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><StorefrontIcon sx={{ verticalAlign: 'bottom', marginRight: 1 }} />Business</NextLink>
                    </Button>
                    <Button className="TopNavigation_btn" sx={{
                        borderRadius: 2,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 16,
                        px: 3,
                        py: 1,
                        background: currentPath === '/community' ? 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)' : 'transparent',
                        boxShadow: currentPath === '/community' ? '0 2px 8px 0 rgba(33, 150, 243, 0.10)' : 'none',
                        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                            color: '#fff',
                        },
                    }} variant="text" size="large">
                        <NextLink href="/community" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><PeopleIcon sx={{ verticalAlign: 'bottom', marginRight: 1 }} />Community</NextLink>
                    </Button>
                    <Button className="TopNavigation_btn" sx={{
                        borderRadius: 2,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 16,
                        px: 3,
                        py: 1,
                        background: currentPath === '/messaging' ? 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)' : 'transparent',
                        boxShadow: currentPath === '/messaging' ? '0 2px 8px 0 rgba(33, 150, 243, 0.10)' : 'none',
                        transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                            color: '#fff',
                        },
                    }} variant="text" size="large">
                        <NextLink href="/messaging" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center' }}><ShoppingBagIcon sx={{ verticalAlign: 'bottom', marginRight: 1 }} />Messaging</NextLink>
                    </Button>
                </Box>
            </Box>
            <Button color="inherit" sx={{
                borderRadius: '50%',
                minWidth: 0,
                ml: 2,
                p: 1.2,
                background: 'rgba(44, 52, 70, 0.85)',
                boxShadow: '0 2px 8px 0 rgba(20, 26, 31, 0.10)',
                '&:hover': {
                    background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                    color: '#fff',
                }
            }} onClick={handleClick}><SettingsIcon /></Button>

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
                        filter: 'drop-shadow(0px 2px 16px rgba(33,150,243,0.18))',
                        mt: 1.5,
                        borderRadius: 3,
                        minWidth: 200,
                        background: 'rgba(44, 52, 70, 0.98)',
                        color: '#fff',
                        boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
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
                            bgcolor: 'rgba(44, 52, 70, 0.98)',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleClose} sx={{ '&:hover': { background: 'rgba(33, 150, 243, 0.10)' } }}>
                    <Avatar /> Profile
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ '&:hover': { background: 'rgba(33, 150, 243, 0.10)' } }}>
                    <Avatar /> My account
                </MenuItem>
                <Divider sx={{ borderColor: 'rgba(76,175,80,0.18)' }} />
                <MenuItem onClick={handleClose} sx={{ '&:hover': { background: 'rgba(33, 150, 243, 0.10)' } }}>
                    <ListItemIcon>
                        <Settings fontSize="small" sx={{ color: '#2196F3' }} />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleClose} sx={{ '&:hover': { background: 'rgba(33, 150, 243, 0.10)' } }}>
                    <ListItemIcon>
                        <Settings fontSize="small" sx={{ color: '#4CAF50' }} />
                    </ListItemIcon>
                    Help & FAQs
                </MenuItem>
                <MenuItem onClick={logout} sx={{ '&:hover': { background: 'rgba(33, 150, 243, 0.10)' } }}>
                    <ListItemIcon>
                        <Logout fontSize="small" sx={{ color: '#cf2069' }} />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </Toolbar>
    </AppBar>
}

export default TopNavigation





