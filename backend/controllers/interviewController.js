const { generateInterviewQuestion } = require("../services/geminiService");

// ---------------- Start the Interview ----------------
const startMockInterview = async (req, res) => {
  try {
    const { role, experience, company } = req.body;

    if (!role || !experience || !company) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const prompt = `
You are a professional interviewer at ${company}.
Conduct a mock interview for the ${role} position.
The candidate has ${experience} of experience.
Ask ONLY ONE realistic interview question.
`;

    const question = await generateInterviewQuestion(prompt);

    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error("❌ startMockInterview Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

// ---------------- Handle User Response ----------------
const handleInterviewResponse = async (req, res) => {
  try {
    const { userMessage, role, company } = req.body;

    if (!userMessage || !role || !company) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prompt = `
You are an interviewer at ${company}.
Role: ${role}

Candidate's last message:
"${userMessage}"

First, give 1 sentence feedback.
Then ask the NEXT interview question.
`;

    const followUp = await generateInterviewQuestion(prompt);

    res.status(200).json({
      success: true,
      response: followUp,
    });
  } catch (error) {
    console.error("❌ handleInterviewResponse Error:", error);
    res.status(500).json({ success: false, error: "Failed to process response" });
  }
};

// ---------------- Generate Interview Summary ----------------
const generateInterviewSummary = async (req, res) => {
  try {
    const { messages, role, company } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No messages provided" });
    }

    const transcript = messages
      .map((m) => `${m.sender === "user" ? "Candidate" : "Interviewer"}: ${m.text}`)
      .join("\n");

    const prompt = `
You are an interview evaluator.

Interview Transcript:
${transcript}

Generate a JSON summary EXACTLY like this:

{
  "confidence": "...",
  "nervousness": "...",
  "weakAreas": ["...", "..."],
  "strongAreas": ["...", "..."],
  "videos": ["..."]
}

Only output valid JSON.
`;

    let summaryText = await generateInterviewQuestion(prompt);

    // Clean unexpected formatting
    summaryText = summaryText.replace(/```json/gi, "").replace(/```/g, "");

    let summary;
    try {
      summary = JSON.parse(summaryText);
    } catch {
      summary = { error: "JSON parsing failed", raw: summaryText };
    }

    res.status(200).json({ success: true, summary });
  } catch (error) {
    console.error("❌ generateInterviewSummary Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate summary",
    });
  }
};

module.exports = {
  startMockInterview,
  handleInterviewResponse,
  generateInterviewSummary,
};
