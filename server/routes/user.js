import { Router } from "express";
import isAuthenticated from "../middelware/authentication.js";
import { handleCryptoPayment } from "../controllers/userController.js";
import { processWithError } from "../middelware/process_with_error.js";

const userRouter = Router();

userRouter.post(
  "/crypto_payment",
  isAuthenticated,
  processWithError(handleCryptoPayment)
);

export default userRouter;
