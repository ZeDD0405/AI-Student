import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewQuestions.css";

const ViewQuestions = () => {
  const { branch, company } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, year, position

  useEffect(() => {
    fetchQuestions();
  }, [branch, company]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/question/view/${encodeURIComponent(branch)}/${encodeURIComponent(company)}`
      );
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  // Group questions by year
  const questionsByYear = questions.reduce((acc, q) => {
    const year = q.year || "Unknown";
    if (!acc[year]) acc[year] = [];
    acc[year].push(q);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="view-questions-wrapper">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-questions-wrapper">
      <div className="view-questions-container">
        <div className="view-header">
          <button
            className="back-btn-view"
            onClick={() => navigate(`/company-list/${encodeURIComponent(branch)}?mode=view`)}
          >
            ← Back
          </button>
          <div className="header-content">
            <h1 className="view-title">{company}</h1>
            <p className="view-subtitle">{branch}</p>
            <div className="stats-bar">
              <div className="stat-item">
                <span className="stat-icon">📝</span>
                <span className="stat-value">{questions.length}</span>
                <span className="stat-label">Questions</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">📅</span>
                <span className="stat-value">{Object.keys(questionsByYear).length}</span>
                <span className="stat-label">Years</span>
              </div>
            </div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="empty-state-questions">
            <span className="empty-icon-big">📭</span>
            <h2>No Questions Yet</h2>
            <p>No questions have been added for {company} in {branch} yet.</p>
            <button
              className="btn-add-first"
              onClick={() => navigate(`/question-module/${encodeURIComponent(branch)}/${encodeURIComponent(company)}`)}
            >
              Be the first to add! →
            </button>
          </div>
        ) : (
          <div className="questions-content">
            {Object.entries(questionsByYear)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([year, yearQuestions]) => (
                <div key={year} className="year-section">
                  <h2 className="year-header">
                    <span className="year-badge">{year}</span>
                    <span className="year-count">{yearQuestions.length} questions</span>
                  </h2>

                  <div className="questions-list">
                    {yearQuestions.map((q, index) => (
                      <div key={index} className="question-item">
                        <div className="question-number">{index + 1}</div>
                        <div className="question-content">
                          <div className="question-meta">
                            <span className="meta-badge position-badge">
                              💼 {q.position}
                            </span>
                            <span className="meta-badge year-badge-small">
                              📅 {q.year}
                            </span>
                          </div>
                          <p className="question-text">{q.questionText || q.question}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewQuestions;
