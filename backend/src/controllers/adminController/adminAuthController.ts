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
        message: "Invalid Email",
      };
      res.status(401).json(response);
      return;
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      const response: UserApiResponse = {
        success: false,
        message: "Invalid Password",
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

// refreshing the access token using the refresh token
export const refreshToken: UserHandler = async (req, res) => {
  try {
    console.log("entering to the access token recreating controller for admin upon access token expiry")
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required"
      })
    }

    try {
      const decoded = jwt.verify(refreshToken, JWT_CONFIG.secret) as JwtPayload;
      console.log("decoded", decoded);

      const admin = await adminModel.findById(decoded.userId);

      if (!admin || !admin.isAdmin) {
        return res.status(401).json({
          success: false,
          message: "invalid refresh token"
        });
      }

      const tokens = generateTokens(admin);

      console.log("newly created tokens for admin:", tokens);

      res.json({
        success: true,
        message: "Tokens created successfully for admin",
        data: { tokens }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh Token"
      });
    }
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
}


