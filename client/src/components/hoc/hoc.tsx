import React from 'react'
import { useRouter } from 'next/navigation'
import { IOwnerData } from '@/Types';
import { useSelector } from 'react-redux';

export function HOC(Component) {
  return function (props) {
    const router = useRouter()
    const loggedInUser: IOwnerData= useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
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