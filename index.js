import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// import routers
import clientsRoutes from "./routes/clients.js";
import calendarRoutes from "./routes/calendar.js";

dotenv.config();
const app = express();
const { PORT, BACKEND_URL, CORS_ORIGIN } = process.env;

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "Welcome to SparkWise CRM" });
});

// Using routes for clients
app.use("/clients", clientsRoutes);

// Using routes for calendar
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
