"use client";
import { IOwnerData, ISociety } from "@/Types";
import { getAllSocieties } from "@/api/societiesApis";
import { addSocieties } from "@/store/slices/societySlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { useRouter } from 'next/navigation';
import Loading from "@/app/Loading";
import { BACKEND_URL, publicPathNames } from "@/constants";
import { io } from "socket.io-client";
import { getLoggedInUser } from "@/api/ownerApis";
import { updatedLoggedInUser } from "@/store/slices/loggedInUserSlice";
import { getToken } from "@/util";
import { usePathname } from 'next/navigation'

export function ReduxFetch({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
  const [isDataFetching, setIsDataFetching] = React.useState(true);
  const dispatch = useDispatch();
  const router = useRouter()
 const fetchSocieties = async()=>{
  try{
    const societiesApiResponse = await getAllSocieties();  
      if(societiesApiResponse?.status === 200){
        dispatch(addSocieties(societiesApiResponse.data as ISociety[]))
        
      }
  } catch(e){
      console.log(e)
  }   
 }

 const getLoggedInUserInfo = async() => {
  const token = getToken()
    const result = await getLoggedInUser(token);
    if(result?.status === 200){
      dispatch(updatedLoggedInUser(result.data as IOwnerData))
      setIsDataFetching(false)
    }
}
  useEffect(()=>{
    if(publicPathNames.includes(pathname)){
      fetchSocieties(); // public call
      setIsDataFetching(false)
    } else {
      fetchSocieties(); // public call
      getLoggedInUserInfo() // loggedin user call
    }
    return () => { // When user clsoe the tab or window, we will remove online status
      io(BACKEND_URL).emit('removeUser', loggedInUser);
    }
    }, []);

    React.useEffect(()=>{
      if(loggedInUser._id){
        io(BACKEND_URL).emit('addUser', loggedInUser) // adding the user to online state with socket io
      }
  },[loggedInUser])

    return (isDataFetching) ? <Loading/> : <>{children}</>
}