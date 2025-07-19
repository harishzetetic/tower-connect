"use client"
import { AppBar, Container, Toolbar, Typography, Box } from "@mui/material";
import { useRouter } from 'next/navigation'
import StreamIcon from '@mui/icons-material/Stream';

const PublicHeader = () => {
  const router = useRouter()

  return (
    <AppBar position="static" style={{ background: 'transparent', boxShadow: 'none' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ 
          minHeight: { xs: '56px', md: '64px' },
          px: { xs: 1, sm: 2 },
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          
          {/* Logo and Title */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <StreamIcon sx={{ 
              color: '#fff', 
              mr: 1, 
              fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' } 
            }} />
            <Typography 
              variant="h6" 
              component="a" 
              href="/" 
              sx={{ 
                fontFamily: 'monospace', 
                fontWeight: 700, 
                color: '#fff', 
                textDecoration: 'none',
                fontSize: { xs: '0.75rem', sm: '0.85rem', md: '1rem' },
                letterSpacing: { xs: '0.05rem', sm: '0.1rem', md: '0.15rem' },
                '&:hover': { color: '#f0f0f0' }
              }}
            >
              TOWER CONNECT
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default PublicHeader;