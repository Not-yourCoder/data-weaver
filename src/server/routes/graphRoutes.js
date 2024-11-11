import { Router } from "express";
import {
  getGraphData,
  getNodesByRelationship,
  getRelationships,
  getSuggestions,
  postGraphNodes,
  searchNode,
} from "../controllers/graphControllers.js";

const router = Router();
// Get Routes
router.get("/graph-one", getGraphData);
router.get("/suggestions", getSuggestions);
router.get("/fetch-links", getRelationships);

// Post Routes
router.post("/fetch-nodes", postGraphNodes);
router.post("/search-query", searchNode);
router.post("/post-link", getNodesByRelationship);
export default router;
