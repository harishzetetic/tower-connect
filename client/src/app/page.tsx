"use client"
import { Box, ThemeProvider, createTheme} from '@mui/material';
import Featured from '../components/landingpage/Featured';
import PublicHeader from '../components/landingpage/PublicHeader';
import WhyUs from '../components/landingpage/WhyUs';
import { App } from '@/constants';
import { APP_THEME } from '@/Types';

export default async function Page() {
  return (
    <ThemeProvider theme={APP_THEME}>
        <Box className='full_viewport_height' style={{ backgroundColor: App.DarkBlue }}>
          <PublicHeader />
          <Featured />
        </Box>
        <WhyUs />
        </ThemeProvider>
  )
}
