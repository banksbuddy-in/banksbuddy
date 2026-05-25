import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import "./logup.css"

const cleanAuthError = (err) => {
    const msg = err.message || err.toString();
    if (msg.includes("auth/invalid-credential") || msg.includes("auth/wrong-password") || msg.includes("auth/user-not-found")) {
        return "Invalid email or password.";
    }
    if (msg.includes("auth/popup-closed-by-user")) {
        return "Sign-in popup was closed before completing.";
    }
    if (msg.includes("auth/email-already-in-use")) {
        return "This email is already registered.";
    }
    if (msg.includes("auth/weak-password")) {
        return "Password is too weak. It should be at least 6 characters.";
    }
    if (msg.includes("auth/invalid-email")) {
        return "Please enter a valid email address.";
    }
    if (msg.includes("auth/network-request-failed")) {
        return "Network connection failed. Please check your internet.";
    }
    return msg.replace(/Firebase: Error \(auth\//, "").replace(/\)\./, "").replace(/-/g, " ");
};

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, googleSignIn } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/cibil'); // Redirect to home or dashboard
        } catch (err) {
            setError(cleanAuthError(err));
        }

        setLoading(false);
    }

    async function handleGoogleSignIn() {
        try {
            setError('');
            setLoading(true);
            await googleSignIn();
            navigate('/cibil');
        } catch (err) {
            setError(cleanAuthError(err));
        }
        setLoading(false);
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-form-section">
                    <h2>Welcome Back</h2>
                    <p className="auth-subtitle">Please enter your details to sign in.</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="Enter your email..."
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password..."
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button disabled={loading} type="submit" className="auth-btn">
                            Sign In
                        </button>
                        <p className="or">Or</p>
                        <button type="button" onClick={handleGoogleSignIn} className="google-btn" disabled={loading}>
                            <FcGoogle size={24} /> Continue with Google
                        </button>
                    </form>

                    <div className="auth-footer">
                        Don't have an account? <Link to="/signup">Sign up for free</Link>
                    </div>
                </div>

                <div className="auth-image-section">
                    <img src="/log.jpg" alt="Login Visual" />
                    <div className="image-overlay">
                        <h3>BanksBuddy</h3>
                        <p>Your trusted partner for financial improvement.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
