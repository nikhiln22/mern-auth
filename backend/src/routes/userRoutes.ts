import express, { Router } from "express";
import {
  register,
  login,
} from "../controllers/userController/userAuthController";
import {
  uploadProfileImage,
  updateUserProfile,
} from "../controllers/userController/userController";
import { auth } from "../middleware/userAuthMiddleware";
import upload from "../config/multer";

const userRoute: Router = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post(
  "/uploadimage",
  auth,
  upload.single("image"),
  uploadProfileImage
);
userRoute.put("/updateprofile", auth, updateUserProfile);


export default userRoute;
