import { Router } from "express";
import { getTags, updateTags } from "../controllers/tagController.js";
import isAuthenticated from "../middelware/authentication.js";
import { processWithError } from "../middelware/process_with_error.js";

const tagRouter = Router();

tagRouter.get("/", processWithError(getTags));
tagRouter.post(
  "/:userId/submit",
  isAuthenticated,
  processWithError(updateTags)
);

export default tagRouter;
