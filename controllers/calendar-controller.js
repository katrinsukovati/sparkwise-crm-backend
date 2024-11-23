import { google } from "googleapis";
import fs from "fs";

// Which calendar to use
// Later on, I would like to change this so it has the users google gmail (through log in)
const { GOOGLE_CALENDAR_EMAIL } = process.env;


const credentials = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};

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

// Get todays events for dashboard
const getTodaysEvents = async (req, res) => {
  try {
    // Get current date
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const endOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );

    const response = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_EMAIL,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });
    res.status(200).json(response.data.items);
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error fetching todays events: ${error.message}` });
  }
};

// Get todays events for dashboard
const getEventsRange = async (req, res) => {
  const { start, end } = req.query;

  // Validation logic for checking if a date is valid
  const isValidDate = (date) => !isNaN(Date.parse(date));

  if (!start.trim() || !isValidDate(start)) {
    return res.status(400).json({ message: "Invalid start query field." });
  }
  if (!end.trim() || !isValidDate(end)) {
    return res.status(400).json({ message: "Invalid end query field." });
  }
  try {
    const response = await calendar.events.list({
      calendarId: GOOGLE_CALENDAR_EMAIL,
      timeMin: start,
      timeMax: end,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.status(200).json(response.data.items);
  } catch (error) {
    res.status(500).json({
      message: `Error fetching events from the specified range from start: ${start} until end: ${end}: ${error.message}`,
    });
  }
};

// Get Single Event
const getSingleEvent = async (req, res) => {
  const event_id = req.params.id;
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

  // Validation logic for checking if a date is valid
  const isValidDate = (date) => !isNaN(Date.parse(date));

  // Validation
  if (!summary.trim()) {
    return res.status(400).json({ message: "Invalid summary field." });
  }
  if (!start.trim() || !isValidDate(start)) {
    return res.status(400).json({ message: "Invalid start field." });
  }
  if (!end.trim() || !isValidDate(end)) {
    return res.status(400).json({ message: "Invalid end field." });
  }
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

// Update an event
const updateEvent = async (req, res) => {
  const event_id = req.params.id;
  const { summary, description, start, end } = req.body;

  // Validation logic
  const isValidDate = (date) => !isNaN(Date.parse(date));

  // Validation
  if (!summary.trim()) {
    return res.status(400).json({ message: "Missing summary field." });
  }
  if (!start.trim() || !isValidDate(start)) {
    return res.status(400).json({ message: "Missing start field." });
  }
  if (!end.trim() || !isValidDate(end)) {
    return res.status(400).json({ message: "Missing end field." });
  }
  try {
    const event = {
      summary,
      description,
      start: { dateTime: start },
      end: { dateTime: end },
    };

    const response = await calendar.events.update({
      calendarId: GOOGLE_CALENDAR_EMAIL,
      resource: event,
      eventId: event_id,
    });

    res
      .status(201)
      .json({ message: "Event updated successfully", event: response.data });
  } catch (error) {
    res.status(500).json({ message: `Error updating event: ${error.message}` });
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

export {
  getEvents,
  createEvent,
  getSingleEvent,
  deleteEvent,
  updateEvent,
  getTodaysEvents,
  getEventsRange,
};
