// Import required packages
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const tuitionRoutes = require("./routes/tuitions"); // ← Add this line

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/tuitions", tuitionRoutes); // ← Add this line

// Test route
app.get("/", (req, res) => {
  res.send("Tuition Platform API is running successfully!");
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error);
  });
