import express, { Router } from "express";
import { register, login } from "../controllers/userAuthController";
import { uploadProfileImage } from "../controllers/userController";
import { auth } from "../middleware/authMiddleware";
import upload from "../config/multer";

const userRoute: Router = express.Router();

userRoute.post("/register", register);
userRoute.post("/login", login);
userRoute.post("/uploadimage",auth,upload.single("image"),uploadProfileImage);

export default userRoute;
