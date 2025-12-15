const { GoogleGenerativeAI } = require("@google/generative-ai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Convert multer file buffer to Gemini inlineData part
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

async function generateInterviewQuestion(prompt, fileData = null) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const parts = [
      { text: prompt }
    ];

    if (fileData) {
      parts.push(
        fileToGenerativePart(fileData.buffer, fileData.mimetype)
      );
    }

    // ✅ CORRECT PAYLOAD STRUCTURE
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: parts,
        },
      ],
    });

    return result.response.text().trim();

  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    console.error("Full Error:", error);

    return "Error generating response. Please check the resume file format.";
  }
}

module.exports = { generateInterviewQuestion };
