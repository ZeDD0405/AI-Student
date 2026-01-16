import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./TeacherDashboard.css";

const TeacherDashboard = () => {
  const [teacherName, setTeacherName] = useState("");
  const [tests, setTests] = useState([]);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [creatingTest, setCreatingTest] = useState(false);

  // Test creation state
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    subject: "",
    totalQuestions: 0,
    timeLimit: 30
  });

  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsList, setQuestionsList] = useState([]);

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    difficulty: "Medium"
  });

  const navigate = useNavigate();

  const subjects = [
    "JavaScript Fundamentals",
    "React Basics",
    "Data Structures",
    "Algorithms",
    "Behavioral Test"
  ];

  useEffect(() => {
    const name = localStorage.getItem("teacherName");
    if (!name) {
      navigate("/login");
    } else {
      setTeacherName(name);
      fetchTests();
    }
  }, [navigate]);

  const fetchTests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/test/all");
      if (response.data.success) {
        setTests(response.data.tests);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("teacherName");
    localStorage.removeItem("teacherEmail");
    navigate("/login");
  };

  const handleTestDetailsSubmit = (e) => {
    e.preventDefault();

    if (!testDetails.title || !testDetails.subject || testDetails.totalQuestions < 1 || testDetails.timeLimit < 5) {
      alert("Please fill in all fields. Total questions must be at least 1 and time limit must be at least 5 minutes.");
      return;
    }

    // Start test creation flow
    setCreatingTest(true);
    setShowCreateTestModal(false);
    setCurrentQuestionIndex(0);
    setQuestionsList([]);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...questionForm.options];
    newOptions[index] = value;
    setQuestionForm({ ...questionForm, options: newOptions });
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();

    if (!questionForm.question.trim()) {
      alert("Please enter the question");
      return;
    }

    if (questionForm.options.some(opt => !opt.trim())) {
      alert("Please fill in all 4 options");
      return;
    }

    // Add question to list
    const newQuestion = {
      question: questionForm.question,
      options: questionForm.options,
      correctAnswer: questionForm.correctAnswer,
      difficulty: questionForm.difficulty
    };

    const updatedList = [...questionsList, newQuestion];
    setQuestionsList(updatedList);

    // Reset form
    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      difficulty: "Medium"
    });

    // Move to next question or finish
    if (currentQuestionIndex + 1 < testDetails.totalQuestions) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions added, ready to publish
      setCurrentTest({
        ...testDetails,
        questions: updatedList
      });
    }
  };

  const handlePublishTest = async () => {
    if (!currentTest) return;

    try {
      const response = await axios.post("http://localhost:5000/api/test/create", {
        ...currentTest,
        questions: questionsList
      });

      if (response.data.success) {
        const testId = response.data.test._id;

        // Publish the test
        const publishResponse = await axios.put(`http://localhost:5000/api/test/publish/${testId}`);

        if (publishResponse.data.success) {
          alert("Test published successfully to students!");

          // Reset everything
          setCreatingTest(false);
          setCurrentTest(null);
          setQuestionsList([]);
          setCurrentQuestionIndex(0);
          setTestDetails({
            title: "",
            description: "",
            subject: "",
            totalQuestions: 0,
            timeLimit: 30
          });

          // Refresh tests list
          fetchTests();
        }
      }
    } catch (error) {
      console.error("Error publishing test:", error);
      alert("Failed to publish test. Please try again.");
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/test/${id}`);
      if (response.data.success) {
        alert("Test deleted successfully!");
        fetchTests();
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete test");
    }
  };

  const cancelTestCreation = () => {
    if (window.confirm("Are you sure you want to cancel? All progress will be lost.")) {
      setCreatingTest(false);
      setCurrentTest(null);
      setQuestionsList([]);
      setCurrentQuestionIndex(0);
      setTestDetails({
        title: "",
        description: "",
        subject: "",
        totalQuestions: 0,
        timeLimit: 30
      });
      setQuestionForm({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        difficulty: "Medium"
      });
    }
  };

  // Check if all questions are added
  const allQuestionsAdded = questionsList.length === testDetails.totalQuestions && testDetails.totalQuestions > 0;

  return (
    <div className="teacher-dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom px-4">
        <h3 className="navbar-brand fw-bold mb-0">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Teacher Dashboard
        </h3>
        <div className="ms-auto d-flex align-items-center gap-3">
          <span className="fw-semibold text-white">
            Welcome, {teacherName || "Teacher"}
          </span>
          <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </nav>

      <div className="container py-5">
        {/* Main Action - Create New Test */}
        {!creatingTest && (
          <>
            <div className="row mb-4">
              <div className="col-12 text-center">
                <button
                  className="btn btn-primary btn-lg me-3"
                  onClick={() => setShowCreateTestModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Test
                </button>
                <button
                  className="btn btn-success btn-lg"
                  onClick={() => navigate("/test-results-view")}
                >
                  <i className="bi bi-bar-chart-fill me-2"></i>
                  View Results
                </button>
              </div>
            </div>

            {/* Existing Tests List */}
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm p-4">
                  <h4 className="mb-3">
                    <i className="bi bi-list-check me-2"></i>
                    Published Tests
                    <span className="badge bg-primary ms-2">{tests.length}</span>
                  </h4>

                  {tests.length === 0 ? (
                    <p className="text-muted text-center py-4">
                      <i className="bi bi-inbox me-2"></i>
                      No tests created yet. Click "Create New Test" to get started.
                    </p>
                  ) : (
                    <div className="test-list">
                      {tests.map((test) => (
                        <div key={test._id} className="test-item">
                          <div className="test-header">
                            <div>
                              <h5 className="mb-1">{test.title}</h5>
                              <p className="text-muted mb-0">{test.description}</p>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteTest(test._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                          <div className="test-meta">
                            <span className="badge bg-info">{test.subject}</span>
                            <span className="badge bg-secondary">{test.totalQuestions} Questions</span>
                            <span className="badge bg-primary">
                              <i className="bi bi-clock me-1"></i>
                              {test.timeLimit} mins
                            </span>
                            <span className={`badge ${test.isPublished ? 'bg-success' : 'bg-warning'}`}>
                              {test.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Test Creation Flow */}
        {creatingTest && (
          <div className="test-creation-container">
            {/* Progress Header */}
            <div className="card shadow-sm p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h4 className="mb-1">Creating: {testDetails.title}</h4>
                  <p className="text-muted mb-0">{testDetails.subject}</p>
                </div>
                <div className="text-end">
                  <div className="progress-text">
                    Question {Math.min(currentQuestionIndex + 1, testDetails.totalQuestions)} of {testDetails.totalQuestions}
                  </div>
                  <div className="progress mt-2" style={{width: '200px', height: '8px'}}>
                    <div
                      className="progress-bar"
                      style={{width: `${(questionsList.length / testDetails.totalQuestions) * 100}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Form or Publish Button */}
            {!allQuestionsAdded ? (
              <div className="card shadow-sm p-4">
                <h5 className="mb-3">
                  <i className="bi bi-pencil-square me-2"></i>
                  Add Question {currentQuestionIndex + 1}
                </h5>

                <form onSubmit={handleAddQuestion}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-semibold">Difficulty *</label>
                      <select
                        className="form-select"
                        value={questionForm.difficulty}
                        onChange={(e) => setQuestionForm({...questionForm, difficulty: e.target.value})}
                        required
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Question *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                        placeholder="Enter the question..."
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Options *</label>
                      {questionForm.options.map((option, index) => (
                        <div key={index} className="mb-2">
                          <div className="input-group">
                            <span className="input-group-text">
                              <input
                                type="radio"
                                checked={questionForm.correctAnswer === index}
                                onChange={() => setQuestionForm({...questionForm, correctAnswer: index})}
                                className="form-check-input mt-0"
                              />
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              required
                            />
                          </div>
                        </div>
                      ))}
                      <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Select the radio button to mark the correct answer
                      </small>
                    </div>

                    <div className="col-12">
                      <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-success">
                          <i className="bi bi-plus-circle me-2"></i>
                          Add Question ({questionsList.length + 1}/{testDetails.totalQuestions})
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={cancelTestCreation}>
                          <i className="bi bi-x-circle me-2"></i>
                          Cancel Test Creation
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card shadow-sm p-4 text-center">
                <h4 className="mb-3 text-success">
                  <i className="bi bi-check-circle me-2"></i>
                  All Questions Added!
                </h4>
                <p className="mb-4">You've added all {testDetails.totalQuestions} questions. Ready to publish?</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-success btn-lg" onClick={handlePublishTest}>
                    <i className="bi bi-send me-2"></i>
                    Send Test to Students
                  </button>
                  <button className="btn btn-secondary" onClick={cancelTestCreation}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Questions Added List */}
            {questionsList.length > 0 && (
              <div className="card shadow-sm p-4 mt-4">
                <h5 className="mb-3">
                  <i className="bi bi-list-ul me-2"></i>
                  Questions Added ({questionsList.length})
                </h5>
                <div className="added-questions-list">
                  {questionsList.map((q, index) => (
                    <div key={index} className="added-question-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <span className="question-number">Q{index + 1}</span>
                          <span className={`badge bg-${
                            q.difficulty === 'Easy' ? 'success' :
                            q.difficulty === 'Medium' ? 'warning' : 'danger'
                          } ms-2`}>
                            {q.difficulty}
                          </span>
                          <p className="question-text mt-2">{q.question}</p>
                        </div>
                        <i className="bi bi-check-circle-fill text-success fs-4"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Test Modal */}
      {showCreateTestModal && (
        <div className="modal-overlay" onClick={() => setShowCreateTestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-file-earmark-plus me-2"></i>
                Create New Test
              </h5>
              <button className="btn-close" onClick={() => setShowCreateTestModal(false)}></button>
            </div>
            <form onSubmit={handleTestDetailsSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">Test Title *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={testDetails.title}
                    onChange={(e) => setTestDetails({...testDetails, title: e.target.value})}
                    placeholder="e.g., JavaScript Quiz - Week 1"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Description *</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={testDetails.description}
                    onChange={(e) => setTestDetails({...testDetails, description: e.target.value})}
                    placeholder="Brief description of the test"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject *</label>
                  <select
                    className="form-select"
                    value={testDetails.subject}
                    onChange={(e) => setTestDetails({...testDetails, subject: e.target.value})}
                    required
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Total Number of Questions *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="50"
                    value={testDetails.totalQuestions}
                    onChange={(e) => setTestDetails({...testDetails, totalQuestions: parseInt(e.target.value) || 0})}
                    placeholder="Enter number of questions"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Time Limit (Minutes) *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="5"
                    max="180"
                    value={testDetails.timeLimit}
                    onChange={(e) => setTestDetails({...testDetails, timeLimit: parseInt(e.target.value) || 30})}
                    placeholder="e.g., 30"
                    required
                  />
                  <small className="text-muted">Students will have this much time to complete the test</small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateTestModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-arrow-right me-2"></i>
                  Start Adding Questions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer-custom text-center py-3">
        © {new Date().getFullYear()} Teacher Dashboard - AI Student
      </footer>
    </div>
  );
};

export default TeacherDashboard;
