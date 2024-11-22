import { google } from "googleapis";
import fs from "fs";

// Which calendar to use
// Later on, I would like to change this so it has the users google gmail (through log in)
const { GOOGLE_CALENDAR_EMAIL } = process.env;

// Load the service account credentials
const credentials = JSON.parse(fs.readFileSync("./service-account-key.json"));

// Authenticate using the service account
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

// Initialize the Google Calendar API
const calendar = google.calendar({ version: "v3", auth });

// Get All Events
const getEvents = async (req, res) => {
  try {
    // Get current date
    const now = new Date();

    // Calculate 6 months ago and 6 months ahead
    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 6);

    const sixMonthsAhead = new Date(now);
    sixMonthsAhead.setMonth(now.getMonth() + 6);

    const response = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_EMAIL,
      // This will just get all events.. but perhaps not such a good idea for scalability
      maxResults: 1000,
      //   timeMin: sixMonthsAgo.toISOString(),
      //   timeMax: sixMonthsAhead.toISOString(),
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

// Get Single Event
const getSingleEvent = async (req, res) => {
  const event_id = req.params.id;
  console.log(event_id);
  try {
    const response = await calendar.events.get({
      calendarId: GOOGLE_CALENDAR_EMAIL,
      eventId: event_id,
    });
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching event with id ${event_id}: ${error.message}`,
    });
  }
};

// Create a new event
const createEvent = async (req, res) => {
  const { summary, description, start, end } = req.body;
  try {
    const event = {
      summary,
      description,
      start: { dateTime: start }, // ISO 8601 format
      end: { dateTime: end }, // ISO 8601 format
    };

    const response = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_EMAIL,
      resource: event,
    });

    res
      .status(201)
      .json({ message: "Event created successfully", event: response.data });
  } catch (error) {
    res.status(500).json({ message: `Error creating event: ${error.message}` });
  }
};

// Delete an event
const deleteEvent = async (req, res) => {
  const event_id = req.params.id;
  try {
    const response = await calendar.events.delete({
      calendarId: GOOGLE_CALENDAR_EMAIL,
      eventId: event_id,
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      message: `Error deleting event with id ${event_id}: ${error.message}`,
    });
  }
};

export { getEvents, createEvent, getSingleEvent, deleteEvent };
