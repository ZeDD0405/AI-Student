const express = require("express");
const multer = require("multer"); // Import multer
const {
  startMockInterview,
  handleInterviewResponse,
  generateInterviewSummary,
} = require("../controllers/interviewController");

const router = express.Router();

// Configure multer for file storage (using memory storage for immediate processing)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Apply multer middleware ONLY to the /start route
// 'resume' is the field name used in the frontend FormData
router.post("/start", upload.single("resume"), startMockInterview);

router.post("/respond", handleInterviewResponse);
router.post("/summary", generateInterviewSummary);

module.exports = router;