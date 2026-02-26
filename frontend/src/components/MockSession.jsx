import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./MockSession.css";

const MockSession = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, experience, company, selectedTopic, difficulty, resumeText, interviewData } =
    location.state || {};

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ending, setEnding] = useState(false);

  // Speech states
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [countdown, setCountdown] = useState(null); // For showing countdown
  const [countdownProgress, setCountdownProgress] = useState(100); // Progress bar percentage

  // Refs
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const countdownIntervalRef = useRef(null);
  const shouldAutoSendRef = useRef(false);
  const userInputRef = useRef("");
  const messagesRef = useRef([]);

  // Keep refs in sync with state
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Trigger auto-send function
  const triggerAutoSend = async () => {
    const answer = userInputRef.current.trim();

    if (!answer) {
      console.log("No answer to send");
      return;
    }

    console.log("Auto-sending answer:", answer);

    const newMessages = [...messagesRef.current, { sender: "user", text: answer }];
    setMessages(newMessages);
    setUserInput("");
    setTranscript("");
    userInputRef.current = "";
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/interview/respond", {
        userMessage: answer,
        previousMessages: newMessages,
        role,
        experience,
        company,
        topic: selectedTopic,
        difficulty,
        resumeText: resumeText || "",
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

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interimText = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += transcriptPart + " ";
          } else {
            interimText += transcriptPart;
          }
        }

        console.log("Speech result - Final:", finalText, "Interim:", interimText);

        // Update final transcript
        if (finalText) {
          setTranscript((prev) => prev + finalText);
          setUserInput((prev) => {
            const newInput = prev + finalText;
            userInputRef.current = newInput; // Update ref immediately
            console.log("Updated userInput to:", newInput);
            return newInput;
          });
        }

        // Update interim transcript (real-time display)
        setInterimTranscript(interimText);

        // Clear any existing countdown
        clearTimeout(silenceTimerRef.current);
        clearInterval(countdownIntervalRef.current);
        setCountdown(null);
        setCountdownProgress(100);
        shouldAutoSendRef.current = false;

        // Start countdown after 3 seconds of silence
        setCountdown(3);

        silenceTimerRef.current = setTimeout(() => {
          console.log("3 seconds of silence detected, stopping recognition...");
          shouldAutoSendRef.current = true;
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
        }, 3000);

        // Update countdown display every 100ms
        let elapsed = 0;
        countdownIntervalRef.current = setInterval(() => {
          elapsed += 100;
          const remaining = 3000 - elapsed;
          const secondsLeft = Math.ceil(remaining / 1000);
          const progress = (remaining / 3000) * 100;

          setCountdown(secondsLeft);
          setCountdownProgress(progress);

          if (remaining <= 0) {
            clearInterval(countdownIntervalRef.current);
          }
        }, 100);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log("Recognition ended, shouldAutoSend:", shouldAutoSendRef.current);
        setIsListening(false);
        setInterimTranscript("");
        clearInterval(countdownIntervalRef.current);
        setCountdown(null);
        setCountdownProgress(100);

        // Auto-send if triggered by silence timeout
        if (shouldAutoSendRef.current) {
          shouldAutoSendRef.current = false;
          console.log("Triggering auto-send with input:", userInputRef.current);
          // Small delay to ensure all state updates are processed
          setTimeout(() => {
            triggerAutoSend();
          }, 200);
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("Speech Recognition not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      clearTimeout(silenceTimerRef.current);
      clearInterval(countdownIntervalRef.current);
      synthesisRef.current.cancel();
    };
  }, []);

  // Text-to-Speech for AI messages
  useEffect(() => {
    if (interviewData?.question) {
      const welcomeMsg = { sender: "ai", text: interviewData.question };
      setMessages([welcomeMsg]);
      speakText(interviewData.question);
    } else {
      const welcomeMsg = { sender: "ai", text: "Welcome to your mock interview!" };
      setMessages([welcomeMsg]);
      speakText("Welcome to your mock interview!");
    }
  }, [interviewData]);

  // Speak AI responses automatically
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.sender === "ai" && !loading) {
        speakText(lastMessage.text);
      }
    }
  }, [messages, loading]);

  // Text-to-Speech function
  const speakText = (text) => {
    // Cancel any ongoing speech
    synthesisRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-start listening after AI finishes speaking
      setTimeout(() => {
        startListening();
      }, 500);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };

    synthesisRef.current.speak(utterance);
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript("");
      setUserInput("");
      userInputRef.current = "";
      setInterimTranscript("");
      setCountdown(null);
      setCountdownProgress(100);
      shouldAutoSendRef.current = false;
      console.log("Starting speech recognition...");
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      shouldAutoSendRef.current = false; // Don't auto-send when manually stopped
      recognitionRef.current.stop();
      clearTimeout(silenceTimerRef.current);
      clearInterval(countdownIntervalRef.current);
      setCountdown(null);
      setCountdownProgress(100);
      setInterimTranscript("");
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    synthesisRef.current.cancel();
    setIsSpeaking(false);
  };

  // Handle sending speech answer (auto-triggered after 3s silence)
  const handleSendSpeech = async () => {
    if (!userInput.trim()) return;

    const answer = userInput.trim();
    const newMessages = [...messages, { sender: "user", text: answer }];
    setMessages(newMessages);
    setUserInput("");
    setTranscript("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/interview/respond", {
        userMessage: answer,
        previousMessages: newMessages,
        role,
        experience,
        company,
        topic: selectedTopic,
        difficulty,
        resumeText: resumeText || "",
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

  // Manual send (kept for fallback)
  const handleSend = async () => {
    stopListening();
    handleSendSpeech();
  };

  const handleEndInterview = async () => {
    try {
      setEnding(true);
      const res = await axios.post("http://localhost:5000/api/interview/summary", {
        messages,
        role,
        company,
      });

      navigate("/interview-summary", {
        state: {
          summary: res.data.summary,
          interviewData: {
            role,
            company,
            experience,
            topic: selectedTopic,
            difficulty,
            resumeText: resumeText || "",
            messages
          }
        }
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Failed to generate summary. Please try again.");
    } finally {
      setEnding(false);
    }
  };


  return (
    <div className="mock-session-container">
      <div className="mock-session-card">
        <div className="session-header">
          <h3>Mock Interview Session</h3>
          <p>
            Role: <b>{role}</b> | Topic: <b>{selectedTopic}</b> | Company: <b>{company}</b>
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

        <div className="voice-input-section">
          {/* Voice Status Indicator */}
          <div className="voice-status">
            {isSpeaking && (
              <div className="status-badge speaking">
                <i className="bi bi-volume-up-fill"></i>
                <span>AI Speaking...</span>
                <button
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={stopSpeaking}
                >
                  Stop
                </button>
              </div>
            )}

            {isListening && !isSpeaking && (
              <div className="status-badge listening">
                <i className="bi bi-mic-fill pulse-icon"></i>
                <span>Listening... (Auto-send after 3s silence)</span>
              </div>
            )}

            {!isListening && !isSpeaking && !loading && (
              <div className="status-badge ready">
                <i className="bi bi-mic-mute"></i>
                <span>Ready to listen</span>
              </div>
            )}

            {loading && (
              <div className="status-badge processing">
                <div className="spinner-border spinner-border-sm me-2"></div>
                <span>AI is thinking...</span>
              </div>
            )}
          </div>

          {/* Live Transcript Display */}
          {(userInput || interimTranscript) && (
            <div className="live-transcript">
              <p className="transcript-label">
                <i className="bi bi-mic-fill me-2"></i>
                Your Answer:
              </p>
              <p className="transcript-text">
                <span className="final-text">{userInput}</span>
                {interimTranscript && (
                  <span className="interim-text">{interimTranscript}</span>
                )}
              </p>

              {/* Countdown Timer with Progress Bar */}
              {countdown !== null && isListening && (
                <div className="countdown-container">
                  <div className="countdown-info">
                    <i className="bi bi-hourglass-split me-2"></i>
                    <span>Auto-sending in {countdown}s...</span>
                  </div>
                  <div className="countdown-progress-bar">
                    <div
                      className="countdown-progress-fill"
                      style={{ width: `${countdownProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Voice Controls */}
          <div className="voice-controls">
            <button
              className={`btn btn-voice ${isListening ? "btn-danger" : "btn-primary"}`}
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking || loading}
            >
              <i className={`bi ${isListening ? "bi-mic-fill" : "bi-mic"}`}></i>
              {isListening ? "Stop Recording" : "Start Recording"}
            </button>

            {userInput && (
              <button
                className="btn btn-success"
                onClick={handleSend}
                disabled={loading || isSpeaking}
              >
                <i className="bi bi-send-fill"></i>
                Send Now
              </button>
            )}
          </div>
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