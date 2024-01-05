import { Router } from "express";
import {
  handleLogin,
  handleSignUp,
  handleRefreshToken,
  handleMeApi,
  handleLogout,
  getMessageToSign,
  handleSignUpWeb3,
  handleMetamaskSignUp,
  handleMetamaskSignIn,
} from "../controllers/authController.js";
import isAuthenticated from "../middelware/authentication.js";
import { processWithError } from "../middelware/process_with_error.js";

const authRouter = Router();

authRouter.post("/login", processWithError(handleLogin));
authRouter.post("/logout", isAuthenticated, processWithError(handleLogout));
authRouter.post("/signup", processWithError(handleSignUp));
authRouter.post("/signup_web3", processWithError(handleSignUpWeb3));
authRouter.get("/refresh", processWithError(handleRefreshToken));
authRouter.get("/me", isAuthenticated, processWithError(handleMeApi));
authRouter.get("/start_sign_in_web3", processWithError(getMessageToSign));
authRouter.get(
  "/wallet_callback",
  processWithError(async (req) => {
    const { signatureParams, signature, type } = req.query;
    if (type === "signin")
      return await handleMetamaskSignIn(signatureParams, signature);
    if (type === "signup")
      return await handleMetamaskSignUp(signatureParams, signature);
    throw new Error(`Unhandled wallet_callback type ${type}`);
  })
);
export default authRouter;
