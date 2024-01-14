import React from 'react'
import { useRouter } from 'next/navigation'
import { APP_THEME, IIncomingMessage, IOwnerData } from '@/Types';
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client'
import { BACKEND_URL } from '@/constants';
import Swal from 'sweetalert2';
import { ThemeProvider } from '@emotion/react';
import TopNavigation from '../dashboard/topNavigation';
import { Grid, Toolbar } from '@mui/material';
import Sidebar from '../dashboard/sidebar';
import SellItemWizard from '../dashboard/sellItemWizard';


export function HOC(Component) {
  return function (props) {
    const router = useRouter()
    const [openSellWizard, setOpenSellWizard] = React.useState<boolean>(false);
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
    React.useEffect(()=>{
      io(BACKEND_URL).on('getMessage', (data: IIncomingMessage)=>{
          if(data.sendTo._id === loggedInUser._id){
            Swal.fire({
              title: '',
              text: `New message recieved`,
              icon: 'info',
              toast: true,
              timer: 3000,
              animation: false,
              position: 'top-right',
              showConfirmButton: false,
          })
          } 
      })

  }, [])
    React.useEffect(()=>{
      if(!loggedInUser){
          router.push('/login/owner')
      }
  })
  if(loggedInUser){
    return (
      <ThemeProvider theme={APP_THEME}>
         <TopNavigation />
         <Sidebar loggedInUser={loggedInUser} setOpenSellWizard={setOpenSellWizard} />
         <Toolbar />
         <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={6} md={2}></Grid>
                <Grid item xs={6} md={10}>
                  <Component {...props} />
                </Grid>
        </Grid>
         
         <SellItemWizard openSellWizard={openSellWizard} setOpenSellWizard={setOpenSellWizard} />
      </ThemeProvider>
     
    );
  }
    return <>User probably not logged in. Kindly login again.</>
  }
}