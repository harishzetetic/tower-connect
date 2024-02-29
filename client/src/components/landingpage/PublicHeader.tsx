"use client"
import { AppBar, Container, Toolbar, Typography, Box, IconButton, Button} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import {useRouter} from 'next/navigation'
import { usePathname } from 'next/navigation'
import StreamIcon from '@mui/icons-material/Stream';
import { NextLink, TCButton } from "@/styled";



const PublicHeader = () => {
  const router = useRouter()
  const pathname = usePathname()
  
  const pages = ['Features', 'About', 'Feedback'];
    return (
        <AppBar position="static" style={{background: 'transparent', boxShadow: 'none'}}>
          <Container maxWidth="xl">
            <Toolbar disableGutters >
              <StreamIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
              <Typography variant="h6" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none', }}>
                TOWER CONNECT
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton size="large" onClick={()=>{}} color="inherit"> <MenuIcon /></IconButton>
              </Box>
              <StreamIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
              <Typography variant="h5" noWrap component="a" href="/" sx={{ mr: 2, display: { xs: 'flex', md: 'none' }, flexGrow: 1, fontFamily: 'monospace', fontWeight: 700, letterSpacing: '.3rem', color: 'inherit', textDecoration: 'none'}}>
                TOWER CONNECT
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              </Box>
              
              <Box sx={{ flexGrow: 0 }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {/*
                    <Button style={{ borderRadius: 0, color: 'white', borderBottom: pathname === '/login/tenant' ? '4px solid white' : ''}} variant="text" size="large" onClick={()=>{router.push('/login/tenant')}}>Tenant Login</Button>
                    &nbsp; &nbsp;
                  */}
                  <TCButton variant="contained" size="large">
                  <NextLink href="/login/owner" style={{textDecoration: 'none'}}>Login</NextLink> 
                  </TCButton>
                  <Button style={{ borderRadius: 0, color: 'white'}} variant="text" size="large">
                  <NextLink href="/signup/owner" style={{color: 'white', textDecoration: 'none'}}>Signup</NextLink> 
                  </Button>
                    &nbsp; &nbsp;
                  
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      
      );
}
export default PublicHeader;