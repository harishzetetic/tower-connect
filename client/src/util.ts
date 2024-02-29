import { SweetAlertOptions } from "sweetalert2";
import { SwalIcons } from "./Types";

export const getToken = ():string|null => {
    if(window && window?.localStorage){
        const token = window.localStorage.getItem('token');
        return token 
    }
    return null;
}

export const createParamsForInfoToast = (type: SwalIcons, title:string, description:string, timer:number=3000) => ({
    title: title,
    text: description,
    icon: type,
    toast: true,
    timer: 3000,
    animation: true,
    position: 'top-right',
    showConfirmButton: false,
} as SweetAlertOptions)

