'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../auth.css';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect visitors to the homepage
    const timer = setTimeout(() => {
      router.replace('/');
    }, 4000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
        <h2>Mobile App Exclusive</h2>
        <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: '1.6', margin: '1rem 0 1.5rem' }}>
          Student mentorship classroom & live sessions are exclusively accessible on the official <strong>Indrajeet Sir IAS Mobile Application</strong>.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <a
            href="/indrajeet-sir-app.apk"
            download
            className="btn-primary full"
            style={{ textDecoration: 'none', padding: '0.75rem 1.25rem', borderRadius: '8px', background: '#2563eb', color: '#fff', fontWeight: '700' }}
          >
            📲 Download Android App (.apk)
          </a>
          <Link href="/" className="auth-back" style={{ marginTop: '0.5rem' }}>
            ← Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
