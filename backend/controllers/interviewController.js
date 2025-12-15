const { generateInterviewQuestion } = require("../services/geminiService");

// ---------------- Start the Interview ----------------
const startMockInterview = async (req, res) => {
  try {
    const { role, experience, company, selectedTopic, difficulty } = req.body;
    const resumeFile = req.file;

    if (!role || !experience || !company || !resumeFile) {
      return res.status(400).json({
        success: false,
        error: "All required fields and resume are required",
      });
    }

    // 🔥 FIXED PROMPT (SHORT, DIRECT, NO ESSAYS)
    const prompt = `
You are an interviewer at ${company}.

Ask ONE short and direct interview question for a ${role} candidate with ${experience} experience.

Rules:
- Ask ONLY ONE question.
- Keep it under 2 lines.
- Do NOT add explanations, scenarios, or background stories.
- Do NOT ask multi-part or numbered questions.
- Do NOT include introductions or greetings.
- Question must be based on the resume content.
- Topic: ${selectedTopic}
- Difficulty: ${difficulty}

Return ONLY the question text.
`;

    const question = await generateInterviewQuestion(prompt, resumeFile);

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("❌ startMockInterview Error:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

// ---------------- Handle User Response ----------------
const handleInterviewResponse = async (req, res) => {
  try {
    const { userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({
        response: "No answer received.",
      });
    }

    // TEMP placeholder (unchanged)
    res.status(200).json({
      response: "Thanks for your answer. Let's move to the next question.",
    });
  } catch (error) {
    console.error("❌ handleInterviewResponse Error:", error);
    res.status(500).json({
      response: "Error processing your response.",
    });
  }
};

// ---------------- Generate Interview Summary ----------------
const generateInterviewSummary = async (req, res) => {
  try {
    const { messages, role, company } = req.body;

    res.status(200).json({
      summary: `Interview summary for ${role} at ${company}: Candidate showed good understanding and communication skills.`,
    });
  } catch (error) {
    console.error("❌ generateInterviewSummary Error:", error);
    res.status(500).json({
      summary: "Failed to generate summary.",
    });
  }
};

module.exports = {
  startMockInterview,
  handleInterviewResponse,
  generateInterviewSummary,
};
