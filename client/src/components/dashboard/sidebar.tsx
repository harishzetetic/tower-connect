import { IOwnerData } from "@/Types";
import { Drawer, Box, Avatar, Typography, List, ListItem, ListItemButton, Button} from "@mui/material";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Dispatch, SetStateAction } from "react";
import {usePathname} from 'next/navigation';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BusinessIcon from '@mui/icons-material/Business';
import CampaignIcon from '@mui/icons-material/Campaign';
import Person4Icon from '@mui/icons-material/Person4';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import VerifiedIcon from '@mui/icons-material/Verified';
import RouteItem from "./RouteItem/RouteItem";
import { BACKEND_URL } from "@/constants";

interface ISidebarProps{
    loggedInUser: IOwnerData
    setOpenSellWizard: Dispatch<SetStateAction<boolean>>
}
const Sidebar = (props: ISidebarProps) => {
    const currentPath = usePathname();
    const {loggedInUser} = props
    const drawerWidth = 260;

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    background: 'rgba(30, 34, 44, 0.98)',
                    border: 'none',
                    boxShadow: '2px 0 16px 0 rgba(20, 26, 31, 0.12)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '0 24px 24px 0',
                },
            }}
            variant="permanent"
            anchor="left"
        >
            <Box
                sx={{
                    marginTop: 3,
                    marginX: 2,
                    marginBottom: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(44, 52, 70, 0.85)',
                    borderRadius: 3,
                    boxShadow: '0 2px 12px 0 rgba(20, 26, 31, 0.10)',
                    p: 3,
                }}
            >   
                <Avatar src={`${BACKEND_URL}${loggedInUser.imageUrl?.slice(1)}`} sx={{ m: 0.5, bgcolor: 'secondary.main', width: 72, height: 72, boxShadow: '0 2px 8px 0 rgba(20, 26, 31, 0.18)' }}>
                    {loggedInUser.firstName?.charAt(0)}{loggedInUser.lastName?.charAt(0)}
                </Avatar>
                <Typography component="h2" variant="h6" sx={{ color: 'white', fontWeight: 700, mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VerifiedIcon sx={{color: '#4CAF50', fontSize: 22, mr: 0.5}}/>{loggedInUser.firstName} {loggedInUser.lastName}
                </Typography>
                <Typography sx={{ color: '#b0b8c9', fontSize: 14, mt: 0.5, fontWeight: 500 }}>
                    {loggedInUser.society?.builderName} {loggedInUser.society?.societyName}
                </Typography>
                <Typography sx={{ color: '#b0b8c9', fontSize: 13, fontWeight: 400 }}>
                    {loggedInUser.towerNumber}-{loggedInUser.flatNumber}
                </Typography>
            </Box>
            <Box sx={{ px: 2 }}>
                <Button 
                    onClick={()=>{props.setOpenSellWizard(true)}} 
                    startIcon={<AddPhotoAlternateIcon />} 
                    size="large" 
                    variant="contained"
                    sx={{
                        width: '100%',
                        background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)',
                        color: '#fff',
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: '0 2px 8px 0 rgba(33, 150, 243, 0.10)',
                        mb: 2,
                        py: 1.2,
                        fontSize: 16,
                        letterSpacing: 0.5,
                        '&:hover': {
                            background: 'linear-gradient(90deg, #2196F3 0%, #4CAF50 100%)',
                        }
                    }}
                >
                    Add Listing
                </Button>
            </Box>
            <Box sx={{ mx: 2, my: 2, borderBottom: '1px solid #353b4a', borderRadius: 1 }} />
            <List sx={{ px: 1 }}>
                <RouteItem icon={DashboardIcon} isActive={currentPath === '/dashboard'} text='Dashboard' redirectURL = '/dashboard'/>
                <RouteItem icon={ReceiptLongIcon} isActive={currentPath === '/my-listings'} text='My Listings' redirectURL = '/my-listings' />
                {/* <RouteItem icon={BusinessIcon} isActive={currentPath === '/my-business'} text='My Business' redirectURL = '/my-business' />*/}
                {/*<RouteItem icon={CampaignIcon} isActive={currentPath === '/announcement'} text='Announcements' redirectURL = '/announcement' />*/}
                <RouteItem icon={Person4Icon} isActive={currentPath === '/profile'} text='Profile' redirectURL = '/profile' />
                {/*<RouteItem icon={NotificationsActiveIcon} isActive={currentPath === '/messaging'} text='Messaging' redirectURL = '/messaging' />*/}
            </List>
        </Drawer>
    )
}

export default Sidebar;