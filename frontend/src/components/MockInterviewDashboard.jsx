import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./MockInterviewDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MockInterviewDashboard = () => {
  const [studentName, setStudentName] = useState("");
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    const rollNo = localStorage.getItem("rollNo");

    if (!name || !rollNo) {
      navigate("/login");
    } else {
      setStudentName(name);

      // ✅ Sample interviews
      setInterviews([
        {
          id: 1,
          date: "2025-10-20",
          confidence: "High",
          nervousness: "Low",
          weakAreas: ["Data Structures", "Time Management"],
          strongAreas: ["Communication", "Problem Solving"],
          focusAreas: ["Algorithms"],
        },
        {
          id: 2,
          date: "2025-10-15",
          confidence: "Medium",
          nervousness: "Medium",
          weakAreas: ["Behavioral Questions"],
          strongAreas: ["Coding", "Logical Thinking"],
          focusAreas: ["Behavioral"],
        },
        {
          id: 3,
          date: "2025-10-10",
          confidence: "High",
          nervousness: "Low",
          weakAreas: ["React Hooks"],
          strongAreas: ["CSS", "HTML"],
          focusAreas: ["Frontend"],
        },
      ]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("rollNo");
    navigate("/login");
  };

  // Chart Data
  const chartData = {
    labels: interviews.map((i) => i.date),
    datasets: [
      {
        label: "Confidence",
        data: interviews.map((i) =>
          i.confidence === "High" ? 3 : i.confidence === "Medium" ? 2 : 1
        ),
        borderColor: "#00d5ff",
        backgroundColor: "rgba(0, 213, 255, 0.2)",
        tension: 0.3,
      },
      {
        label: "Nervousness",
        data: interviews.map((i) =>
          i.nervousness === "Low" ? 1 : i.nervousness === "Medium" ? 2 : 3
        ),
        borderColor: "#ff4d6d",
        backgroundColor: "rgba(255, 77, 109, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Performance Over Time" },
    },
    scales: {
      y: {
        min: 0,
        max: 3,
        ticks: {
          stepSize: 1,
          callback: (val) =>
            val === 1 ? "Low" : val === 2 ? "Medium" : "High",
        },
      },
    },
  };

  // Split interviews into carousel slides
  const chunkArray = (arr, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const [chunkSize, setChunkSize] = useState(3);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setChunkSize(1);
      else if (window.innerWidth < 992) setChunkSize(2);
      else setChunkSize(3);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slides = chunkArray(interviews, chunkSize);

  return (
    <div className="mock-dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom px-4">
        <h3 className="navbar-brand fw-bold mb-0">
          Mock Interview Dashboard
        </h3>
        <div className="ms-auto d-flex align-items-center gap-3">
          <button
            onClick={() => navigate("/home")}
            className="btn btn-light btn-sm fw-semibold"
          >
            🏠 Home
          </button>
          <span className="fw-semibold text-white">
            Hi, {studentName || "Student"}
          </span>
          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container py-5">
        <h2 className="mb-4 text-center">Previous Mock Interviews</h2>

        {/* Chart */}
        {interviews.length > 0 && (
          <div className="card shadow-sm mb-5 p-4">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* Carousel */}
        {interviews.length > 0 ? (
          <div
            id="interviewCarousel"
            className="carousel slide mb-4"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {slides.map((slide, idx) => (
                <div
                  className={`carousel-item ${idx === 0 ? "active" : ""}`}
                  key={idx}
                >
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    {slide.map((interview) => (
                      <div
                        key={interview.id}
                        className="card shadow-sm hover-card"
                      >
                        <div className="card-content">
                          <h5 className="fw-bold mb-3">{interview.date}</h5>
                          <div className="mb-2">
                            <span className="badge bg-success me-2">
                              Confidence: {interview.confidence}
                            </span>
                            <span className="badge bg-warning">
                              Nervousness: {interview.nervousness}
                            </span>
                          </div>
                          <p>
                            <strong>Weak Areas:</strong>{" "}
                            {interview.weakAreas.join(", ")}
                          </p>
                          <p>
                            <strong>Strong Areas:</strong>{" "}
                            {interview.strongAreas.join(", ")}
                          </p>
                          <p>
                            <strong>Focus Areas:</strong>{" "}
                            {interview.focusAreas.join(", ")}
                          </p>
                        </div>

                        <div className="card-footer text-center fixed-footer">
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              navigate("/interview-summary", {
                                state: { summary: interview },
                              })
                            }
                          >
                            View Summary
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#interviewCarousel"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#interviewCarousel"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        ) : (
          <p className="text-center">No mock interviews yet.</p>
        )}

        {/* Start New Interview Button */}
        <div className="text-center mt-4">
          <Link to="/start-mock-interview" className="btn btn-primary btn-lg">
            Start New Interview
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-custom text-center py-3">
        © {new Date().getFullYear()} Mock Interview Dashboard
      </footer>
    </div>
  );
};

export default MockInterviewDashboard;
