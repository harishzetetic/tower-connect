"use client"
import { Box} from '@mui/material';
import Featured from '../components/landingpage/Featured';
import PublicHeader from '../components/landingpage/PublicHeader';
import WhyUs from '../components/landingpage/WhyUs';
import { App } from '@/constants';

export default function Home() {
  return (
      <>
        <Box className='full_viewport_height' style={{ background: App.Background }}>
          <PublicHeader />
          <Featured />
        </Box>
        <WhyUs />
    </>
  )
}
