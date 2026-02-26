// const express = require("express");
// const router = express.Router();
// const Test = require("../models/Test");

// // Create a new test
// router.post("/create", async (req, res) => {
//   try {
//     const { title, description, subject, totalQuestions, timeLimit, branch, questions } = req.body;

//     // Validation
//     if (!title || !subject || !totalQuestions || !timeLimit || !branch || !questions) {
//       return res.status(400).json({
//         success: false,
//         error: "All required fields must be filled"
//       });
//     }

//     if (totalQuestions < 1) {
//       return res.status(400).json({
//         success: false,
//         error: "Total questions must be at least 1"
//       });
//     }

//     if (timeLimit < 1) {
//       return res.status(400).json({
//         success: false,
//         error: "Time limit must be at least 1 minute"
//       });
//     }

//     if (questions.length !== totalQuestions) {
//       return res.status(400).json({
//         success: false,
//         error: `Expected ${totalQuestions} questions but received ${questions.length}`
//       });
//     }

//     const newTest = new Test({
//       title,
//       description: description || "",
//       subject,
//       totalQuestions,
//       timeLimit,
//       branch,
//       questions,
//       isPublished: false
//     });

//     await newTest.save();

//     res.json({
//       success: true,
//       message: "Test created successfully",
//       test: newTest
//     });
//   } catch (error) {
//     console.error("Error creating test:", error);
//     console.error("Error message:", error.message);
//     console.error("Error stack:", error.stack);
//     res.status(500).json({
//       success: false,
//       error: error.message || "Failed to create test"
//     });
//   }
// });

// // Publish test to students
// router.put("/publish/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const test = await Test.findByIdAndUpdate(
//       id,
//       { isPublished: true },
//       { new: true }
//     );

//     if (!test) {
//       return res.status(404).json({
//         success: false,
//         error: "Test not found"
//       });
//     }

//     res.json({
//       success: true,
//       message: "Test published successfully",
//       test
//     });
//   } catch (error) {
//     console.error("Error publishing test:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to publish test"
//     });
//   }
// });

// // Get all tests (for teacher - includes unpublished)
// router.get("/all", async (req, res) => {
//   try {
//     const tests = await Test.find().sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       tests
//     });
//   } catch (error) {
//     console.error("Error fetching tests:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to fetch tests"
//     });
//   }
// });

// // Get published tests (for students)
// router.get("/published", async (req, res) => {
//   try {
//     const { branch } = req.query;

//     // Filter criteria
//     const filter = { isPublished: true };
//     if (branch) {
//       filter.branch = branch;
//     }

//     const tests = await Test.find(filter)
//       .select("-questions.correctAnswer") // Hide correct answers from students
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       tests
//     });
//   } catch (error) {
//     console.error("Error fetching published tests:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to fetch tests"
//     });
//   }
// });

// // Get test by ID (for taking test - no correct answers)
// router.get("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const test = await Test.findById(id).select("-questions.correctAnswer");

//     if (!test) {
//       return res.status(404).json({
//         success: false,
//         error: "Test not found"
//       });
//     }

//     res.json({
//       success: true,
//       test
//     });
//   } catch (error) {
//     console.error("Error fetching test:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to fetch test"
//     });
//   }
// });

// // Delete test
// router.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     await Test.findByIdAndDelete(id);

//     res.json({
//       success: true,
//       message: "Test deleted successfully"
//     });
//   } catch (error) {
//     console.error("Error deleting test:", error);
//     res.status(500).json({
//       success: false,
//       error: "Failed to delete test"
//     });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Test = require("../models/Test");
const multer = require("multer");
const path = require("path");

/* ===============================
   MULTER CONFIG (QUESTION IMAGES)
================================ */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/questions");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"), false);
  },
});

/* ===============================
   CREATE TEST (WITH IMAGES)
================================ */
// router.post("/create", upload.array("images"), async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       subject,
//       totalQuestions,
//       timeLimit,
//       branches,
//       questions,
//     } = req.body;


//     if (!title || !subject || !totalQuestions || !timeLimit || !branches || !questions) {
//       return res.status(400).json({
//         success: false,
//         error: "All required fields must be filled",
//       });
//     }

//     // const parsedQuestions = JSON.parse(questions);
//     const parsedBranches = JSON.parse(branches);

//     if (parsedQuestions.length !== Number(totalQuestions)) {
//       return res.status(400).json({
//         success: false,
//         error: `Expected ${totalQuestions} questions but received ${parsedQuestions.length}`,
//       });
//     }

//     // Attach images to questions by index
//     const images = req.files || [];

//     // const finalQuestions = parsedQuestions.map((q, index) => ({
//     //   questionText: q.questionText,
//     //   options: q.options,
//     //   correctAnswer: q.correctAnswer,
//     //   image: images[index] ? images[index].filename : "",
//     // }));
//     const finalQuestions = parsedQuestions.map((q, index) => ({
//       question: q.question,               // ✅ REQUIRED FIELD
//       options: q.options,
//       correctAnswer: q.correctAnswer,
//       image: images[index] ? images[index].filename : ""
//     }));

//     // const newTest = new Test({
//     //   title,
//     //   description: description || "",
//     //   subject,
//     //   totalQuestions,
//     //   timeLimit,
//     //   branches: parsedBranches,
//     //   questions: finalQuestions,
//     //   isPublished: false,
//     // });
//     const newTest = new Test({
//   title,
//   description,
//   subject,
//   totalQuestions,
//   timeLimit,
//   branches,   // ✅
//   questions
// });

//     await newTest.save();

//     res.json({
//       success: true,
//       message: "Test created successfully",
//       test: newTest,
//     });
//   } catch (error) {
//     console.error("Error creating test:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "Failed to create test",
//     });
//   }
// });
router.post("/create", upload.array("images"), async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      totalQuestions,
      timeLimit,
      branches,
      questions,
    } = req.body;

    if (!title || !subject || !totalQuestions || !timeLimit || !branches || !questions) {
      return res.status(400).json({
        success: false,
        error: "All required fields must be filled",
      });
    }

    // PARSE JSON STRINGS
    const parsedQuestions = JSON.parse(questions);
    const parsedBranches = JSON.parse(branches);

    if (parsedQuestions.length !== Number(totalQuestions)) {
      return res.status(400).json({
        success: false,
        error: `Expected ${totalQuestions} questions but received ${parsedQuestions.length}`,
      });
    }

    // Attach images
    const images = req.files || [];

    const finalQuestions = parsedQuestions.map((q, index) => ({
      question: q.questionText || q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      image: images[index] ? images[index].filename : "",
    }));

    const newTest = new Test({
      title,
      description: description || "",
      subject,
      totalQuestions,
      timeLimit,
      branches: parsedBranches,
      questions: finalQuestions,
      isPublished: false,
    });

    await newTest.save();

    res.json({
      success: true,
      message: "Test created successfully",
      test: newTest,
    });
  } catch (error) {
    console.error("Error creating test:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create test",
    });
  }
});


/* ===============================
   PUBLISH TEST
================================ */
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
        error: "Test not found",
      });
    }

    res.json({
      success: true,
      message: "Test published successfully",
      test,
    });
  } catch (error) {
    console.error("Error publishing test:", error);
    res.status(500).json({
      success: false,
      error: "Failed to publish test",
    });
  }
});

/* ===============================
   GET ALL TESTS (TEACHER)
================================ */
router.get("/all", async (req, res) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      tests,
    });
  } catch (error) {
    console.error("Error fetching tests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tests",
    });
  }
});
router.get("/published", async (req, res) => {
  try {
    const { branch } = req.query;

    const filter = { isPublished: true };
    if (branch) {
      filter.branches = { $in: [branch] };
    }

    const tests = await Test.find(filter)
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    res.json({ success: true, tests });
  } catch (error) {
    console.error("Error fetching published tests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tests",
    });
  }
});

/* ===============================
   GET PUBLISHED TESTS (STUDENT)
================================ */
router.get("/published", async (req, res) => {
  try {
    const { branch } = req.query;

    const filter = { isPublished: true };
    // if (branch) filter.branch = branch;
    filter.branches = { $in: [branch] };


    const tests = await Test.find(filter)
      .select("-questions.correctAnswer")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tests,
    });
  } catch (error) {
    console.error("Error fetching published tests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch tests",
    });
  }
});

/* ===============================
   GET TEST BY ID (TAKE TEST)
================================ */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const test = await Test.findById(id).select("-questions.correctAnswer");

    if (!test) {
      return res.status(404).json({
        success: false,
        error: "Test not found",
      });
    }

    res.json({
      success: true,
      test,
    });
  } catch (error) {
    console.error("Error fetching test:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch test",
    });
  }
});

/* ===============================
   DELETE TEST
================================ */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await Test.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting test:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete test",
    });
  }
});

module.exports = router;
