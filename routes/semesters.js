import express from "express";
import {
  getAllSemesters,
  getSemesterById,
  createSemester,
  updateSemesterById,
  deleteSemesterById,
} from "../controllers/semesters-controller.js";

const router = express.Router();

// Get all semesters
router.get("/", getAllSemesters);

// Get single semester by ID
router.get("/:id", getSemesterById);

// Create a new semester
router.post("/", createSemester);

// Update a semester by ID
router.put("/:id", updateSemesterById);

// Delete a semester by ID
router.delete("/:id", deleteSemesterById);

export default router;
