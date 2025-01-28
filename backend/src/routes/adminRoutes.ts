import express, { Router } from "express";
import { adminLogin } from "../controllers/adminController/adminAuthController";
import {
  dashboard,
  deleteUser,
  editUser,
  addUser,
} from "../controllers/adminController/adminController";
import { adminAuth } from "../middleware/adminAuthMiddleware";

const adminRoute: Router = express.Router();

adminRoute.post("/adminlogin", adminLogin);
adminRoute.get("/dashboard", adminAuth, dashboard);
adminRoute.delete("/deleteuser/:id", adminAuth, deleteUser);
adminRoute.put("/edituser/:id", adminAuth, editUser);
adminRoute.post("/adduser", adminAuth, addUser);

export default adminRoute;
