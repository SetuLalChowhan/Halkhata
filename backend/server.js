const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");
const dashRoutes = require("./routes/dashboard");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dashboard", dashRoutes);

// Root endpoint to resolve 404s when fetching standard domains
app.get("/", (req, res) => {
  res.send("Halkhata API Server works perfectly!");
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    // Only listen dynamically if purely local and not in Vercel. 
    // Usually Vercel injects its own handlers without triggering local listen.
    // However, exposing listen doesn't break Vercel.
    // Just providing module.exports turns it into a Serverless Function!
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    }
  })
  .catch((err) => console.log(err));

module.exports = app;
