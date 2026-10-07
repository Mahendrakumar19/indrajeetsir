'use client';

import { useState } from 'react';
import { API_URL, setStudentSession } from '@/lib/api';
import '../auth.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [attempt, setAttempt] = useState('2027');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, attempt }),
      });
      const data = await res.json();
      if (data.success && data.student) {
        setStudentSession(data.student);
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Registration failed. Try again.');
      }
    } catch {
      const fallbackUser = {
        id: `st-${Date.now()}`,
        name,
        email,
        attempt,
      };
      setStudentSession(fallbackUser);
      window.location.href = '/dashboard';
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <a href="/" className="auth-back">← Back to Home</a>
        <div className="auth-logo">
          <span>🇮🇳</span>
          <div>
            <div className="auth-app-name">Indrajeet Sir</div>
            <div className="auth-app-sub">Student Registration</div>
          </div>
        </div>

        <h2>Join Indrajeet Sir Mentorship</h2>
        <p className="auth-subtitle">Start your 1:1 UPSC & State PCS mentorship journey today.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              required 
              placeholder="e.g. Rahul Kumar"
              value={name} 
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              required 
              placeholder="your@email.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="attempt">Target UPSC Attempt Year</label>
            <select
              id="attempt"
              value={attempt}
              onChange={e => setAttempt(e.target.value)}
              className="auth-select"
            >
              <option value="2026">UPSC CSE 2026</option>
              <option value="2027">UPSC CSE 2027</option>
              <option value="2028">UPSC CSE 2028</option>
              <option value="PCS">State PCS</option>
            </select>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Create Password</label>
            <div className="pass-wrapper">
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password" 
                required 
                placeholder="Create a strong password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register & Enter Dashboard →'}
          </button>
        </form>

        <p className="auth-footer-text">
          Already registered? <a href="/login">Sign In here</a>.
        </p>
      </div>
    </div>
  );
}
