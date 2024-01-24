import { Router } from "express";
import isAuthenticated from "../middelware/authentication.js";
import {
  handleCryptoPayment,
  handleStripePayment,
} from "../controllers/userController.js";
import { processWithError } from "../middelware/process_with_error.js";

const userRouter = Router();

userRouter.post(
  "/crypto_payment",
  isAuthenticated,
  processWithError(handleCryptoPayment)
);

userRouter.post(
  "/stripe_payment",
  isAuthenticated,
  processWithError(handleStripePayment)
);

export default userRouter;
