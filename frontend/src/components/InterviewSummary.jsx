import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./InterviewSummary.css";

const InterviewSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { summary } = location.state || {};

  const [parsedSummary, setParsedSummary] = useState({
    confidence: "N/A",
    nervousness: "N/A",
    weakAreas: [],
    strongAreas: [],
    videos: [],
  });

  useEffect(() => {
    if (summary) {
      try {
        let cleanSummary = summary.weakAreas;

        // If the summary contains a JSON code block, extract and parse it
        if (typeof cleanSummary === "string" && cleanSummary.includes("```json")) {
          const jsonMatch = cleanSummary.match(/```json([\s\S]*?)```/);
          if (jsonMatch && jsonMatch[1]) {
            const parsed = JSON.parse(jsonMatch[1].trim());
            setParsedSummary(parsed);
            return;
          }
        }

        // If summary is already a JSON object
        if (typeof summary.weakAreas === "object") {
          setParsedSummary(summary.weakAreas);
        }
      } catch (err) {
        console.error("Error parsing summary JSON:", err);
      }
    }
  }, [summary]);

  // Extract YouTube video ID from a link
  const extractYouTubeID = (url) => {
    try {
      const regExp =
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
      const match = url.match(regExp);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="summary-container">
      <h2 className="summary-heading">Interview Summary</h2>

      <div className="summary-content">
        <div className="summary-section">
          <h3>Confidence</h3>
          <p>{parsedSummary.confidence || summary?.confidence}</p>
        </div>

        <div className="summary-section">
          <h3>Nervousness</h3>
          <p>{parsedSummary.nervousness || summary?.nervousness}</p>
        </div>

        <div className="summary-section">
          <h3>Weak Areas</h3>
          {parsedSummary.weakAreas?.length ? (
            <ul>
              {parsedSummary.weakAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          ) : (
            <p>None identified.</p>
          )}
        </div>

        <div className="summary-section">
          <h3>Strong Areas</h3>
          {parsedSummary.strongAreas?.length ? (
            <ul>
              {parsedSummary.strongAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          ) : (
            <p>None identified.</p>
          )}
        </div>

        <div className="summary-section">
          <h3>YouTube Recommendations</h3>
          {parsedSummary.videos?.length ? (
            <div className="video-grid">
              {parsedSummary.videos.map((url, index) => {
                const videoId = extractYouTubeID(url);
                return videoId ? (
                  <div key={index} className="video-card">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`YouTube video ${index + 1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="yt-link"
                  >
                    Watch Video {index + 1}
                  </a>
                );
              })}
            </div>
          ) : (
            <p>No links available.</p>
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
