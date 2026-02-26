import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Register.css';

const Register = () => {
    const [rollNo, setRollNo] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [branch, setBranch] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const branches = [
        "Computer Engineering",
        "IT",
        "EXTC",
        "Electrical",
        "Mechanical"
    ];

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', {
                rollNo,
                name,
                password,
                confirmPassword,
                branch
            });

            if (response.data.message === "Registration successful") {
                setSuccess("Registered successfully! Redirecting to login...");
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Something went wrong. Try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-card">
                <div className="register-header">
                    <div className="register-logo">
                        <i className="bi bi-person-plus-fill"></i>
                    </div>
                    <h1 className="register-title">Create Account</h1>
                    <p className="register-subtitle">Join AI-Student to start your learning journey</p>
                </div>

                {error && (
                    <div className="register-alert register-alert-error">
                        <i className="bi bi-exclamation-circle-fill"></i>
                        {error}
                    </div>
                )}
                {success && (
                    <div className="register-alert register-alert-success">
                        <i className="bi bi-check-circle-fill"></i>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label className="form-label">
                            <i className="bi bi-card-text"></i>
                            Roll Number
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your roll number"
                            className="form-control"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <i className="bi bi-person-fill"></i>
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="form-control"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <i className="bi bi-building"></i>
                            Branch
                        </label>
                        <select
                            className="form-select"
                            value={branch}
                            onChange={(e) => setBranch(e.target.value)}
                            required
                        >
                            <option value="">Select your branch</option>
                            {branches.map((branchName) => (
                                <option key={branchName} value={branchName}>
                                    {branchName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <i className="bi bi-lock-fill"></i>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            <i className="bi bi-shield-lock-fill"></i>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-submit-btn"
                        disabled={loading}
                    >
                        {loading && <span className="spinner"></span>}
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="register-divider">
                    <span>Already have an account?</span>
                </div>

                <div className="register-footer">
                    <Link to='/login' className="register-login-btn">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
