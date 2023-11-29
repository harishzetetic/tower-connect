import { ILoggedInUser } from "./Types";


export const getLoggedInUserData = ():ILoggedInUser|null => {
    if(window && window?.sessionStorage){
        const data = window.sessionStorage.getItem('loggedInUserInfo');
        if(data){
            return JSON.parse(data)
        }
    }
    return null;
}
