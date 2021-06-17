
export interface User{
    id: string;
    name: string;
    bussinessname?: string;
    mobile: string; 
    latitude?:number;
    longitude?: number;
}

export interface Services{
    id: string;
    ServiceName: string;
    duration:string;
    price:string;
}

export interface dummy {
    name: String;
}