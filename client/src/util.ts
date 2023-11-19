import { ILoggedInUser } from "./Types";


export const getLoggedInUserData = ():ILoggedInUser|null => {
    const data = sessionStorage.getItem('loggedInUserInfo');
    if(data){
        return JSON.parse(data)
    }
    return null;
}
