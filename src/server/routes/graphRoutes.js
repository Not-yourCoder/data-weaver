import { Router } from "express";
import {
  getGraphData,
  getNodesByRelationship,
  getRelationships,
  postGraphNodes,
  searchNode,
} from "../controllers/graphControllers.js";

const router = Router();
// Get Routes
router.get("/graph", getGraphData);
// router.get("/suggestions", getSuggestions);
router.get("/fetch-links", getRelationships);

// Post Routes
router.post("/fetch-nodes", postGraphNodes);
router.post("/search-query", searchNode);
router.post("/fetch-relationships", getNodesByRelationship);
export default router;
