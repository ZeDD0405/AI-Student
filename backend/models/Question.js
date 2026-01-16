const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ["JavaScript Fundamentals", "React Basics", "Data Structures", "Algorithms", "Behavioral Test"]
  },
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

module.exports = mongoose.model("Question", QuestionSchema);
