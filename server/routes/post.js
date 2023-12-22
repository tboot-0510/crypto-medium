import { Router } from "express";
import { writePost } from "../controllers/postController.js";
import isAuthenticated from "../middelware/authentication.js";

const postRouter = Router();

postRouter.post("/write", isAuthenticated, writePost);
// postRouter.get("/recommendations", fetchRecommendationData);

export default postRouter;
