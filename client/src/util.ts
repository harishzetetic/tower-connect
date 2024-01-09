import { notificationType } from "./Types";
import { NotificationManager } from 'react-notifications';

export const getToken = ():string|null => {
    if(window && window?.sessionStorage){
        const token = window.sessionStorage.getItem('token');
        return token 
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
