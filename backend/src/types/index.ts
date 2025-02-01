import { Request, Response, NextFunction } from 'express';
import { Document, Types } from 'mongoose';


export interface IUser extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    password: string;
    phone: string;
    imagePath?: string;
    isAdmin: boolean;
    refreshToken?: string;
}


export interface JwtPayload {
    userId: string;    
    email: string;    
    isAdmin: boolean; 
}


export interface TokenPayload {
    accessToken: string;  
    refreshToken: string; 
}


export interface AuthRequest extends Request {
    user?: JwtPayload;    
}



export type UserHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;


export type AuthHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => Promise<any>;


export interface RegisterRequestBody {
    name: string;        
    email: string;        
    password: string;     
    phone: string;        
    imagePath?: string;   
    isAdmin?: boolean;   
}


export interface LoginRequestBody {
    email: string;     
    password: string;  
}


export interface UserData {
    _id:Types.ObjectId
    name: string;        
    email: string;       
    phone: string;       
    imagePath?: string;  
}


export interface ApiResponse {
    success: boolean;    
    message: string;      
    data?: any;         
}


export interface UserListItem {
    _id:Types.ObjectId;
    name: string;
    email: string;
    phone: string;
}


export interface UserApiResponse extends ApiResponse {
    data?: {
        user?: UserData;
        usersList?: UserListItem[]; 
        tokens?: TokenPayload;
    };
}