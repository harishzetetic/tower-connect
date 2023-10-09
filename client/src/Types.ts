

export interface ISociety{
    builderName:string;
    societyName:string;
    country:string;
    state:string;
    city:string;
    pin:number;
    addressline2:string;
    addressline1:string;
}

export interface IOwnerSignupInitialValues {
        allSocieties: ISociety,
        towerNumber: string,
        flatNumber: string
    
}