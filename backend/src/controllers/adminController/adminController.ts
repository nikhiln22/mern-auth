import { Response } from "express";
import { RequestHandler } from "express";
import { AuthRequest, UserApiResponse } from "../../types";
import userModel from "../../models/userModel";
import bcrypt from 'bcryptjs'

// displaying all the users in the admin dashboard
export const dashboard = async (
  req: AuthRequest,
  res: Response<UserApiResponse>
): Promise<void> => {
  try {
    console.log("entering the use fetching controller code");
    const users = await userModel
      .find({ isAdmin: false })
      .select("name email phone _id")
      .sort({ createdAt: -1 });

    const usersList = users.map((user) => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }));

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        usersList,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

// deleting the user by the admin
export const deleteUser = async (
  req: AuthRequest,
  res: Response<UserApiResponse>
): Promise<void> => {
  try {
    console.log("deleting already registered user by the admin");
    const userId = req.params.id;
    console.log("userId:", userId);

    if (!userId) {
      res.status(400).json({
        success: false,
        message: "User ID is required",
      });
      return;
    }

    const user = await userModel.findById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    await userModel.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
    });
  }
};

// editing the existing user by the admin side

export const editUser = async (
    req: AuthRequest,
    res: Response<UserApiResponse>
  ): Promise<void> => {
    try {
      console.log("Entering edit user by admin controller");
      const userId = req.params.id;
      const { name, email, phone } = req.body;
  
      // Validate request body
      if (!name || !email || !phone) {
        res.status(400).json({
          success: false,
          message: "Please provide all required fields: name, email, and phone",
        });
        return;
      }
  
      // Check if user exists
      const existingUser = await userModel.findById(userId);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }
  
      // Check if email is already taken by another user
      const emailExists = await userModel.findOne({
        email,
        _id: { $ne: userId },
      });
  
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: "Email already exists",
        });
        return;
      }
  
      // Update user
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          phone,
        },
        { new: true } // Return updated document
      ).select("name email phone _id");
  
      if (!updatedUser) {
        res.status(500).json({
          success: false,
          message: "Error updating user",
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: {
          user: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
          },
        },
      });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({
        success: false,
        message: "Error updating user",
      });
    }
  };

// adding new user from admin side
export const addUser = async (
    req: AuthRequest,
    res: Response<UserApiResponse>
  ): Promise<void> => {
    try {
      console.log("entering add user by admin controller");
      const { name, email, phone, password } = req.body;
  
      // Validate request body
      if (!name || !email || !phone || !password) {
        res.status(400).json({
          success: false,
          message: "Please provide all required fields: name, email, phone, and password",
        });
        return;
      }
  
      // Check if email already exists
      const emailExists = await userModel.findOne({ email });
      if (emailExists) {
        res.status(400).json({
          success: false,
          message: "Email already exists",
        });
        return;
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create new user
      const newUser = new userModel({
        name,
        email,
        phone,
        password: hashedPassword,
        isAdmin: false, // Ensure user is not admin
      });
  
      await newUser.save();
  
      // Return user data without sensitive information
      const userData = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
      };
  
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: {
          user: userData,
        },
      });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({
        success: false,
        message: "Error creating user",
      });
    }
  };
