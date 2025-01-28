import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../config/jwt";
import userModel from "../models/userModel";
import { JwtPayload } from "../types";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const auth: RequestHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Log all headers for debugging
    console.log("Request Headers:", req.headers);

    const authHeader = req.headers.authorization;
    console.log("authHeader:", authHeader);

    if (!authHeader) {
      res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "Invalid token format" });
      return;
    }

    const token = authHeader.split(" ")[1];

    console.log("token:", token);

    const decoded = jwt.verify(token, JWT_CONFIG.secret) as JwtPayload;

    console.log("decoded:", decoded);

    const user = await userModel.findById(decoded.userId).select("-password");

    console.log("user:", user);

    if (!user) {
      res.status(401).json({ success: false, message: "User not found" });
      return;
    }

    req.user = decoded;
    console.log("req.user:", req.user);
    next();
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(401).json({ success: false, message: "Not authorized" });
    return;
  }
};
