import { Response } from "express";
import { RequestHandler } from "express";
import { AuthRequest } from "../../types";
import userModel from "../../models/userModel";

// updating the already existing user profile image
export const uploadProfileImage: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("entering the image uploading controller");

    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }


    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }


    const filePath = req.file.path;

    console.log("filePath:", filePath);

    const path = filePath.replace(/\\/g, "/");
    console.log(path, "--------------path");
    const imageUrl = path.replace(
      "/home/user/Code/Mern-Auth/backend/public",
      "http://localhost:3000"
    );


    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userId,
      { imagePath: imageUrl },
      {
        new: true,
        select: "-password",
      }
    );

    console.log("updatedUser:", updatedUser);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          imagePath: imageUrl,
        },
      },
    });
  } catch (error) {
    console.error("Error in uploadProfileImage:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading profile image",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// updating the already existing user profile details
export const updateUserProfile: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("entering the profile update controller");


    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    const { name, email, phone } = req.body;


    if (!name || !email) {
      res.status(400).json({
        success: false,
        message: "Name and email are required fields",
      });
      return;
    }


    const existingUser = await userModel.findOne({
      email,
      _id: { $ne: req.user.userId },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: "Email already in use by another account",
      });
      return;
    }

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        email,
        phone,
      },
      {
        new: true,
        select: "-password",
      }
    );

    console.log("updatedUser:", updatedUser);

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          imagePath: updatedUser.imagePath,
        },
      },
    });
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};