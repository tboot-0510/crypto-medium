import { Router } from "express";
import {
  getTagRecommendations,
  getRSSTagTopics,
  getSuggestionPosts,
} from "../controllers/feedController.js";
import { processWithError } from "../middelware/process_with_error.js";

const feedRouter = Router();

feedRouter.post("/tag", processWithError(getRSSTagTopics));
feedRouter.get("suggestions", processWithError(getSuggestionPosts));
feedRouter.get("/recommendations", processWithError(getTagRecommendations));

export default feedRouter;
