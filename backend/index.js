require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const interviewRoutes = require("./routes/interviewRoutes");
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const testRoutes = require("./routes/testRoutes");
const testResultRoutes = require("./routes/testResultRoutes");
const path = require("path");
const questionRoutes = require("./routes/questionRoutes");



const app = express();
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ---------------- CORS ----------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ---------------- MongoDB Connection ----------------
mongoose
  .connect("mongodb://127.0.0.1:27017/practice_mern", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ---------------- Modular Routes ----------------
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/test", testRoutes);
app.use("/api/test-result", testResultRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/question", questionRoutes);

// ---------------- Default Route ----------------
app.get("/", (req, res) => {
  res.send("🚀 Backend is running successfully!");
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});