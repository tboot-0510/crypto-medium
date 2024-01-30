import { Router } from "express";
import {
  getPost,
  getPosts,
  writePost,
  getPostVotes,
} from "../controllers/postController.js";
import isAuthenticated from "../middelware/authentication.js";
import { processWithError } from "../middelware/process_with_error.js";

const postRouter = Router();

postRouter.post("/write", isAuthenticated, processWithError(writePost));
postRouter.get("/:id", isAuthenticated, processWithError(getPost));
postRouter.get("/:id/votes", isAuthenticated, processWithError(getPostVotes));
postRouter.get("/", getPosts);
// postRouter.get("/recommendations", fetchRecommendationData);

export default postRouter;
