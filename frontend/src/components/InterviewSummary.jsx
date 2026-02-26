import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./InterviewSummary.css";

const InterviewSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { summary, interviewData, isAlreadySaved } = location.state || {};

  const [parsedSummary, setParsedSummary] = useState({
    confidence: "N/A",
    nervousness: "N/A",
    weakAreas: [],
    strongAreas: [],
    overallSummary: "",
    technicalScore: 0,
    communicationScore: 0,
    recommendation: "",
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // useEffect(() => {
  //   if (summary) {
  //     try {
  //       let cleanSummary = summary.weakAreas;

  //       // If the summary contains a JSON code block, extract and parse it
  //       if (typeof cleanSummary === "string" && cleanSummary.includes("```json")) {
  //         const jsonMatch = cleanSummary.match(/```json([\s\S]*?)```/);
  //         if (jsonMatch && jsonMatch[1]) {
  //           const parsed = JSON.parse(jsonMatch[1].trim());
  //           setParsedSummary(parsed);
  //           return;
  //         }
  //       }

  //       // If summary is already a JSON object
  //       if (typeof summary.weakAreas === "object") {
  //         setParsedSummary(summary.weakAreas);
  //       }
  //     } catch (err) {
  //       console.error("Error parsing summary JSON:", err);
  //     }
  //   }
  // }, [summary]);
useEffect(() => {
  if (!summary) return;
  

  try {
    // ✅ Case 1: summary is already an object from backend
    if (typeof summary === "object") {
      setParsedSummary({
        confidence: summary.confidence ?? "N/A",
        nervousness: summary.nervousness ?? "N/A",
        weakAreas: summary.weakAreas ?? [],
        strongAreas: summary.strongAreas ?? [],
        overallSummary: summary.overallSummary ?? "",
        technicalScore: Number(summary.technicalScore) ?? 0,
        communicationScore: Number(summary.communicationScore) ?? 0,
        recommendation: summary.recommendation ?? "",
      });
      
      return;
    }

    // ✅ Case 2: summary is a string (contains JSON)
    if (typeof summary === "string") {
      const cleanText = summary.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanText);

      setParsedSummary({
        confidence: parsed.confidence ?? "N/A",
        nervousness: parsed.nervousness ?? "N/A",
        weakAreas: parsed.weakAreas ?? [],
        strongAreas: parsed.strongAreas ?? [],
        overallSummary: parsed.overallSummary ?? "",
        technicalScore: Number(parsed.technicalScore) ?? 0,
        communicationScore: Number(parsed.communicationScore) ?? 0,
        recommendation: parsed.recommendation ?? "",
      });
    }
  } catch (err) {
    console.error("Error parsing summary JSON:", err);
  }
}, [summary]);

useEffect(() => {
  // run only after parsedSummary is ready
  if (!summary) return;
  if (saving || saved) return;
  if (isAlreadySaved) return; // Don't auto-save if viewing an already saved interview

  const timer = setTimeout(() => {
    handleSaveInterview();   // auto save
  }, 600); // small delay so parsedSummary is updated

  return () => clearTimeout(timer);
}, [parsedSummary]);



//     useEffect(() => {
//   if (!summary) return;
//   if (saved || saving) return;

//   // small delay so parsedSummary gets set
//   const timer = setTimeout(() => {
//     handleSaveInterview();
//   }, 500);

//   return () => clearTimeout(timer);
// }, [summary]);

// useEffect(() => {
//   if (!summary) return;     // no summary yet
//   if (saving || saved) return;  // already saving or saved

//   const timer = setTimeout(() => {
//     handleSaveInterview();
//   }, 700);   // wait so parsedSummary is ready

//   return () => clearTimeout(timer);
// }, [summary]);



  // Save interview summary to database
  const handleSaveInterview = async () => {
    try {
      if (saving || saved) return;

      setSaving(true);

      const rollNo = localStorage.getItem("rollNo");
      const studentName = localStorage.getItem("studentName");

      if (!rollNo || !studentName) {
        alert("User information not found. Please login again.");
        navigate("/login");
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      const interviewPayload = {
        rollNo,
        studentName,
        date: today,
        role: interviewData?.role || "N/A",
        company: interviewData?.company || "N/A",
        experience: interviewData?.experience || "N/A",
        topic: interviewData?.topic || "N/A",
        difficulty: interviewData?.difficulty || "N/A",
        confidence: parsedSummary.confidence || summary?.confidence || "N/A",
        nervousness: parsedSummary.nervousness || summary?.nervousness || "N/A",
        weakAreas: parsedSummary.weakAreas || [],
        strongAreas: parsedSummary.strongAreas || [],
        focusAreas: [interviewData?.topic || "General"],
        overallSummary: parsedSummary.overallSummary || summary?.overallSummary || "",
        technicalScore: parsedSummary.technicalScore || summary?.technicalScore || 0,
        communicationScore: parsedSummary.communicationScore || summary?.communicationScore || 0,
        recommendation: parsedSummary.recommendation || summary?.recommendation || "",
        resumeText: interviewData?.resumeText || "",
        messages: interviewData?.messages || []
      };

      const response = await axios.post(
        "http://localhost:5000/api/interview/save",
        interviewPayload
      );

      if (response.data.success) {
        setSaved(true);
      }
    } catch (error) {
      console.error("Error saving interview:", error);
      alert("Failed to save interview. Please try again.");
    } finally {
      setSaving(false);
    }
  };


  return (
    <div className="summary-container">
      <h2 className="summary-heading">Interview Summary</h2>

      <div className="summary-content">
        <div className="summary-section">
          <h3>Overall Summary</h3>
          <p className="overall-summary-text">
            {parsedSummary.overallSummary || summary?.overallSummary || "No overall summary available."}
          </p>
        </div>

        <div className="summary-section">
          <h3>Confidence Level</h3>
          <p>
            <span className={`badge ${
              (parsedSummary.confidence || summary?.confidence) === 'High' ? 'bg-success' :
              (parsedSummary.confidence || summary?.confidence) === 'Medium' ? 'bg-warning' :
              'bg-danger'
            }`}>
              {parsedSummary.confidence || summary?.confidence || "N/A"}
            </span>
          </p>
        </div>

        <div className="summary-section">
          <h3>Nervousness Level</h3>
          <p>
            <span className={`badge ${
              (parsedSummary.nervousness || summary?.nervousness) === 'Low' ? 'bg-success' :
              (parsedSummary.nervousness || summary?.nervousness) === 'Medium' ? 'bg-warning' :
              'bg-danger'
            }`}>
              {parsedSummary.nervousness || summary?.nervousness || "N/A"}
            </span>
          </p>
        </div>

        <div className="summary-section">
          <h3>Interview Performance Scores</h3>
          <div className="d-flex gap-4 align-items-center">
            <div>
              <p className="mb-1"><strong>Technical Skills:</strong></p>
              <div className="progress" style={{ width: '200px', height: '25px' }}>
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  style={{ width: `${(parsedSummary.technicalScore || summary?.technicalScore || 0) * 10}%` }}
                  aria-valuenow={parsedSummary.technicalScore || summary?.technicalScore || 0}
                  aria-valuemin="0"
                  aria-valuemax="10"
                >
                  {parsedSummary.technicalScore || summary?.technicalScore || 0}/10
                </div>
              </div>
            </div>
            <div>
              <p className="mb-1"><strong>Communication:</strong></p>
              <div className="progress" style={{ width: '200px', height: '25px' }}>
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  style={{ width: `${(parsedSummary.communicationScore || summary?.communicationScore || 0) * 10}%` }}
                  aria-valuenow={parsedSummary.communicationScore || summary?.communicationScore || 0}
                  aria-valuemin="0"
                  aria-valuemax="10"
                >
                  {parsedSummary.communicationScore || summary?.communicationScore || 0}/10
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-section">
          <h3>Recommendation</h3>
          <p>
            <span className={`badge ${
              (parsedSummary.recommendation || summary?.recommendation) === 'Highly Recommended' ? 'bg-success' :
              (parsedSummary.recommendation || summary?.recommendation) === 'Recommended' ? 'bg-primary' :
              'bg-danger'
            } fs-6`}>
              {parsedSummary.recommendation || summary?.recommendation || "N/A"}
            </span>
          </p>
        </div>

        <div className="summary-section">
          <h3>Areas for Improvement</h3>
          {parsedSummary.weakAreas?.length ? (
            <ul className="list-group">
              {parsedSummary.weakAreas.map((area, index) => (
                <li key={index} className="list-group-item">{area}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No specific areas identified.</p>
          )}
        </div>

        <div className="summary-section">
          <h3>Strong Areas</h3>
          {parsedSummary.strongAreas?.length ? (
            <ul className="list-group">
              {parsedSummary.strongAreas.map((area, index) => (
                <li key={index} className="list-group-item list-group-item-success">{area}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted">No specific areas identified.</p>
          )}
        </div>
      </div>

      {/* Button Section */}
      <div className="button-container">
        <button className="dashboard-btn" onClick={() => navigate("/mock-interview")}>
          Go to Dashboard
        </button>
        <button className="home-btn" onClick={() => navigate("/home")}>
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default InterviewSummary;
