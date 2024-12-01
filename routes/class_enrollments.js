import express from "express";
import {
  getAllEnrollments,
  getEnrollmentById,
  enrollStudent,
  deleteEnrollmentById,
} from "../controllers/class_enrollments-controller.js";

const router = express.Router();

// Get all enrollments
router.get("/", getAllEnrollments);

// Get single enrollment by ID
router.get("/:id", getEnrollmentById);

// Enroll a student in a class
router.post("/", enrollStudent);

// Delete an enrollment by ID
router.delete("/:id", deleteEnrollmentById);

export default router;
