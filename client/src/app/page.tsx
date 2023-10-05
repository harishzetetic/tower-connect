"use client"
import { Box, Container, createTheme } from '@mui/material';
import Featured from '../components/landingpage/Featured';
import PublicFooter from '../components/landingpage/PublicFooter';
import PublicHeader from '../components/landingpage/PublicHeader';
import WhyUs from '../components/landingpage/WhyUs';
import AnnouncementDrawer from '@/components/common/AnnouncementDrawer';
import { App } from '@/constants';

export default function Home() {
  return (
      <>
      <main>
        <Box className='full_viewport_height' style={{ background: App.Background }}>
          <PublicHeader />
          <Featured />
        </Box>
        <Box sx={{ pt: 8, pb: 6 }}>
          <Container maxWidth="lg" sx={{ mt: 15 }}>
            <WhyUs />
          </Container>
          <AnnouncementDrawer />
        </Box>

      </main>
      <PublicFooter />
    </>
  )
}
