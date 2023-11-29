import { ILoggedInUser } from "@/Types";
import { getLoggedInUserData } from "@/util";
import { Drawer, Box, Avatar, Chip, Typography, List, ListItem, ListItemButton, Button, Divider, ListItemIcon, ListItemText } from "@mui/material";
import VerifiedIcon from '@mui/icons-material/Verified';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import LogoutIcon from '@mui/icons-material/Logout';
import { Dispatch, SetStateAction, useState } from "react";
import TCConfirm from "../common/TCConfirm";
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { App } from "@/constants";



interface ISidebarProps{
    loggedInUser: ILoggedInUser
    setOpenSellWizard: Dispatch<SetStateAction<boolean>>
}
const Sidebar = (props: ISidebarProps) => {
    const router = useRouter()
    const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
    const {loggedInUser} = props
    const drawerWidth = 240;

    const logout = () => {
        sessionStorage.removeItem('loggedInUserInfo');
        setOpenLogoutConfirm(false);
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
                    
                    <Button onClick={()=>{props.setOpenSellWizard(true)}} sx={{width: '-webkit-fill-available'}} startIcon={<AddPhotoAlternateIcon />} size="large" variant="contained">Add</Button>

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
                    
                    <Button sx={{width: '-webkit-fill-available'}} startIcon={<LogoutIcon />} size="large" variant="contained" color="error" onClick={()=>{setOpenLogoutConfirm(true)}}>Log out</Button>

                </ListItemButton>
            </ListItem>
        ))}
    </List>
    <TCConfirm open={openLogoutConfirm} handleClose={()=>{setOpenLogoutConfirm(false)}} handleConfirm={logout} title={"Confirm"} description={"Are you sure to logout?"} />
</Drawer>
}

export default Sidebar;