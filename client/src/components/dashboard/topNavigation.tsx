import { App } from "@/constants";
import { AppBar, Toolbar, Box, Button } from "@mui/material"
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SellIcon from '@mui/icons-material/Sell';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PeopleIcon from '@mui/icons-material/People';
import { useRouter } from 'next/navigation';
import {usePathname} from 'next/navigation';
import { NextLink } from "@/styled";

const TopNavigation = () => {
    const drawerWidth = 240;
    const currentPath = usePathname();
    return <AppBar
    position="fixed"
    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, backgroundColor: App.DarkBlue }}
>
    <Toolbar variant="regular" sx={{ boxShadow: 'none', backgroundColor: 'none' }}>
    <Box sx={{ flexGrow: 0 }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button style={{borderRadius: 0, color: 'white', borderBottom: currentPath === '/dashboard' ? '4px solid white' : ''}} variant="text" size="large">
          <NextLink href="/dashboard" style={{color: 'white', textDecoration: 'none'}}><ShoppingBagIcon sx={{verticalAlign:'bottom', marginRight: 1}}/>Buy</NextLink> 
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
}

export default TopNavigation