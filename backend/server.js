const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://halkhata-ejhj.vercel.app",
  "https://halkhata-nine.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Ensure database is connected before handling any requests
let isConnected;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    console.error(
      "CRITICAL ERROR: MONGO_URI is missing from Environment Variables!",
    );
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log("MongoDB Serverless Connection Established");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
  }
};

// Global middleware to await DB connection on every Vercel request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const dashRoutes = require("./routes/dashboard");
const meetingRoutes = require("./routes/meetings");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashRoutes);
app.use("/api/meetings", meetingRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
