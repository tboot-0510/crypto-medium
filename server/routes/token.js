import { Router } from "express";
import isAuthenticated from "../middelware/authentication.js";
import { getTokenPrice } from "../controllers/tokenController.js";
import { processWithError } from "../middelware/process_with_error.js";

const tokenRouter = Router();

tokenRouter.get("/price", isAuthenticated, processWithError(getTokenPrice));
export default tokenRouter;
