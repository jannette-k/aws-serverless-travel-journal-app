// src/pages/LoginPage.js
import React, { useState } from "react";
import { signUpUser, signInUser, confirmSignUp } from "../auth";

const LoginPage = ({ onLogin }) => {
  const [mode, setMode] = useState("signin"); // "signin" | "signup" | "confirm"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInUser(email, password);
      onLogin(); // tell App.js login succeeded
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signUpUser(email, password);
      setMode("confirm"); // show confirmation code input
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await confirmSignUp(email, code);
      setMode("signin"); // confirmed — now sign in
      setError(""); 
    } catch (err) {
      setError(err.message || "Confirmation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>✈️ Travel Journal</h1>
          <p>Capture your adventures around the world</p>
        </div>

        {/* ── SIGN IN ── */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <div className="form-footer">
              <button
                type="button"
                className="btn-link"
                onClick={() => { setMode("signup"); setError(""); }}
              >
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        )}

        {/* ── SIGN UP ── */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 number, 1 uppercase"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
            <div className="form-footer">
              <button
                type="button"
                className="btn-link"
                onClick={() => { setMode("signin"); setError(""); }}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        )}

        {/* ── CONFIRM CODE ── */}
        {mode === "confirm" && (
          <form onSubmit={handleConfirm} className="login-form">
            <div className="login-header">
              <p>Check your email <strong>{email}</strong> for a 6-digit verification code</p>
            </div>
            <div className="form-group">
              <label htmlFor="code">Verification Code</label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Verifying..." : "Confirm Account"}
            </button>
            <div className="form-footer">
              <button
                type="button"
                className="btn-link"
                onClick={() => { setMode("signin"); setError(""); }}
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginPage;