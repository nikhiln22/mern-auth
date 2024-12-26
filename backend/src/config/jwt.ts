
import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};