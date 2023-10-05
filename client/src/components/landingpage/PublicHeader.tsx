import { AppBar, Container, Toolbar, Typography, Box, IconButton, Button } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';

const PublicHeader = () => {
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
                {pages.map((page) => (
                  <Button key={page} onClick={()=>{}} sx={{ my: 2, color: 'white', display: 'block', ml: 4 }}>
                    {page}
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button style={{color: 'white'}} variant="text" size="large" onClick={()=>{}}>Tenant Login</Button>
                    &nbsp; &nbsp;
                  <Button style={{backgroundColor: 'white', color: 'black'}} variant="contained" size="large" onClick={()=>{}}>Owner Login</Button>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      );
}
export default PublicHeader;