// import React from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "./TestResultPage.css";


// const TestResultPage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { result, testTitle, tabSwitchCount } = location.state || {};
// const violations = location.state?.violations || {};
//   if (!result) {
//     return (
//       <div className="result-page-container">
//         <div className="text-center">
//           <h3>No result data found</h3>
//           <button className="btn btn-primary mt-3" onClick={() => navigate("/start-test")}>
//             Go to Tests
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const percentage = result.score;
//   const isPassed = percentage >= 50;

//   return (
//     <div className="result-page-container">
//       <div className="container py-5">
//         <div className="row justify-content-center">
//           <div className="col-lg-8">
//             {/* Result Card */}
//             <div className="result-card">
//               {/* Header */}
//               <div className={`result-header ${isPassed ? 'passed' : 'failed'}`}>
//                 <div className="result-icon">
//                   {isPassed ? (
//                     <i className="bi bi-check-circle-fill"></i>
//                   ) : (
//                     <i className="bi bi-x-circle-fill"></i>
//                   )}
//                 </div>
//                 <h2>{isPassed ? 'Congratulations!' : 'Test Completed'}</h2>
//                 <p className="mb-0">{testTitle}</p>
//               </div>

//               {/* Score Display */}
//               <div className="score-display">
//                 <div className="score-circle">
//                   <svg viewBox="0 0 100 100">
//                     <circle
//                       cx="50"
//                       cy="50"
//                       r="45"
//                       fill="none"
//                       stroke="#e0e0e0"
//                       strokeWidth="8"
//                     />
//                     <circle
//                       cx="50"
//                       cy="50"
//                       r="45"
//                       fill="none"
//                       stroke={isPassed ? '#28a745' : '#dc3545'}
//                       strokeWidth="8"
//                       strokeDasharray={`${2 * Math.PI * 45}`}
//                       strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
//                       transform="rotate(-90 50 50)"
//                     />
//                   </svg>
//                   <div className="score-text">
//                     <span className="score-number">{percentage}%</span>
//                     <span className="score-label">Score</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Stats Grid */}
//               <div className="stats-grid">
//                 <div className="stat-item">
//                   <div className="stat-icon correct">
//                     <i className="bi bi-check-circle"></i>
//                   </div>
//                   <div className="stat-info">
//                     <div className="stat-value">{result.correctAnswers}</div>
//                     <div className="stat-label">Correct</div>
//                   </div>
//                 </div>

//                 <div className="stat-item">
//                   <div className="stat-icon incorrect">
//                     <i className="bi bi-x-circle"></i>
//                   </div>
//                   <div className="stat-info">
//                     <div className="stat-value">
//                       {result.totalQuestions - result.correctAnswers}
//                     </div>
//                     <div className="stat-label">Incorrect</div>
//                   </div>
//                 </div>

//                 <div className="stat-item">
//                   <div className="stat-icon total">
//                     <i className="bi bi-list-check"></i>
//                   </div>
//                   <div className="stat-info">
//                     <div className="stat-value">{result.totalQuestions}</div>
//                     <div className="stat-label">Total Questions</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Tab Switch Warning */}
//               {tabSwitchCount > 0 && (
//                 <div className="alert alert-warning mt-4" role="alert">
//                   <i className="bi bi-exclamation-triangle-fill me-2"></i>
//                   <strong>Note:</strong> You switched tabs {tabSwitchCount} time(s) during the test.
//                   This has been recorded and reported to your teacher.
//                 </div>
//               )}

//               {/* Performance Message */}
//               <div className="performance-message">
//                 {percentage >= 90 ? (
//                   <>
//                     <h5 className="text-success">Outstanding Performance! 🎉</h5>
//                     <p>You've demonstrated excellent understanding of the subject.</p>
//                   </>
//                 ) : percentage >= 70 ? (
//                   <>
//                     <h5 className="text-success">Great Job! 👏</h5>
//                     <p>You've shown good grasp of the concepts.</p>
//                   </>
//                 ) : percentage >= 50 ? (
//                   <>
//                     <h5 className="text-primary">Good Effort! 👍</h5>
//                     <p>You passed! Keep practicing to improve further.</p>
//                   </>
//                 ) : (
//                   <>
//                     <h5 className="text-danger">Keep Trying! 💪</h5>
//                     <p>Don't give up! Review the material and try again.</p>
//                   </>
//                 )}
//               </div>

//               {/* Action Buttons */}
//               <div className="result-actions">
//                 <button
//                   className="btn btn-primary"
//                   onClick={() => navigate("/start-test")}
//                 >
//                   <i className="bi bi-house-door me-2"></i>
//                   Back to Tests
//                 </button>
//                 <button
//                   className="btn btn-outline-primary"
//                   onClick={() => navigate("/home")}
//                 >
//                   <i className="bi bi-speedometer2 me-2"></i>
//                   Dashboard
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TestResultPage;

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./TestResultPage.css";

const TestResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { result, testTitle, tabSwitchCount, violations } =
    location.state || {};

  const proctorData = violations || {
    NO_FACE: 0,
    MULTIPLE_FACE: 0,
    VOICE_DETECTED: 0,
    TAB_SWITCH: 0
  };

  if (!result) {
    return (
      <div className="result-page-container">
        <div className="text-center">
          <h3>No result data found</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/start-test")}
          >
            Go to Tests
          </button>
        </div>
      </div>
    );
  }

  const percentage = result.score;
  const isPassed = percentage >= 50;

  return (
    <div className="result-page-container">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            <div className="result-card">

              {/* Header */}
              <div className={`result-header ${isPassed ? "passed" : "failed"}`}>
                <div className="result-icon">
                  {isPassed ? (
                    <i className="bi bi-check-circle-fill"></i>
                  ) : (
                    <i className="bi bi-x-circle-fill"></i>
                  )}
                </div>
                <h2>{isPassed ? "Congratulations!" : "Test Completed"}</h2>
                <p className="mb-0">{testTitle}</p>
              </div>

              {/* Score */}
              <div className="score-display">
                <div className="score-circle">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="8" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={isPassed ? "#28a745" : "#dc3545"}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="score-text">
                    <span className="score-number">{percentage}%</span>
                    <span className="score-label">Score</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-icon correct">
                    <i className="bi bi-check-circle"></i>
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{result.correctAnswers}</div>
                    <div className="stat-label">Correct</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon incorrect">
                    <i className="bi bi-x-circle"></i>
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">
                      {result.totalQuestions - result.correctAnswers}
                    </div>
                    <div className="stat-label">Incorrect</div>
                  </div>
                </div>

                <div className="stat-item">
                  <div className="stat-icon total">
                    <i className="bi bi-list-check"></i>
                  </div>
                  <div className="stat-info">
                    <div className="stat-value">{result.totalQuestions}</div>
                    <div className="stat-label">Total Questions</div>
                  </div>
                </div>
              </div>

              {/* Tab Switch Alert */}
              {tabSwitchCount > 0 && (
                <div className="alert alert-warning mt-4">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  You switched tabs {tabSwitchCount} time(s).
                </div>
              )}

              {/* ⭐ PROCTORING REPORT ⭐ */}
              <div className="card mt-4">
                <div className="card-body">
                  <h5 className="text-danger">
                    <i className="bi bi-shield-exclamation me-2"></i>
                    Proctoring Report
                  </h5>

                  <ul className="list-group">
                    <li className="list-group-item">
                      No Face Detected: {proctorData.NO_FACE}
                    </li>

                    <li className="list-group-item">
                      Multiple Faces: {proctorData.MULTIPLE_FACE}
                    </li>

                    <li className="list-group-item">
                      Voice Detected: {proctorData.VOICE_DETECTED}
                    </li>

                    {/* <li className="list-group-item">
                      Tab Switches: {proctorData.TAB_SWITCH}
                    </li> */}
                  </ul>
                </div>
              </div>

              {/* Message */}
              <div className="performance-message mt-4">
                {percentage >= 90 ? (
                  <h5 className="text-success">Outstanding Performance 🎉</h5>
                ) : percentage >= 70 ? (
                  <h5 className="text-success">Great Job 👏</h5>
                ) : percentage >= 50 ? (
                  <h5 className="text-primary">Good Effort 👍</h5>
                ) : (
                  <h5 className="text-danger">Keep Trying 💪</h5>
                )}
              </div>

              {/* Buttons */}
              <div className="result-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/start-test")}
                >
                  Back to Tests
                </button>

                <button
                  className="btn btn-outline-primary"
                  onClick={() => navigate("/home")}
                >
                  Dashboard
                </button>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
