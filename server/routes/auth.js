import { Router } from "express";
import {
  handleLogin,
  handleSignUp,
  handleRefreshToken,
  handleMeApi,
  handleLogout,
  handleMetamaskLogin,
} from "../controllers/authController.js";
import isAuthenticated from "../middelware/authentication.js";

const authRouter = Router();

authRouter.post("/login", handleLogin);
authRouter.post("/logout", isAuthenticated, handleLogout);
authRouter.post("/signup", handleSignUp);
authRouter.get("/refresh", handleRefreshToken);
authRouter.get("/me", isAuthenticated, handleMeApi);
authRouter.get("/start_sign_in_web3", handleMetamaskLogin);
export default authRouter;
