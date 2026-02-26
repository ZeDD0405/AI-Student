const express = require("express");
const router = express.Router();
const TestResult = require("../models/TestResult");
const Test = require("../models/Test");

// Submit test result
router.post("/submit", async (req, res) => {
  try {
    const { testId, studentName, rollNo, answers, timeTaken, tabSwitchCount } = req.body;

    // Validate
    if (!testId || !studentName || !rollNo || !answers) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }
    // Check if already submitted
const existingResult = await TestResult.findOne({
  testId,
  rollNo
});

if (existingResult) {
  return res.json({
    success: true,
    message: "Already submitted",
    result: {
      score: existingResult.score,
      correctAnswers: existingResult.correctAnswers,
      totalQuestions: existingResult.totalQuestions
    }
  });
}


    // Fetch the test to calculate score
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        error: "Test not found"
      });
    }

    // Calculate score
    let correctAnswers = 0;
    answers.forEach(answer => {
      const question = test.questions[answer.questionIndex];
      if (question && question.correctAnswer === answer.selectedAnswer) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / test.totalQuestions) * 100;

    // Create result
    const newResult = new TestResult({
      testId,
      studentName,
      rollNo,
      answers,
      score: Math.round(score * 100) / 100, // Round to 2 decimal places
      totalQuestions: test.totalQuestions,
      correctAnswers,
      timeTaken,
      tabSwitchCount: tabSwitchCount || 0
    });

    await newResult.save();

    res.json({
      success: true,
      message: "Test submitted successfully",
      result: {
        score: newResult.score,
        correctAnswers: newResult.correctAnswers,
        totalQuestions: newResult.totalQuestions
      }
    });
  } catch (error) {
    console.error("Error submitting test result:", error);
    res.status(500).json({
      success: false,
      error: "Failed to submit test result"
    });
  }
});

// Get all results for a specific test (for teachers)
router.get("/test/:testId", async (req, res) => {
  try {
    const { testId } = req.params;

    const results = await TestResult.find({ testId })
      .populate("testId", "title subject")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch results"
    });
  }
});

// Get results for a specific student
router.get("/student/:rollNo", async (req, res) => {
  try {
    const { rollNo } = req.params;

    const results = await TestResult.find({ rollNo })
      .populate("testId", "title subject")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Error fetching student results:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch results"
    });
  }
});

// Get all results (for teachers - dashboard view)
router.get("/all", async (req, res) => {
  try {
    const results = await TestResult.find()
      .populate("testId", "title subject")
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Error fetching all results:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch results"
    });
  }
});

module.exports = router;
