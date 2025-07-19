"use client"
import { Box, ThemeProvider} from '@mui/material';
import Featured from '../components/landingpage/Featured';
import WhyUs from '../components/landingpage/WhyUs';
import Features from '../components/landingpage/Features';
import Testimonials from '../components/landingpage/Testimonials';
import CallToAction from '../components/landingpage/CallToAction';
import { App } from '@/constants';
import { APP_THEME } from '@/Types';

export default function Page() {
  return (
    <ThemeProvider theme={APP_THEME}>
        <Box className='full_viewport_height' style={{ backgroundColor: App.DarkBlue }}>
          <Featured />
        </Box>
        <Features />
        <WhyUs />
        <Testimonials />
        <CallToAction />
    </ThemeProvider>
  )
}
