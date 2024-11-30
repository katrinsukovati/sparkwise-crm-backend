import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

// import routers
import clientsRoutes from "./routes/clients.js";
import classTypesRoutes from "./routes/class_types.js";

dotenv.config();
const {
  PORT,
  BACKEND_URL,
  CORS_ORIGIN,
  ZOOM_CLIENT_ID,
  ZOOM_CLIENT_SECRET,
  ZOOM_ACCOUNT_ID,
  GOOGLE_CALENDAR_API_URL,
} = process.env;

const app = express();
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to SparkWise CRM" });
});

// Using routes for clients
app.use("/clients", clientsRoutes);

// Using the class types routes
app.use("/class_types", classTypesRoutes);

app.post("/create-google-event", async (req, res) => {
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
        params: { sendUpdates: "all" }, // Ensures invites are sent
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
});

// Zoom only allows server side calls to get sensitive data
// this returns a token that i can use on the frontend to make zoom links
app.post("/create-zoom-meeting", async (req, res) => {
  try {
    app.patch("/update-google-event", async (req, res) => {
      const { accessToken, eventId, eventDetails } = req.body;

      try {
        const response = await axios.patch(
          `${GOOGLE_CALENDAR_API_URL}/primary/events/${eventId}`,
          eventDetails,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            params: { sendUpdates: "all" },
          }
        );

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
    });

    console.log("Incoming request body:", req.body); // Log the request body

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
      ...req.body, // Meeting details from frontend
      type: req.body.recurrence ? 8 : 2, // Default to a one-time meeting (type 2) if no recurrence
      settings: {
        ...req.body.settings,
        approval_type: 0, // Automatic approval
        registrants_email_notification: true, // Send email notifications
      },
    };

    console.log("meetingRequest:", meetingRequest); // Log the request body

    // Add recurrence if provided
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

    const meetingData = meetingResponse.data;
    res.json(meetingData);
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
});

app.patch("/update-google-event", async (req, res) => {
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
});

// Processing unsupported routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is listening at ${BACKEND_URL}:${PORT}`);
});
