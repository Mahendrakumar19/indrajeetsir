'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="nav-brand">
          <Image
            src="/logo.png"
            alt="Indrajeet Sir"
            width={40}
            height={40}
            className="nav-brand-logo"
            priority
          />
          <div className="nav-title">Indrajeet Sir</div>
        </Link>
        <nav className="nav-links">
          <a href="#top">Home</a>
          <a href="#about">About</a>
          <a href="#courses">Courses</a>
          <a href="#faqs">FAQs</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/login" style={{
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#1e293b',
            textDecoration: 'none',
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            transition: 'all 0.2s'
          }}>
            Student Login
          </Link>
          <a href="#courses" className="btn-primary">Enroll Now</a>
        </div>
      </div>
    </header>
  );
}
