
export interface IUser {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    imagePath?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface IRegisterCredentials {
    name: string;
    email: string;
    phone: string;
    password: string;
    imagePath?: string;
}