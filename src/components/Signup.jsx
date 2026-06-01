import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import "./logup.css";

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

export const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup, googleSignIn } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        // if (password !== passwordConfirm) {
        //     return setError('Passwords do not match');
        // }

        try {
            setError('');
            setLoading(true);
            await signup(email, password, name);
            navigate('/cibil');
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
                    <h2>Create Account</h2>
                    <p className="auth-subtitle">Join us to start your journey.</p>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="john@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="Create a password..."
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button disabled={loading} type="submit" className="auth-btn">
                            Sign Up
                        </button>
                        <button type="button" onClick={handleGoogleSignIn} className="google-btn" disabled={loading}>
                            <FcGoogle size={24} /> Continue with Google
                        </button>
                    </form>

                    <div className="auth-footer">
                        Already have an account? <Link to="/login">Sign in</Link>
                    </div>
                </div>

                <div className="auth-image-section">
                    <img src="/log.avif" alt="Signup Visual" width={600} height={600} loading="lazy" />
                    <div className="image-overlay">
                        <h3>Join Today</h3>
                        <p>Unlock exclusive financial tools and services.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
