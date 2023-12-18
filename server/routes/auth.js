import { Router } from "express";
import { handleLogin, handleSignUp } from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/login", handleLogin);
authRouter.post("/signup", handleSignUp);

export default authRouter;
