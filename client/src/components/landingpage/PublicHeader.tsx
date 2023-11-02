"use client"
import { AppBar, Container, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import {useRouter} from 'next/navigation'
import { usePathname } from 'next/navigation'


const PublicHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  const pages = ['Features', 'About', 'Feedback'];
    return (
        <AppBar position="static" style={{background: 'transparent', boxShadow: 'none'}}>
          <Container maxWidth="xl">
            <Toolbar disableGutters >
              <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }}>
                TOWER CONNECT
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton size="large" onClick={()=>{}} color="inherit"> <MenuIcon /></IconButton>
              </Box>
              <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography variant="h5" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'}}>
                TOWER CONNECT
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              </Box>
              
              <Box sx={{ flexGrow: 0 }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button style={{ borderRadius: 0, color: 'white', borderBottom: pathname === '/login/tenant' ? '4px solid white' : ''}} variant="text" size="large" onClick={()=>{router.push('/login/tenant')}}>Tenant Login</Button>
                    &nbsp; &nbsp;
                  <Button style={{borderRadius: 0, color: 'white', borderBottom: pathname === '/login/owner' ? '4px solid white' : ''}} variant="text" size="large" onClick={()=>{router.push('/login/owner')}}>Owner Login</Button>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      );
}
export default PublicHeader;