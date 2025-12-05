import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";

dotenv.config();

const app = express();

// FIX CORS for Netlify
app.use(
  cors({
    origin: [
      "https://chaitanyadeemedcollege.netlify.app",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);


// Parse JSON body
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use("/api/attendance", attendanceRoutes);

// Start Server
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
);
