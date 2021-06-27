
export interface User{
    id: string;
    name: string;
    bussinessname?: string;
    mobile: string; 
    latitude?:number;
    longitude?: number;
    profile_img?: string;
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

export interface workPhoto{
    product1?: string;
    product2?: string;
    product3?: string;
    product4?: string;
    product5?: string;
}