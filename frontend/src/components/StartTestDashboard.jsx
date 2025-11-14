import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import "./StartTestDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StartTestDashboard = () => {
  const [studentName, setStudentName] = useState("");
  const [tests, setTests] = useState([]);
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem("studentName");
    const rollNo = localStorage.getItem("rollNo");

    if (!name || !rollNo) {
      navigate("/login");
    } else {
      setStudentName(name);

      // Available tests
      setTests([
        { id: 1, title: "JavaScript Fundamentals", description: "Test your core JS knowledge." },
        { id: 2, title: "React Basics", description: "Check your understanding of React." },
        { id: 3, title: "Data Structures", description: "Assess your understanding of DSA concepts." },
        { id: 4, title: "Algorithms", description: "Test problem-solving skills and algorithms." },
        { id: 5, title: "Behavioral Test", description: "Evaluate communication and behavioral skills." },
      ]);

      // Previous test history for chart + carousel
      setHistory([
        { id: 1, title: "JavaScript Fundamentals", score: 85, accuracy: 90 },
        { id: 2, title: "React Basics", score: 70, accuracy: 75 },
        { id: 3, title: "Data Structures", score: 95, accuracy: 92 },
        { id: 4, title: "Algorithms", score: 60, accuracy: 65 },
        { id: 5, title: "Behavioral Test", score: 80, accuracy: 85 },
      ]);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("studentName");
    localStorage.removeItem("rollNo");
    navigate("/login");
  };

  const startTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  // Chart data
  const chartData = {
    labels: history.map((t) => t.title),
    datasets: [
      {
        label: "Score",
        data: history.map((t) => t.score),
        borderColor: "#00d5ff",
        backgroundColor: "rgba(0, 213, 255, 0.2)",
        tension: 0.3,
      },
      {
        label: "Accuracy",
        data: history.map((t) => t.accuracy),
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
      title: { display: true, text: "Past Test Performance" },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 10, callback: (val) => `${val}%` },
      },
    },
  };

  // Chunk history for carousel
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

  const slides = chunkArray(history, chunkSize);

  return (
    <div className="start-test-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom px-4">
        <h3 className="navbar-brand fw-bold mb-0">Start Test Dashboard</h3>
        <div className="ms-auto d-flex align-items-center">
          <span className="me-3 fw-semibold">Hi, {studentName || "Student"}</span>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="container py-5">
        {/* Chart */}
        {history.length > 0 && (
          <div className="card shadow-sm mb-5 p-4">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}

        {/* History Carousel */}
        {history.length > 0 && (
          <div id="historyCarousel" className="carousel slide mb-5" data-bs-ride="carousel">
            <div className="carousel-inner">
              {slides.map((slide, idx) => (
                <div className={`carousel-item ${idx === 0 ? "active" : ""}`} key={idx}>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    {slide.map((test) => (
                      <div key={test.id} className="card shadow-sm p-4 hover-card" style={{ width: "18rem" }}>
                        <h5 className="fw-bold mb-3">{test.title}</h5>
                        <p><strong>Score:</strong> {test.score}%</p>
                        <p><strong>Accuracy:</strong> {test.accuracy}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#historyCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#historyCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        )}

        {/* Test Option Cards */}
        <div className="row g-4">
          {tests.map((test) => (
            <div key={test.id} className="col-md-6 col-lg-4">
              <div className="card shadow-sm p-4 hover-card test-card">
                <h5 className="fw-bold mb-3">{test.title}</h5>
                <p>{test.description}</p>
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={() => startTest(test.id)}
                >
                  Start Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer-custom text-center py-3">
        © {new Date().getFullYear()} Student Dashboard | All Rights Reserved
      </footer>
    </div>
  );
};

export default StartTestDashboard;
