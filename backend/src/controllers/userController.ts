import { Response } from "express";
import { RequestHandler } from "express";
import { AuthRequest } from "../types";
import userModel from "../models/userModel";

export const uploadProfileImage: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    console.log("entering the image uploading controller");
    // Check if user exists in request (set by auth middleware)
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Not authorized",
      });
      return;
    }

    // Check if file exists in request
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
      return;
    }

    // Get the file path that was saved by multer
    const filePath = req.file.path;

    // Convert file path to URL format
    // const imageUrl = filePath.replace("public", "");
    const path = req.file.path.replace(/\\/g, '/');
    console.log(path,'--------------path');
    const imageUrl = path.replace('/home/user/Code/Mern-Auth/backend/public', 'http://localhost:3000')

    // Update user profile with new image URL
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user.userId,
      { imagePath: imageUrl },
      {
        new: true,
        select: "-password", // Exclude password from the returned user object
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
