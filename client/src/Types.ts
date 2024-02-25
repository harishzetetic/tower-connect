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

interface IOwnerDataServerFields{
        readonly _id?: string,
        readonly society?: ISociety | undefined
}
export interface IOwnerData extends IOwnerDataServerFields{
        societyId: string | null, 
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
}
export interface IOwnerLoginData {
  societyId: string | null, 
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

const drawerWidth = 240;

export const APP_THEME = createTheme({
  palette: {
    mode: 'dark',
  },
  components: {
    MuiToolbar: {
      defaultProps: {
        sx: {
          boxShadow: 'none'  
        }
      }
    },
    MuiAppBar: {
      defaultProps: {
        sx: {
         backgroundColor: App.DarkBlue,
         width: `calc(100% - ${drawerWidth}px)`,
         ml: `${drawerWidth}px`,
         boxShadow: 'none',
         flexGrow: 1
        }
      },
    }
  },
    typography: {
      allVariants: {
        color: '#fff'
      },
      h1:{},
      h2:{},
      h3:{},
      h4:{},
      h5:{},
      h6:{},
      fontFamily: [
        "IBM Plex Sans","-apple-system","BlinkMacSystemFont","Segoe UI","Roboto","Helvetica Neue","Arial","sans-serif","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"
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

export interface IChat{
  _id?: string,
  users: Array<IOwnerData>,
  latestMessage?:IMessage
}

export interface IMessage{
  _id?: string,
  sender: IOwnerData,
  content: string,
  chat: IChat,
  createdAt: string
}

export interface IIncomingMessage {
  message: IMessage,
  sendTo: IOwnerData
}

export interface ICommunityPost {
  user: IOwnerData,
  society: ISociety,
  content: string,
  likes: Array<string>,
  dislikes: Array<string>,
  comments: any,
  _id?: string,
  created_at?: string,
  updated_at?: string

}

export type SwalIcons= 'success' | 'error' | 'warning' | 'info' | 'question';