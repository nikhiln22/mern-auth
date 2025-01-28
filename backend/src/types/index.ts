import { Request, Response, NextFunction } from 'express';
import { Document, Types } from 'mongoose';

// Mongoose User Document Interface
// Extends MongoDB Document to include user-specific fields
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

// JWT Payload Interface
// Defines the structure of the data encoded in JWT
export interface JwtPayload {
    userId: string;    // MongoDB user ID
    email: string;    // User's email
    isAdmin: boolean; // User's admin status
}

// Token Response Interface
// Structure for token response after login/register
export interface TokenPayload {
    accessToken: string;  // Short-lived JWT access token
    refreshToken: string; // Long-lived JWT refresh token
}

// Extended Request Interface for Authentication
// Adds user property to Express Request object
export interface AuthRequest extends Request {
    user?: JwtPayload;    // Authenticated user's data
}

// Request Handler Type
// Generic handler type for all controller functions
export type UserHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

// Authentication Handler Type
// Specific handler type for authenticated routes
export type AuthHandler = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => Promise<any>;

// Registration Request Body Interface
// Expected data structure for user registration
export interface RegisterRequestBody {
    name: string;         // User's full name
    email: string;        // User's email
    password: string;     // Plain text password (will be hashed)
    phone: string;        // User's phone number
    imagePath?: string;   // Optional profile image
    isAdmin?: boolean;    // Optional admin status
}

// Login Request Body Interface
// Expected data structure for user login
export interface LoginRequestBody {
    email: string;     // User's email
    password: string;  // User's password
}

// User Data Interface
// Structure for user data in responses
export interface UserData {
    _id:Types.ObjectId
    name: string;        // User's name
    email: string;       // User's email
    phone: string;       // User's phone
    imagePath?: string;  // Optional profile image
}

// Base API Response Interface
// Generic structure for all API responses
export interface ApiResponse {
    success: boolean;     // Operation success status
    message: string;      // Response message
    data?: any;          // Optional response data
}


export interface UserListItem {
    _id:Types.ObjectId;
    name: string;
    email: string;
    phone: string;
}

// Extended User API Response Interface
// Specific structure for user-related responses
export interface UserApiResponse extends ApiResponse {
    data?: {
        user?: UserData;
        usersList?: UserListItem[];  // Add this line
        tokens?: TokenPayload;
    };
}