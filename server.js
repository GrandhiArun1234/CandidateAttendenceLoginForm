import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// FIX CORS for Netlify
app.use(
  cors({
    origin: [
      "https://mark-attendance.netlify.app",
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
app.use("/api/candidates", candidateRoutes);
app.use("/api/auth", authRoutes);



// Start Server
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running at http://localhost:${process.env.PORT}`)
);
