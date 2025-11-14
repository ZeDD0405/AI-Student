import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./StartMockInterview.css";

const StartMockInterview = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    company: "",
    selectedTopic: "",
    difficulty: "",
    mode: "",
  });

  const [loading, setLoading] = useState(false);

  // ---------------- Handle Input Change ----------------
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------- Handle Start Interview ----------------
  const handleStart = async () => {
    const { role, experience, company, selectedTopic, difficulty, mode } = formData;

    if (!role || !experience || !company || !selectedTopic || !difficulty || !mode) {
      alert("⚠️ Please fill out all fields before starting your mock interview!");
      return;
    }

    try {
      setLoading(true);

      // ✅ Send interview details to backend to save in DB
      const res = await axios.post(
        "http://localhost:5000/api/interview/start",
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("✅ Response from backend:", res.data);

      // Navigate to mock session page with data
      navigate("/mock-session", { state: { ...formData, interviewData: res.data } });
    } catch (error) {
      console.error("❌ Error starting mock interview:", error);
      alert("Unable to start mock interview. Please ensure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="start-mock-container">
      <div className="start-card">
        <h2 className="text-center mb-4 fw-bold">Start a New Mock Interview</h2>

        {/* Role Input */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Role you want to interview for</label>
          <input
            type="text"
            className="form-control"
            name="role"
            placeholder="e.g., Frontend Developer"
            value={formData.role}
            onChange={handleChange}
          />
        </div>

        {/* Experience Input */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Experience you have in this field</label>
          <input
            type="text"
            className="form-control"
            name="experience"
            placeholder="e.g., 6 months, 2 years, Fresher"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        {/* Company Input */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Company Name</label>
          <input
            type="text"
            className="form-control"
            name="company"
            placeholder="e.g., Google, Infosys, TCS"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        {/* Topic Dropdown */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Select Topic</label>
          <select
            className="form-select"
            name="selectedTopic"
            value={formData.selectedTopic}
            onChange={handleChange}
          >
            <option value="">-- Choose a topic --</option>
            <option value="DSA">Data Structures & Algorithms</option>
            <option value="Frontend">Frontend (HTML, CSS, React)</option>
            <option value="Backend">Backend (Node.js, Express, MongoDB)</option>
            <option value="Behavioral">Behavioral / HR Questions</option>
          </select>
        </div>

        {/* Difficulty Buttons */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Select Difficulty</label>
          <div className="btn-group-container">
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                type="button"
                className={`btn ${
                  formData.difficulty === level
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, difficulty: level }))}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Mode Buttons */}
        <div className="mb-4">
          <label className="form-label fw-semibold">Interview Mode</label>
          <div className="btn-group-container">
            {["Voice", "Text"].map((m) => (
              <button
                key={m}
                type="button"
                className={`btn ${
                  formData.mode === m ? "btn-success" : "btn-outline-success"
                }`}
                onClick={() => setFormData((prev) => ({ ...prev, mode: m }))}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button
            onClick={handleStart}
            className="btn btn-dark btn-lg start-btn"
            disabled={loading}
          >
            {loading ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMockInterview;
