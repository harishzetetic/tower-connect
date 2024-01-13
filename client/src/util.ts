import Swal, { SweetAlertOptions } from "sweetalert2";
import { SwalIcons, notificationType } from "./Types";

export const getToken = ():string|null => {
    if(window && window?.sessionStorage){
        const token = window.sessionStorage.getItem('token');
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
    animation: false,
    position: 'top-right',
    showConfirmButton: false,
} as SweetAlertOptions)
