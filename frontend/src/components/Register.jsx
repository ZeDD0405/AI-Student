import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const Register = () => {
    const [rollNo, setRollNo] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

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
                confirmPassword
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
        <div 
            className="d-flex justify-content-center align-items-center text-center vh-100" 
            style={{
                background: "linear-gradient(135deg, #00d5ff, #0095ff, rgba(93,0,255,.555))",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            <div 
                className="p-5 rounded shadow-lg" 
                style={{ 
                    width: '400px', 
                    background: "rgba(255,255,255,0.95)", 
                    transition: "transform 0.3s, box-shadow 0.3s" 
                }}
            >
                <h2 className='mb-4 text-primary fw-bold'>Register</h2>

                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label fw-semibold">Roll No</label>
                        <input
                            type="text"
                            placeholder="Enter Roll No"
                            className="form-control shadow-sm"
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label fw-semibold">Name</label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control shadow-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label fw-semibold">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control shadow-sm"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 text-start">
                        <label className="form-label fw-semibold">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            className="form-control shadow-sm"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 fw-bold"
                        disabled={loading}
                        style={{ transition: "all 0.3s" }}
                        onMouseOver={e => {
                            e.target.style.transform = "scale(1.05)";
                            e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.3)";
                        }}
                        onMouseOut={e => {
                            e.target.style.transform = "scale(1)";
                            e.target.style.boxShadow = "none";
                        }}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className='my-3'>Already have an account?</p>
                <Link 
                    to='/login' 
                    className="btn btn-outline-secondary w-100 fw-semibold"
                    style={{ transition: "all 0.3s" }}
                    onMouseOver={e => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={e => e.target.style.transform = "scale(1)"}
                >
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Register;
