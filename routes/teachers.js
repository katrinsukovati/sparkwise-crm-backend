import express from "express";
import {
  getAllTeachers,
  getTeacherById,
  createNewTeacher,
  updateTeacherById,
  deleteTeacherById,
} from "../controllers/teachers-controller.js";

const router = express.Router();

// Get all teachers
router.get("/", getAllTeachers);

// Get a single teacher by ID
router.get("/:id", getTeacherById);

// Create a new teacher
router.post("/", createNewTeacher);

// Update a teacher by ID
router.put("/:id", updateTeacherById);

// Delete a teacher by ID
router.delete("/:id", deleteTeacherById);

export default router;
