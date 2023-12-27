"use client";
import { IOwnerData, ISociety } from "@/Types";
import { getAllSocieties } from "@/api/societiesApis";
import { addSocieties } from "@/store/slices/societySlice";
import { updatedLoggedInUser } from "@/store/slices/loggedInUserSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import { getLoggedInUser } from "@/api/ownerApis";
import { getToken } from "@/util";
import React from "react";
import Loading from "@/app/Loading";

export function ReduxFetch({ children }: { children: React.ReactNode }) {
  const [isDataFetching, setIsDataFetching] = React.useState(true);
  const router = useRouter()
  const logout = () => {
      sessionStorage.removeItem('token');
      router.push('/login/owner')
  }

  const dispatch = useDispatch();

  const getLoggedInUserInfo = async() => {
    const token = getToken()
    if(!token){ logout() } else {
      const result = await getLoggedInUser(token);
      if(result?.status === 200){
        console.log('Checking token if valid and updating user in store...')
        dispatch(updatedLoggedInUser(result.data as IOwnerData))
      }
    }
    
  }
  const getAllSocietiesInfo = async() => {
    const result = await getAllSocieties();
    if(result?.status === 200){
      console.log('Getting societies from network for creating store...')
      dispatch(addSocieties(result.data as ISociety[]))
    }
  }
  useEffect(()=>{
    getLoggedInUserInfo();
    getAllSocietiesInfo();
    setIsDataFetching(false)
    }, []);
    return isDataFetching ? <Loading/> : <>{children}</>
}