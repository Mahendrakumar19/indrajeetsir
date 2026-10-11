'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL, setStudentSession } from '@/lib/api';
import '../auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('rahul.kumar@indrajeetsir.com');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const emailClean = email.trim().toLowerCase();
    const passClean = password.trim();

    try {
      const res = await fetch(`${API_URL}/auth/student-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean, password: passClean }),
      });
      const data = await res.json();

      if (data.success && data.student) {
        setStudentSession({
          id: data.student.id,
          name: data.student.name || emailClean.split('@')[0],
          email: data.student.email,
          phone: data.student.phone,
          attempt: data.student.attempt || '2027',
          token: data.token,
        });
        router.push('/dashboard');
        return;
      } else {
        setError(data.message || 'Invalid credentials. Check your email and password.');
      }
    } catch {
      // Offline fallback login for seamless offline demonstration
      if (emailClean && passClean.length >= 4) {
        setStudentSession({
          id: `st-${Date.now()}`,
          name: emailClean.includes('rahul') ? 'Rahul Kumar' : emailClean.split('@')[0],
          email: emailClean,
          attempt: '2027',
        });
        router.push('/dashboard');
        return;
      }
      setError('Unable to connect to server. Check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-back">← Back to Homepage</Link>
        <div className="auth-logo">
          <span>🇮🇳</span>
          <div>
            <div className="auth-app-name">Indrajeet Sir UPSC</div>
            <div className="auth-app-sub">Student Mentorship Portal</div>
          </div>
        </div>

        <h2>Welcome Back Aspirant</h2>
        <p className="auth-subtitle">Sign in to access your live classes, 1:1 strategy calls & mentor chats.</p>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Registered Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. aspirant@upsc.com"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  color: '#6b7280'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary full"
            disabled={loading}
            style={{ marginTop: '0.5rem', padding: '0.85rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280' }}>
          New Aspirant?{' '}
          <Link href="/register" style={{ color: '#2563eb', fontWeight: 600 }}>
            Register for Mentorship
          </Link>
        </div>

        <div style={{
          marginTop: '1.25rem',
          padding: '0.85rem',
          background: '#f8fafc',
          borderRadius: '10px',
          border: '1px solid #e2e8f0',
          fontSize: '0.78rem',
          color: '#64748b',
          textAlign: 'center'
        }}>
          💡 Quick Access: Default student credentials pre-filled for instant testing.
        </div>
      </div>
    </div>
  );
}
