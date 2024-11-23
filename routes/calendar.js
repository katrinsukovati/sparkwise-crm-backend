import express from "express";
import {
  getEvents,
  getSingleEvent,
  createEvent,
  deleteEvent,
  updateEvent,
  getTodaysEvents,
  getEventsRange,
} from "../controllers/calendar-controller.js";

const router = express.Router();

// Get all calendar events
router.get("/", getEvents);

// Get all calendar events
router.get("/today", getTodaysEvents);

// Get a single calendar event
router.get("/event/:id", getSingleEvent);

// Get a range of calendar events
router.get("/range", getEventsRange);

// Add a new calendar event
router.post("/", createEvent);

// Update a specific calendar event by ID
router.put("/event/:id", updateEvent);

// Delete a specific calendar event by ID
router.delete("/event/:id", deleteEvent);

export default router;
