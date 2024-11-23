import express from "express";
import {
  getEvents,
  getSingleEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  getTodaysEvents,
} from "../controllers/calendar-controller.js";

const router = express.Router();

// Get all calendar events
router.get("/", getEvents);

// Get all calendar events
router.get("/today", getTodaysEvents);

// Get a single calendar event
router.get("/:id", getSingleEvent);

// // Add a new calendar event
router.post("/", createEvent);

// Update a specific calendar event by ID
router.put("/:id", updateEvent);

// Delete a specific calendar event by ID
router.delete("/:id", deleteEvent);

export default router;
