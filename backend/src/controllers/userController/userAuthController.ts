import {
  UserHandler,
  RegisterRequestBody,
  LoginRequestBody,
  UserApiResponse,
  JwtPayload,
  IUser,
} from "../../types";
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

// controller function for registering a new User
export const register: UserHandler = async (req, res, next) => {
  try {
    console.log("user registration initiated:");
    const { name, email, phone, password } = req.body as RegisterRequestBody;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password) {
      const response: UserApiResponse = {
        success: false,
        message: "All fields required",
      };
      res.status(400).json(response);
      return;
    }

    const existingUser = await userModel.findOne({
      email: email.toLowerCase(),
    });
    console.log("existingUser:", existingUser);
    if (existingUser) {
      const response: UserApiResponse = {
        success: false,
        message: "User Already Exists",
      };
      res.status(409).json(response);
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
      isAdmin: false,
    });

    console.log("created new user:", newUser);

    const response: UserApiResponse = {
      success: true,
      message: "User Registered successfully",
      data: {
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
        },
      },
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Registration Error:", error);
    const response: UserApiResponse = {
      success: false,
      message: "Internal Server Error",
    };
    res.status(500).json(response);
  }
};

// controller function for logging in the existing user
export const login: UserHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as LoginRequestBody;

    if (!email?.trim() || !password) {
      const response: UserApiResponse = {
        success: false,
        message: "Email and password are required",
      };
      res.status(400).json(response);
      return;
    }

    const user = await userModel.findOne({
      email: email.toLowerCase().trim(),
      isAdmin: false,
    });
    console.log("userData:", user);
    if (!user) {
      const response: UserApiResponse = {
        success: false,
        message: "Invalid credentials",
      };
      res.status(401).json(response);
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      const response: UserApiResponse = {
        success: false,
        message: "Invalid credentials",
      };
      res.status(401).json(response);
      return;
    }

    const tokens = generateTokens(user);

    const response: UserApiResponse = {
      success: true,
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          imagePath: user.imagePath,
        },
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

// controller function for generating the refresh tokens
export const refreshToken: UserHandler = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Refresh token required",
      });
    }

    const decoded = jwt.verify(token, JWT_CONFIG.secret) as JwtPayload;
    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const tokens = generateTokens(user);

    const response: UserApiResponse = {
      success: true,
      message: "Token refresh successful",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        tokens,
      },
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Token Refresh Error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};
