import express, { Express } from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import userRoute from "./routes/userRoutes";
import cors from "cors";
import fs from 'fs';
import path from 'path';

// load environment variables
dotenv.config();

// initialize express
const app: Express = express();

// Environment Variables
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('public/uploads'));
// app.use(express.static(path.join(__dirname, 'public/uploads')));

// CORS Configuration
const corsOptions = {
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Routes
app.use("/", userRoute);

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running in http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
