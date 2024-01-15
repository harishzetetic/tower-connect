"use client";
import { IIncomingMessage, IOwnerData, ISociety } from "@/Types";
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
import { createParamsForInfoToast, getToken } from "@/util";
import { usePathname } from 'next/navigation'
import Swal from "sweetalert2";


export function ReduxFetch({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const loggedInUser: IOwnerData = useSelector(reduxStore => (reduxStore as any)?.loggedInUser);
  const [isDataFetching, setIsDataFetching] = React.useState(true);
  const dispatch = useDispatch();
  const router = useRouter()
 const fetchSocieties = async()=>{
    const societiesApiResponse = await getAllSocieties();  
      if(societiesApiResponse?.status === 200){
        dispatch(addSocieties(societiesApiResponse.data as ISociety[])) 
      } 
 }

 const getLoggedInUserInfo = async() => {
    const result = await getLoggedInUser(getToken());
    if(result?.status === 200){
      dispatch(updatedLoggedInUser(result.data as IOwnerData))
    }
}
  useEffect(()=>{
    try{
      if(publicPathNames.includes(pathname)){
        fetchSocieties();
      } else {
        fetchSocieties();
        getLoggedInUserInfo()
      }
    } catch(e){
      Swal.fire(createParamsForInfoToast('info', 'Error', 'Error while fetching required data', 5000));
      router.push('/login/owner')
    } finally{
      setIsDataFetching(false)
    }
    
  
    return () => { io(BACKEND_URL).emit('removeUser', loggedInUser)}}
    ,[]);

    React.useEffect(()=>{
      if(loggedInUser._id){
        io(BACKEND_URL).emit('addUser', loggedInUser) // adding the user to online state with socket io
      }
  },[loggedInUser])

    return (isDataFetching) ? <Loading/> : <>{children}</>
}