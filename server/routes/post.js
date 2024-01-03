import { Router } from "express";
import { getPost, getPosts, writePost } from "../controllers/postController.js";
import isAuthenticated from "../middelware/authentication.js";

const postRouter = Router();

postRouter.post("/write", isAuthenticated, writePost);
postRouter.get("/:id", getPost);
postRouter.get("/", getPosts);
// postRouter.get("/recommendations", fetchRecommendationData);

export default postRouter;
