import { useRouter } from "next/navigation";
import { ILoggedInUser, notificationType } from "./Types";
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

export const pushNotification = (type:notificationType, title:string, description:string, time:number = 15000) => {
    switch(type){
        case 'error':
            NotificationManager.error(title, description, time, () => { });
            return;
        case 'success':
            NotificationManager.success(title, description, time, () => { });
            return;
        case 'warn':
            NotificationManager.info(title, description, time, () => { });
            return;
    }
}
