const express = require("express");
const {
  startMockInterview,
  handleInterviewResponse,
  generateInterviewSummary,
} = require("../controllers/interviewController");

const router = express.Router();

router.post("/start", startMockInterview);
router.post("/respond", handleInterviewResponse);
router.post("/summary", generateInterviewSummary);

module.exports = router;
