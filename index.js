import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import routers
import clientsRoutes from "./routes/clients.js";
import classTypesRoutes from "./routes/class_types.js";
import classesRoutes from "./routes/classes.js";
import teachersRoutes from "./routes/teachers.js";
import studentsRoutes from "./routes/students.js";
import classEnrollmentsRoutes from "./routes/class_enrollments.js";
import semestersRoutes from "./routes/semesters.js";
import calendarRoutes from "./routes/calendar.js";

dotenv.config();
const { PORT, BACKEND_URL, CORS_ORIGIN, DEPLOYED_CORS_ORIGIN } = process.env;

const app = express();

const allowedOrigins = [
  "http://localhost:5173", // Local frontend during development
  "https://sparkwise-crm.netlify.app", // Deployed frontend on Netlify
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies, authorization headers
  })
);

app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to SparkWise CRM" });
});

// Using routes for clients
app.use("/clients", clientsRoutes);

// Using the class types routes
app.use("/class-types", classTypesRoutes);

// Using the class enrollments routes
app.use("/class-enrollments", classEnrollmentsRoutes);

// Using the classes routes
app.use("/classes", classesRoutes);

// Using the teachers routes
app.use("/teachers", teachersRoutes);

// Using the students routes
app.use("/students", studentsRoutes);

// Using the semesters routes
app.use("/semesters", semestersRoutes);

// Creating an event - Google Calendar and Zoom
app.use("/calendar", calendarRoutes);

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
