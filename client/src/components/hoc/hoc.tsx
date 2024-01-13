import React from 'react'
import { useRouter } from 'next/navigation'
import { IIncomingMessage, IOwnerData } from '@/Types';
import { useSelector } from 'react-redux';
import {io} from 'socket.io-client'
import { BACKEND_URL } from '@/constants';
import Swal from 'sweetalert2';


export function HOC(Component) {
  return function (props) {
    const router = useRouter()
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
    return (
      <Component {...props} />
    );
  }
}