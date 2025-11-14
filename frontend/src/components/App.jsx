import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Existing imports
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import MockInterviewDashboard from "./MockInterviewDashboard";
import StartTestDashboard from "./StartTestDashboard";
import StartMockInterview from "./StartMockInterview";
import MockSession from "./MockSession";

// ✅ New import for the Interview Summary page
import InterviewSummary from "./InterviewSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /register */}
        <Route path="/" element={<Navigate to="/register" />} />

        {/* Auth Pages */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Student Dashboard */}
        <Route path="/home" element={<Home />} />
        <Route path="/mock-interview" element={<MockInterviewDashboard />} />
        <Route path="/start-test" element={<StartTestDashboard />} />

        {/* Mock Interview Routes */}
        <Route path="/start-mock-interview" element={<StartMockInterview />} />
        <Route path="/mock-session" element={<MockSession />} />

        {/* ✅ New Route for Interview Summary */}
        <Route path="/interview-summary" element={<InterviewSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
