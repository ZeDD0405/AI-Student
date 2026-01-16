const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    enum: ["JavaScript Fundamentals", "React Basics", "Data Structures", "Algorithms", "Behavioral Test"]
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  timeLimit: {
    type: Number,
    required: true,
    min: 1,
    comment: "Time limit in minutes"
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true,
      validate: {
        validator: function(arr) {
          return arr.length === 4;
        },
        message: "Must have exactly 4 options"
      }
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium"
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    default: "Teacher"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Test", TestSchema);
