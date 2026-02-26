import React from "react";
import "./SuccessModal.css";

const SuccessModal = ({ show, onClose, message, title }) => {
  if (!show) return null;

  return (
    <div className="success-modal-overlay" onClick={onClose}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon-wrapper">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
        </div>

        <h2 className="success-title">{title || "Success!"}</h2>
        <p className="success-message">{message || "Operation completed successfully"}</p>

        <button className="success-btn" onClick={onClose}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
