import { google } from "googleapis";
import fs from "fs";

// Load the service account credentials
const credentials = JSON.parse(fs.readFileSync("./service-account-key.json"));

// Authenticate using the service account
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Initialize the Google Calendar API
const calendar = google.calendar({ version: "v3", auth });

// **Get All Events**
const getEvents = async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: "sparkwiseenrichment@gmail.com", // later i want to change this so it has the users google gmail
      timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    res.status(200).json(response.data.items);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching events: ${error.message}` });
  }
};

export { getEvents };
