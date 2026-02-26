import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./TeacherDashboard.css";
import Toast from "./Toast";
import ConfirmModal from "./ConfirmModal";

const TeacherDashboard = () => {
  const [teacherName, setTeacherName] = useState("");
  const [tests, setTests] = useState([]);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [creatingTest, setCreatingTest] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentQuestions, setStudentQuestions] = useState([]);


  // Toast and Modal states
  const [toast, setToast] = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);

  // Test creation state
  const [testDetails, setTestDetails] = useState({
    title: "",
    description: "",
    subject: "",
    totalQuestions: 1,
    timeLimit: 30,
    branches: []
  });

  const [currentTest, setCurrentTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionsList, setQuestionsList] = useState([]);
  const [questionImage, setQuestionImage] = useState(null);

  // Question form state
  const [questionForm, setQuestionForm] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0
  });

  const navigate = useNavigate();

  const subjects = [
    "JavaScript Fundamentals",
    "React Basics",
    "Data Structures",
    "Algorithms",
    "Behavioral Test"
  ];

  const branches = [
    "Computer Engineering",
    "IT",
    "EXTC",
    "Electrical",
    "Mechanical"
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

  useEffect(() => {
  fetchStudentQuestions();
}, []);

const fetchStudentQuestions = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/question/all");
    if (res.data.success) {
      setStudentQuestions(res.data.questions);
    }
  } catch (err) {
    console.error("Error fetching student questions", err);
  }
};


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

    // if (!testDetails.title || !testDetails.subject || !testDetails.branch || testDetails.totalQuestions < 1 || testDetails.timeLimit < 1) {
    //   setToast({ message: "Please fill in all required fields. Total questions and time limit must be at least 1.", type: "error" });
    //   return;
    // }
    if (!testDetails.title ||!testDetails.subject ||testDetails.branches.length === 0 ||testDetails.totalQuestions < 1 ||testDetails.timeLimit < 1) {
  setToast({
    message: "Please fill all fields and select at least one branch",
    type: "error"
  });
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
      setToast({ message: "Please enter the question", type: "warning" });
      return;
    }

    if (questionForm.options.some(opt => !opt.trim())) {
      setToast({ message: "Please fill in all 4 options", type: "warning" });
      return;
    }

    // Add question to list
    // const newQuestion = {
    //   question: questionForm.question,
    //   options: questionForm.options,
    //   correctAnswer: questionForm.correctAnswer
    // };
const newQuestion = {
  questionText: questionForm.question,
  options: questionForm.options,
  correctAnswer: questionForm.correctAnswer,
  image: questionImage
};

setQuestionImage(null);

    const updatedList = [...questionsList, newQuestion];
    setQuestionsList(updatedList);

    // Reset form
    setQuestionForm({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
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

  // const handlePublishTest = async () => {
  //   if (!currentTest) return;

  //   try {
  //     const testData = {
  //       ...currentTest,
  //       questions: questionsList
  //     };
  //     console.log("Publishing test with data:", testData);

  //     const response = await axios.post("http://localhost:5000/api/test/create", testData);

  //     if (response.data.success) {
  //       const testId = response.data.test._id;

  //       // Publish the test
  //       const publishResponse = await axibranch: "os.put(`http://localhost:5000/api/test/publish/${testId}`);

  //       if (publishResponse.data.success) {
  //         setToast({ message: "Test published successfully to students!", type: "success" });

  //         // Reset everything
  //         setCreatingTest(false);
  //         setCurrentTest(null);
  //         setQuestionsList([]);
  //         setCurrentQuestionIndex(0);
  //         setTestDetails({
  //           title: "",
  //           description: "",
  //           subject: "",
  //           totalQuestions: 1,
  //           timeLimit: 30,
  //           branch: ""
  //         });

  //         // Refresh tests list
  //         fetchTests();
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error publishing test:", error);
  //     console.error("Error response:", error.response?.data);
  //     const errorMessage = error.response?.data?.error || "Failed to publish test. Please try again.";
  //     setToast({ message: errorMessage, type: "error" });
  //   }
  // };
const handlePublishTest = async () => {
  try {
    const formData = new FormData();

    // Test details
    formData.append("title", testDetails.title);
    formData.append("description", testDetails.description);
    formData.append("subject", testDetails.subject);
    formData.append("totalQuestions", testDetails.totalQuestions);
    formData.append("timeLimit", testDetails.timeLimit);
    // formData.append("branch", testDetails.branch);
    formData.append("branches", JSON.stringify(testDetails.branches));


    // Questions without images
    const questionsForBackend = questionsList.map((q) => ({
      questionText: q.questionText,
      options: q.options,
      correctAnswer: q.correctAnswer
    }));

    formData.append("questions", JSON.stringify(questionsForBackend));

    // Images (order matters)
    questionsList.forEach((q) => {
      if (q.image) {
        formData.append("images", q.image);
      }
    });

    const response = await axios.post(
      "http://localhost:5000/api/test/create",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (response.data.success) {
      const testId = response.data.test._id;

      await axios.put(`http://localhost:5000/api/test/publish/${testId}`);

      setToast({ message: "Test published successfully!", type: "success" });

      // Reset
      setCreatingTest(false);
      setQuestionsList([]);
      setCurrentQuestionIndex(0);
      setCurrentTest(null);

      setTestDetails({
        title: "",
        description: "",
        subject: "",
        totalQuestions: 1,
        timeLimit: 10,
        branches: []

      });

      fetchTests();
    }
  } catch (error) {
    console.error("Publish error:", error);
    setToast({ message: "Failed to publish test", type: "error" });
  }
};

  const handleDeleteTest = (id) => {
    setConfirmModal({
      message: "Are you sure you want to delete this test? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await axios.delete(`http://localhost:5000/api/test/${id}`);
          if (response.data.success) {
            setToast({ message: "Test deleted successfully!", type: "success" });
            fetchTests();
          }
        } catch (error) {
          console.error("Error deleting test:", error);
          setToast({ message: "Failed to delete test", type: "error" });
        }
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null),
      type: "danger",
      confirmText: "Delete"
    });
  };

  const cancelTestCreation = () => {
    setConfirmModal({
      message: "Are you sure you want to cancel? All progress will be lost.",
      onConfirm: () => {
        setCreatingTest(false);
        setCurrentTest(null);
        setQuestionsList([]);
        setCurrentQuestionIndex(0);
        setTestDetails({
          title: "",
          description: "",
          subject: "",
          totalQuestions: 1,
          timeLimit: 30,
          branches: []

        });
        setQuestionForm({
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0
        });
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null),
      type: "warning",
      confirmText: "Yes, Cancel"
    });
  };

  // Check if all questions are added
  const allQuestionsAdded = questionsList.length === testDetails.totalQuestions && testDetails.totalQuestions > 0;
  const filteredTests = tests.filter((test) =>
  test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  test.subject.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="teacher-dashboard-wrapper">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom px-4">
        <h3 className="navbar-brand fw-bold mb-0">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Teacher Dashboard
        </h3>
        <div className="ms-auto d-flex align-items-center gap-3">
          <button
            onClick={() => navigate("/students-list")}
            className="btn btn-light btn-sm fw-semibold"
          >
            <i className="bi bi-people me-1"></i> View Students
          </button>
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
                  className="btn btn-primary btn-lg"
                  onClick={() => setShowCreateTestModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Test
                </button>
              </div>
            </div>

            {/* Existing Tests List */}
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm p-4">
                  <div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search by title or subject..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>

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
                      {filteredTests.map((test) => (
                        <div key={test._id} className="test-item">
                          <div className="test-header">
                            <div>
                              <h5 className="mb-1">{test.title}</h5>
                              <p className="text-muted mb-0">{test.description}</p>
                            </div>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => navigate(`/test-results/${test._id}`)}
                              >
                                <i className="bi bi-bar-chart-fill me-1"></i>
                                View Results
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteTest(test._id)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                          <div className="test-meta">
                            <span className="badge bg-info">{test.subject}</span>
<span className="badge bg-dark">
  <i className="bi bi-building me-1"></i>
  {Array.isArray(test.branches)
    ? test.branches.join(", ")
    : test.branch}
</span>

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
        {/* Student Submitted Questions */}
<div className="row mt-4">
  <div className="col-12">
    <div className="card shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">
          <i className="bi bi-question-circle me-2"></i>
          Student Submitted Questions
          <span className="badge bg-success ms-2">
            {studentQuestions.length}
          </span>
        </h4>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/branch-selection?mode=view")}
        >
          <i className="bi bi-folder-open me-2"></i>
          Browse by Branch & Company
        </button>
      </div>

      {studentQuestions.length === 0 ? (
        <p className="text-muted text-center">
          No student questions yet.
        </p>
      ) : (
        // studentQuestions.map((q, i) => (
        //   <div key={q._id} className="border rounded p-3 mb-3">
        //     <h6>Q{i + 1}: {q.questionText}</h6>

        //     {q.image && (
        //       <img
        //         src={`http://localhost:5000/uploads/questions/${q.image}`}
        //         style={{ maxWidth: "200px", borderRadius: "8px" }}
        //         alt="question"
        //       />
        //     )}

        //     <ul className="mt-2">
        //       {q.options.map((opt, idx) => (
        //         <li
        //           key={idx}
        //           style={{
        //             fontWeight: idx === q.correctAnswer ? "bold" : "normal",
        //             color: idx === q.correctAnswer ? "green" : "black"
        //           }}
        //         >
        //           {opt}
        //         </li>
        //       ))}
        //     </ul>
        //   </div>
        // ))
//         studentQuestions.map((q, i) => (
//   <div key={q._id} className="border rounded p-3 mb-3">
//     <h6>Q{i + 1}: {q.questionText}</h6>

//     <p className="text-muted">
//       Company: {q.company || "N/A"} <br/>
//       Year: {q.year || "N/A"} <br/>
//       Position: {q.position || "N/A"}
//     </p>
//   </div>
// ))
studentQuestions.map((q, i) => (
  <div key={q._id} className="border rounded p-3 mb-3">
    <h6>Q{i + 1}: {q.questionText}</h6>

    <p className="text-muted">
      Company: {q.company}<br/>
      Year: {q.year}<br/>
      Position: {q.position}
    </p>
  </div>
))
      )}
    </div>
  </div>
</div>


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
                      <label className="form-label fw-semibold">Question *</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={questionForm.question}
                        onChange={(e) => setQuestionForm({...questionForm, question: e.target.value})}
                        placeholder="Enter the question..."
                        required
                      />
                      <label className="form-label fw-semibold mt-3">
  Upload Question Image (Optional)
</label>

<input
  type="file"
  accept="image/*"
  className="form-control"
  onChange={(e) => setQuestionImage(e.target.files[0])}
/>

{questionImage && (
  <img
    src={URL.createObjectURL(questionImage)}
    alt="Question Preview"
    style={{
      maxWidth: "100%",
      marginTop: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc"
    }}
  />
)}

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
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={testDetails.description}
                    onChange={(e) => setTestDetails({...testDetails, description: e.target.value})}
                    placeholder="Brief description of the test (optional)"
                  />
                  <small className="text-muted">Optional - Add a description to help students understand the test</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={testDetails.subject}
                    onChange={(e) => setTestDetails({...testDetails, subject: e.target.value})}
                    placeholder="e.g., JavaScript, React, Data Structures, etc."
                    required
                  />
                  <small className="text-muted">Enter the subject or topic name</small>
                </div>
                <div className="mb-3">
                  {/* <label className="form-label fw-semibold">Branch *</label>
                  <select
                    className="form-select"
                    value={testDetails.branch}
                    onChange={(e) => setTestDetails({...testDetails, branch: e.target.value})}
                    required
                  >
                    <option value="">-- Select Branch --</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select> */}
                  <label className="form-label fw-semibold">Branches *</label>
<div className="branch-dropdown">
    <button
      type="button"
      className="form-control text-start"
      onClick={() => setShowBranchDropdown(!showBranchDropdown)}
    >
      {testDetails.branches.length > 0
        ? testDetails.branches.join(", ")
        : "Select Branches"}
    </button>

    {showBranchDropdown && (
      <div className="branch-dropdown-menu">
        {branches.map((branch) => (
          <div key={branch} className="form-check px-3">
            <input
              type="checkbox"
              className="form-check-input"
              checked={testDetails.branches.includes(branch)}
              onChange={(e) => {
                if (e.target.checked) {
                  setTestDetails({
                    ...testDetails,
                    branches: [...testDetails.branches, branch]
                  });
                } else {
                  setTestDetails({
                    ...testDetails,
                    branches: testDetails.branches.filter(b => b !== branch)
                  });
                }
              }}
            />
            <label className="form-check-label">{branch}</label>
          </div>
        ))}
      </div>
    )}
  </div>

  <small className="text-muted">
    You can select multiple branches
  </small>
</div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Total Number of Questions *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={testDetails.totalQuestions}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setTestDetails({...testDetails, totalQuestions: Math.max(1, value)});
                    }}
                    placeholder="Enter number of questions"
                    required
                  />
                  <small className="text-muted">Minimum 1 question required</small>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Time Limit (Minutes) *</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={testDetails.timeLimit}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      setTestDetails({...testDetails, timeLimit: Math.max(1, value)});
                    }}
                    placeholder="Enter time in minutes"
                    required
                  />
                  <small className="text-muted">Minimum 1 minute required</small>
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={confirmModal.onConfirm}
          onCancel={confirmModal.onCancel}
          confirmText={confirmModal.confirmText}
          cancelText={confirmModal.cancelText || "Cancel"}
          type={confirmModal.type}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;
