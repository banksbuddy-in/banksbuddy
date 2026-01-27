import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import "./logup.css"

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
            setError('Failed to log in: ' + err.message);
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
            setError('Failed to sign in with Google: ' + err.message);
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
                    <img src="/log.avif" alt="Login Visual" />
                    <div className="image-overlay">
                        <h3>BanksBuddy</h3>
                        <p>Your trusted partner for financial improvement.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
