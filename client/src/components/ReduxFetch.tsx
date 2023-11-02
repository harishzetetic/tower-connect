"use client";
import { ISociety } from "@/Types";
import { getAllSocieties } from "@/api/societiesApis";
import { addSocieties } from "@/store/slices/societySlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export function ReduxFetch({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const getAllSocietiesInfo = async() => {
    const result = await getAllSocieties();
    if(result?.status === 200){
      console.log('Getting societies from network for creating store...')
      dispatch(addSocieties(result.data as ISociety[]))
    }
  }
  useEffect(()=>{
    getAllSocietiesInfo();
    }, []);
  return <>{children}</>;
}