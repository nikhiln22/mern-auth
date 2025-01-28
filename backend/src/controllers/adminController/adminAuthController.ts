import {
  UserHandler,
  LoginRequestBody,
  UserApiResponse,
  JwtPayload,
  IUser,
} from "../../types";
import adminModel from "../../models/userModel";
import userModel from "../../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_CONFIG } from "../../config/jwt";

// controller function for generate tokens
const generateTokens = (user: IUser) => {
  const payload: JwtPayload = {
    userId: user._id.toString(),
    email: user.email,
    isAdmin: user.isAdmin,
  };

  const accessToken = jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.accessTokenExpiry,
  });

  const refreshToken = jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.refreshTokenExpiry,
  });

  return { accessToken, refreshToken };
};

// controller function for logging in the admin
export const adminLogin: UserHandler = async (req, res, next) => {
  try {
    console.log("entering into the admin verification function");
    const { email, password } = req.body as LoginRequestBody;

    if (!email?.trim() || !password) {
      const response: UserApiResponse = {
        success: false,
        message: "Email and password are required",
      };
      res.status(400).json(response);
      return;
    }

    const admin = await adminModel.findOne({
      email: email.toLowerCase().trim(),
      isAdmin: true,
    });

    console.log("adminData:", admin);
    if (!admin) {
      const response: UserApiResponse = {
        success: false,
        message: "Invalid credentials",
      };
      res.status(401).json(response);
      return;
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      const response: UserApiResponse = {
        success: false,
        message: "Invalid credentials",
      };
      res.status(401).json(response);
      return;
    }

    const tokens = generateTokens(admin);

    const response: UserApiResponse = {
      success: true,
      message: "Login successful",
      data: {
        tokens,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Login Error:", error);
    const response: UserApiResponse = {
      success: false,
      message: "Internal Server Error",
    };
    res.status(500).json(response);
  }
};


