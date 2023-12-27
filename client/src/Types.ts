import * as Yup from 'yup';
import { App } from './constants';
import { createTheme } from '@mui/material';


export interface IGoogleUserData {
    given_name:string;
    family_name:string;
    email:string;
    picture:string
}

export interface ISociety{
    _id:string,
    builderName:string;
    societyName:string;
    country:string;
    state:string;
    city:string;
    pin:number;
    addressline2:string;
    addressline1:string;
}

export interface IOwnerData {
        society: ISociety | null, 
        towerNumber: string | null,
        flatNumber: string | null,
        flatType: string | null,
        firstName: string | null,
        lastName: string | null,
        email:string | null,
        phone:string | null,
        dob:string | null,
        imageUrl: string | null,
        proofDocument: File | null,
        password: string | null,
        confirmPassword: string | null,
        proofDocumentURL?: string | null,
        _id?: string
}
export interface IOwnerLoginData {
    society: ISociety | null, 
    towerNumber: string | null,
    flatNumber: string | null,
    password: string | null
  }


export const SocietyValidationSchema = Yup.object().shape({
    _id:Yup.string(),
    builderName:Yup.string(),
    societyName:Yup.string(),
    country:Yup.string(),
    state:Yup.string(),
    city:Yup.string(),
    pin:Yup.number(),
    addressline2:Yup.string(),
    addressline1:Yup.string(),
}).required("Select any society")


export const APP_THEME = createTheme({
  
    typography: {
      fontFamily: [
        'General Sans',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

  export interface IBuySell {
    _id?: string,
    images: Array<File | null | string>,
    title:string | null,
    price: string | null,
    category: string | null,
    condition: string | null,
    description: string | null,
    ownerid?: string | null,
    societyid?: string | null,
    created_at?:string | null,
    isSold?:boolean,
    ownerData?:IOwnerData  // expected from the backend after aggregate lookup join query
}

export type notificationType = 'error' | 'success' | 'warn';
