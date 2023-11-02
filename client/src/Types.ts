
export interface IGoogleUserData {
    given_name:string;
    family_name:string;
    email:string;
    picture:string
}

export interface ISociety{
    builderName:string;
    societyName:string;
    country:string;
    state:string;
    city:string;
    pin:number;
    addressline2:string;
    addressline1:string;
    _id:string,
}

export interface IOwnerSignupFormData {
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
        confirmPassword: string | null
}