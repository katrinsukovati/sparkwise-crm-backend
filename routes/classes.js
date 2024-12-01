import express from "express";
import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
} from "../controllers/classes-controller.js";

const router = express.Router();

// Get all classes
router.get("/", getAllClasses);

// Get single class by ID
router.get("/:id", getClassById);

// Create new class
router.post("/", createClass);

// Update a class by ID
router.put("/:id", updateClass);

// Delete a class by ID
router.delete("/:id", deleteClass);

export default router;
