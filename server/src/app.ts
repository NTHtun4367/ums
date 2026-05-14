import express, {
  json,
  urlencoded,
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { ENV } from "./utils/env";
import { connectDB } from "./config/db";
import errorHandler from "./middlewares/errorHandler";

// Route Imports
import userRoutes from "./routes/user";
import activitiesLogRoutes from "./routes/activitieslog";
import academicYearsRoutes from "./routes/academicYear";
import classRoutes from "./routes/class";
import subjectRoutes from "./routes/subject";
import timetableRoutes from "./routes/timetable";
import dashboardRoutes from "./routes/dashboard";
import attendanceRoutes from "./routes/attendance"; // Added Attendance
import departmentRoutes from "./routes/department";

import { serve } from "inngest/express";
import { inngest } from "./inngest";
import { generateTimetableJob } from "./inngest/functions";

const app: Application = express();

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: ENV.CLIENT_URL,
    credentials: true,
  }),
);

// Body Parsers
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Log HTTP requests to console in development
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

/**
 * API Routes
 * These base paths are synchronized with your RTK Query 'url' settings
 */
app.use("/api/users", userRoutes);
app.use("/api/activities", activitiesLogRoutes);
app.use("/api/academic-years", academicYearsRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/timetables", timetableRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/attendance", attendanceRoutes); // Registered Attendance Route
app.use("/api/departments", departmentRoutes);

// Inngest Background Jobs
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions: [generateTimetableJob], // Register the job here
  }),
);

// Global error handler (must be last middleware)
app.use(errorHandler);

// Start Server
app.listen(ENV.PORT, () => {
  connectDB();
  console.log(`Server running on port ${ENV.PORT}`);
});
