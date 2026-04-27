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
import userRoutes from "./routes/user";

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

// log http request to console
if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// health check route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

// Routes
app.use("/api/users", userRoutes);

// global error handler
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  connectDB();
  console.log(`Server running on port ${ENV.PORT}`);
});
