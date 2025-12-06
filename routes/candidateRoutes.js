import express from "express";
import {
  addCandidate,
  getCandidates,
  getSingleCandidate,
  updateCandidate,
  deleteCandidate
} from "../controllers/candidateController.js";

const router = express.Router();

// POST → Add candidate
router.post("/", addCandidate);

// GET → List all candidates
router.get("/", getCandidates);

// ✅ NEW — Get single candidate by candidateId
router.get("/single/:candidateId", getSingleCandidate);

// PUT → Update candidate
router.put("/:id", updateCandidate);

// DELETE → Delete candidate
router.delete("/:id", deleteCandidate);


export default router;
