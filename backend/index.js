require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const interviewRoutes = require("./routes/interviewRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// ---------- Middleware ----------
app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

// ---------- MongoDB Connection ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

// ---------- Routes ----------
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// ---------- Default Route ----------
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
