import { Router } from "express";
import { processWithError } from "../middelware/process_with_error.js";
import { getTransactionByHash } from "../services/transaction_service.js";
import isAuthenticated from "../middelware/authentication.js";
import { getTransactionStatus } from "../controllers/transactionController.js";

const transactionRouter = Router();

transactionRouter.get(
  "/status/:tx",
  processWithError(async (req) => {
    return await getTransactionByHash(req.params.tx, req.params.chainId);
  })
);

transactionRouter.get(
  "/:id",
  isAuthenticated,
  processWithError(getTransactionStatus)
);

export default transactionRouter;
