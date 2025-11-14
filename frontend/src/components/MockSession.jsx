import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MockSession.css";

const MockSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, experience, company, selectedTopic, difficulty, mode, interviewData } =
    location.state || {};

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    if (interviewData?.question) {
      setMessages([{ sender: "ai", text: interviewData.question }]);
    } else {
      setMessages([{ sender: "ai", text: "Welcome to your mock interview!" }]);
    }
  }, [interviewData]);

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const newMessages = [...messages, { sender: "user", text: userInput }];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/interview/respond", {
        userMessage: userInput,
        previousMessages: newMessages,
        role,
        experience,
        company,
        topic: selectedTopic,
        difficulty,
        mode,
      });

      const aiResponse = res.data.response || "No response received.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = async () => {
    try {
      setEnding(true);
      const res = await axios.post("http://localhost:5000/api/interview/summary", {
        messages,
        role,
        company,
      });

      navigate("/interview-summary", { state: { summary: res.data.summary } });
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setEnding(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mock-session-container">
      <div className="mock-session-card">
        <div className="session-header">
          <h3>Mock Interview Session</h3>
          <p>
            Role: <b>{role}</b> | Topic: <b>{selectedTopic}</b> | Mode: <b>{mode}</b>
          </p>
        </div>

        <div className="chat-window">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                msg.sender === "user" ? "user-bubble" : "ai-bubble"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="typing">AI is thinking...</div>}
        </div>

        <div className="input-section">
          <textarea
            className="form-control chat-input"
            placeholder="Type your answer..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="btn btn-primary send-btn"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>

        <div className="footer-btns">
          <button
            className="btn btn-outline-danger"
            onClick={handleEndInterview}
            disabled={ending}
          >
            {ending ? "Generating Summary..." : "End Interview"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockSession;