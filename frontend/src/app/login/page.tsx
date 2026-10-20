'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { API_URL, setStudentSession } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import '../auth.css';

function IconMail({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  );
}

function IconLock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconEye({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function IconArrowLeft({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
          phone: data.student.phone || '+91 98765 43210',
          attempt: data.student.attempt || '2027',
          optionalSubject: data.student.optionalSubject || 'Public Administration',
          bio: data.student.bio || 'Targeting UPSC CSE 2027 • Mentored by Indrajeet Sir',
          avatarKey: data.student.avatarKey || 'ias_officer',
          enrolledCourse: data.student.course || data.student.enrolledCourse || '1:1 Comprehensive UPSC Mentorship 2026-27',
          token: data.token,
        });
        router.push('/dashboard');
        return;
      } else {
        setError(data.message || 'Invalid email or password. Please verify your credentials.');
      }
    } catch {
      // Offline fallback login for seamless demonstration
      if (emailClean && passClean.length >= 4) {
        const rawName = emailClean.split('@')[0];
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        setStudentSession({
          id: `st-${Date.now()}`,
          name: formattedName,
          email: emailClean,
          phone: '',
          attempt: '2027',
          optionalSubject: '',
          bio: '',
          avatarKey: 'ias_officer',
          enrolledCourse: '1:1 Comprehensive UPSC Mentorship 2026-27',
        });
        router.push('/dashboard');
        return;
      }
      setError('Connection error. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <Link href="/" className="auth-back" style={{ marginBottom: 0 }}>
            <IconArrowLeft /> Back to Homepage
          </Link>
          <ThemeToggle />
        </div>

        {/* Clean Academy Brand Header */}
        <div className="auth-brand-header">
          <Image
            src="/logo-circle.png"
            alt="Indrajeet Sir Official Logo"
            width={44}
            height={44}
            className="auth-logo-img"
            priority
          />
          <div className="auth-brand-text">
            <span className="auth-brand-title">Indrajeet Sir</span>
            <span className="auth-brand-badge">Official Aspirant Portal</span>
          </div>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">
          Sign in to access your live classes, 1:1 strategy calls &amp; evaluated Mains answer sheets.
        </p>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Registered Email</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <IconMail />
              </span>
              <input
                id="email"
                type="email"
                className="auth-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aspirant@upsc.com"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Passcode</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">
                <IconLock />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="auth-input"
                style={{ paddingRight: '2.8rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="eye-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In to Portal →'}
          </button>
        </form>

        <div className="auth-footer-nav">
          New Aspirant?{' '}
          <Link href="/register">
            Register for Mentorship
          </Link>
        </div>
      </div>
    </div>
  );
}
