import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

import axios from "axios";
const {
  GOOGLE_CALENDAR_API_URL,
  ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET,
  ZOOM_ACCOUNT_ID,
} = process.env;


// Google Calendar: Create Event
const createGoogleEvent = async (req, res) => {
  const { accessToken, eventDetails } = req.body;

  try {
    const response = await axios.post(
      `${GOOGLE_CALENDAR_API_URL}/primary/events`,
      eventDetails,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        params: { sendUpdates: "all" },
      }
    );
    res.status(201).json(response.data);
  } catch (error) {
    console.error(
      "Error creating Google Calendar event:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to create Google Calendar event",
      error: error.response?.data || error.message,
    });
  }
};

// Google Calendar: Update Event
const updateGoogleEvent = async (req, res) => {
  const { accessToken, eventId, eventDetails, recurringUpdateMode } = req.body;

  try {
    const url =
      recurringUpdateMode === "single"
        ? `${GOOGLE_CALENDAR_API_URL}/primary/events/${eventId}/instances`
        : `${GOOGLE_CALENDAR_API_URL}/primary/events/${eventId}`;

    const response = await axios.patch(url, eventDetails, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      params: { sendUpdates: "all" },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error(
      "Error updating Google Calendar event:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Failed to update Google Calendar event",
      error: error.response?.data || error.message,
    });
  }
};

// Zoom: Create Meeting
const createZoomMeeting = async (req, res) => {
  try {
    // Step 1: Get Zoom Access Token
    const zoomTokenResponse = await axios.post(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ACCOUNT_ID}`,
      {},
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    const zoomAccessToken = zoomTokenResponse.data.access_token;

    // Step 2: Create the Zoom Meeting
    const meetingRequest = {
      ...req.body,
      type: req.body.recurrence ? 8 : 2,
      settings: {
        ...req.body.settings,
        approval_type: 0,
        registrants_email_notification: true,
      },
    };

    if (req.body.recurrence) {
      meetingRequest.recurrence = req.body.recurrence;
    }

    const meetingResponse = await axios.post(
      `https://api.zoom.us/v2/users/me/meetings`,
      meetingRequest,
      {
        headers: {
          Authorization: `Bearer ${zoomAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json(meetingResponse.data);
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Failed to create Zoom meeting",
      details: error.response?.data,
    });
  }
};

export { createGoogleEvent, updateGoogleEvent, createZoomMeeting };
