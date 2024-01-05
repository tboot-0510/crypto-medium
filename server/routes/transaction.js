import { Router } from "express";
import { processWithError } from "../middelware/process_with_error";
import { getTransactionByHash } from "../services/transaction_service";

const transactionRouter = Router();

transactionRouter.get(
  "/status/:tx",
  processWithError(getTransactionByHash(req.params.tx, req.params.chainId))
);
