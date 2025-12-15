const { generateInterviewQuestion } = require("../services/geminiService");

// ---------------- Start the Interview ----------------
const startMockInterview = async (req, res) => {
  try {
    // req.body contains the fields; req.file contains the resume (from multer)
    const { role, experience, company, selectedTopic, difficulty } = req.body;
    const resumeFile = req.file;

    if (!role || !experience || !company || !resumeFile) {
      return res.status(400).json({ error: "All required fields (Role, Experience, Company) and a Resume PDF are required." });
    }

    const prompt = `
You are a professional interviewer at ${company}.
Conduct a mock interview for the ${role} position.
The candidate has ${experience} of experience.
The candidate's resume is attached.
**Your question must be highly specific to the content found in the attached resume** to test the candidate's actual background.
The primary topic for this session is ${selectedTopic} at ${difficulty} difficulty.
Ask ONLY ONE realistic interview question, starting the session.
`;

    // Pass the file data to the service
    const question = await generateInterviewQuestion(prompt, resumeFile); 

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
// ... (handleInterviewResponse and generateInterviewSummary remain the same) ...

module.exports = {
  startMockInterview,
  handleInterviewResponse,
  generateInterviewSummary,
};