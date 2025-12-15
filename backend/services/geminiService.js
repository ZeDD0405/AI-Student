const { GoogleGenerativeAI } = require("@google/generative-ai");
// const fs = require("fs").promises; // Not needed if only using buffers from multer

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY missing in .env file");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert Buffer to Gemini Part
function fileToGenerativePart(buffer, mimeType) {
  // CORRECT STRUCTURE: The inlineData object is a direct property of the Part.
  return {
    inlineData: {
      data: buffer.toString("base64"),
      mimeType,
    },
  };
}

// ⭐ Helper to call Gemini (now accepts files)
async function generateInterviewQuestion(prompt, fileData = null) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    // CORRECT STRUCTURE: The text content is a direct property of the Part.
    const parts = [
      { text: prompt } // Part 0: The prompt text
    ];

    if (fileData) {
      // Part 1: The file data
      parts.push(fileToGenerativePart(fileData.buffer, fileData.mimetype));
    }

    // The generateContent method expects the contents array directly.
    const result = await model.generateContent({ contents: parts }); 
    return result.text.trim();

  } catch (error) {
    console.error("❌ Gemini Error:", error.message);
    // Log the full error for debugging
    console.error("Full Error:", error); 
    return "Error generating response. Please check the resume file format.";
  }
}

module.exports = { generateInterviewQuestion };