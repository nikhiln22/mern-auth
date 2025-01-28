import { Response, NextFunction } from 'express';
import { AuthRequest, UserApiResponse } from '../types';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt';

export const adminAuth = async (
    req: AuthRequest,
    res: Response<UserApiResponse>,
    next: NextFunction
): Promise<void> => {
    try {
        // Get the token from authorization header
        console.log("entering the admin middleware");
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify the token
            const decoded = jwt.verify(token, JWT_CONFIG.secret) as { userId: string; isAdmin: boolean };
            
            // Find the user and explicitly check their current admin status in the database
            const admin = await User.findById(decoded.userId);

            console.log("admin:",admin);
            
            if (!admin) {
                res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
                return;
            }

            // Verify admin status
            if (!admin.isAdmin) {
                res.status(403).json({
                    success: false,
                    message: 'Admin access required'
                });
                return;
            }

            // Add user info to request for use in subsequent middleware/routes
            req.user = {
                userId: admin._id.toString(),
                email: admin.email,
                isAdmin: admin.isAdmin
            };

            next();
        } catch (error) {
            res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
            return;
        }
    } catch (error) {
        console.error('Admin authorization error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during admin authorization'
        });
        return;
    }
};