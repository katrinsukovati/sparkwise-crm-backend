import express from "express";
import {
  getAllEnrollments,
  getEnrollmentById,
  enrollStudent,
  deleteEnrollmentById,
  getEnrollmentsByStudentId,
} from "../controllers/class_enrollments-controller.js";

const router = express.Router();

// get all enrollments
router.get("/", getAllEnrollments);

// get single enrollment by ID
router.get("/:id", getEnrollmentById);

// get all the enrollments for one student based on their id
router.get("/student/:student_id", getEnrollmentsByStudentId);

// enroll a student in a class
router.post("/", enrollStudent);

// delete an enrollment by id
router.delete("/:id", deleteEnrollmentById);

export default router;
