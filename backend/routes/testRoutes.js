const express = require("express");
const router = express.Router();
const Test = require("../models/Test");

// Create a new test
router.post("/create", async (req, res) => {
  try {
    const { title, description, subject, totalQuestions, timeLimit, branch, questions } = req.body;

    // Validation
    if (!title || !subject || !totalQuestions || !timeLimit || !branch || !questions) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be filled"
      });
    }

    if (totalQuestions < 1) {
      return res.status(400).json({
        success: false,
        error: "Total questions must be at least 1"
      });
    }

    if (timeLimit < 1) {
      return res.status(400).json({
        success: false,
        error: "Time limit must be at least 1 minute"
      });
    }

    if (questions.length !== totalQuestions) {
      return res.status(400).json({
        success: false,
        error: `Expected ${totalQuestions} questions but received ${questions.length}`
      });
    }

    const newTest = new Test({
      title,
      description: description || "",
      subject,
      totalQuestions,
      timeLimit,
      branch,
      questions,
      isPublished: false
    });

    await newTest.save();

    res.json({
      success: true,
      message: "Test created successfully",
      test: newTest
    });
  } catch (error) {
    console.error("Error creating test:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create test"
    });
  }
});

// Publish test to students
router.put("/publish/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findByIdAndUpdate(
      id,
      { isPublished: true },
      { new: true }
    );

    if (!test) {
      return res.status(404).json({
        success: false,
        error: "Test not found"
      });
    }

    res.json({
      success: true,
      message: "Test published successfully",
      test
    });
  } catch (error) {
    console.error("Error publishing test:", error);
    res.status(500).json({
      success: false,
      error: "Failed to publish test"
    });
  }
});

// Get all tests (for teacher - includes unpublished)
router.get("/all", async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      tests
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tests"
    });
  }
});

// Get published tests (for students)
router.get("/published", async (req, res) => {
  try {
    const { branch } = req.query;

    // Filter criteria
    const filter = { isPublished: true };
    if (branch) {
      filter.branch = branch;
    }

    const tests = await Test.find(filter)
      .select("-questions.correctAnswer") // Hide correct answers from students
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tests
    });
  } catch (error) {
    console.error("Error fetching published tests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tests"
    });
  }
});

// Get test by ID (for taking test - no correct answers)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id).select("-questions.correctAnswer");

    if (!test) {
      return res.status(404).json({
        success: false,
        error: "Test not found"
      });
    }

    res.json({
      success: true,
      test
    });
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch test"
    });
  }
});

// Delete test
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Test.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Test deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete test"
    });
  }
});

module.exports = router;
