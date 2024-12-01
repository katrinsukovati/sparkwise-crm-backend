import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
} from "../controllers/students-controller.js";

const router = express.Router();

// Get all students
router.get("/", getAllStudents);

// Get single student by ID
router.get("/:id", getStudentById);

// Create a new student
router.post("/", createStudent);

// Update a student by ID
router.put("/:id", updateStudentById);

// Delete a student by ID
router.delete("/:id", deleteStudentById);

export default router;
