import { Router } from "express";
import { register , login, refresh,logout } from "../controllers/authController";


export const authRoutes:Router = Router();

authRoutes.post('/register',register);
authRoutes.post('/login',login);
authRoutes.post('/refresh',refresh);
authRoutes.post('/logout',logout);