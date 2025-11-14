import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css";

const Home = () => {
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("studentName");
    if (storedName) {
      setStudentName(storedName);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("rollNo");
    navigate("/login");
  };

  return (
    <div className="home-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom px-4">
        <h3 className="navbar-brand fw-bold mb-0">Student Dashboard</h3>
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3 fw-semibold welcome-text">
            Welcome, {studentName || "Student"}
          </span>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Logout
          </button>
        </div>
      </nav>

      {/* Main Options */}
      <div className="container d-flex flex-column justify-content-center align-items-center flex-grow-1 landing-container">
        <h2 className="fw-bold my-5 text-center landing-title">
          Choose Your Path
        </h2>

        <div className="d-flex flex-column flex-md-row gap-5 justify-content-center options-container">
          {/* Start Test */}
          <Link to="/start-test" className="option-card option-card-primary">
            <div className="option-icon">
              <i className="bi bi-pencil-square"></i>
            </div>
            <h4 className="option-title">Start Test</h4>
            <p className="option-desc">Take scheduled tests and track your progress.</p>
          </Link>

          {/* Start Mock Interview */}
          <Link to="/mock-interview" className="option-card option-card-success">
            <div className="option-icon">
              <i className="bi bi-mic-fill"></i>
            </div>
            <h4 className="option-title">Start Mock Interview</h4>
            <p className="option-desc">Practice AI-based mock interviews and improve skills.</p>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-custom">
        <p className="mb-0">
          © {new Date().getFullYear()} Student Dashboard | All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default Home;
