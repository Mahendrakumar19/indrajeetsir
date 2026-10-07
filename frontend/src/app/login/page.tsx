'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL, setStudentSession, getStudentSession } from '@/lib/api';
import '../auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const existing = getStudentSession();
    if (existing) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success && data.student) {
        setStudentSession(data.student);
        router.push('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch {
      // Offline / demo fallback
      const fallbackUser = {
        id: `st-${Date.now()}`,
        name: email.split('@')[0] || 'Student',
        email,
        attempt: '2027',
      };
      setStudentSession(fallbackUser);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-back">← Back to Home</Link>
        <div className="auth-logo">
          <span>🇮🇳</span>
          <div>
            <div className="auth-app-name">Indrajeet Sir</div>
            <div className="auth-app-sub">Student Portal</div>
          </div>
        </div>

        <h2>Sign In to Your Dashboard</h2>
        <p className="auth-subtitle">Access your scheduled live classes and chat with your mentor.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="pass-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-footer-text">
          New student? <Link href="/register">Register your account</Link> or <Link href="/#contact">Book a call</Link>.
        </p>
      </div>
    </div>
  );
}
