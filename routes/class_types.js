import express from "express";
import {
  getAllClassTypes,
  getClassTypeById,
  createClassType,
  updateClassTypeById,
  deleteClassTypeById,
} from "../controllers/class_types-controller.js";

const router = express.Router();

// Get all class types
router.get("/", getAllClassTypes);

// Get a single class type by ID
router.get("/:id", getClassTypeById);

// Create a new class type
router.post("/", createClassType);

// Update a class type by ID
router.put("/:id", updateClassTypeById);

// Delete a class type by ID
router.delete("/:id", deleteClassTypeById);

export default router;
