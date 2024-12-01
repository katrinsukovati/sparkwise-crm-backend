import express from "express";
import {
  createGoogleEvent,
  updateGoogleEvent,
  createZoomMeeting,
} from "../controllers/calendar-controller.js";

const router = express.Router();

// Google Calendar Routes
router.post("/google/create-event", createGoogleEvent);
router.patch("/google/update-event", updateGoogleEvent);

// Zoom Routes
router.post("/create-zoom-meeting", createZoomMeeting);

export default router;
