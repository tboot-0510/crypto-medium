import { Router } from "express";
import {
  fetchTopicData,
  fetchRecommendationData,
} from "../controllers/feedController.js";

const feedRouter = Router();

feedRouter.post("/tag", fetchTopicData);
feedRouter.get("/recommendations", fetchRecommendationData);

export default feedRouter;
