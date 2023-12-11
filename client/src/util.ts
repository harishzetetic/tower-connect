import { useRouter } from "next/navigation";
import { ILoggedInUser } from "./Types";
import { NotificationManager } from 'react-notifications';

export const getLoggedInUserData = ():ILoggedInUser|null => {
    if(window && window?.sessionStorage){
        const data = window.sessionStorage.getItem('loggedInUserInfo');
        if(data){
            return JSON.parse(data)
        } 
    }
    return null;
}

export const pushNotification = (type:string, title:string, description:string) => {
    switch(type){
        case 'error':
            NotificationManager.error(title, description, 15000, () => { });
            return;
        case 'success':
            NotificationManager.success(title, description, 15000, () => { });
            return;
        case 'warn':
            NotificationManager.warn(title, description, 15000, () => { });
            return;
    }
}
