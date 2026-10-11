'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="nav-brand" onClick={closeMenu}>
          <Image
            src="/logo.png"
            alt="Indrajeet Sir"
            width={38}
            height={38}
            className="nav-brand-logo"
            priority
          />
          <div className="nav-title">Indrajeet Sir</div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links">
          <a href="#top">Home</a>
          <a href="#about">About</a>
          <a href="#courses">Courses</a>
          <a href="#faqs">FAQs</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Navigation Actions */}
        <div className="nav-actions">
          <Link href="/login" className="btn-nav-login">
            Student Login
          </Link>
          <a href="#courses" className="btn-primary btn-nav-enroll btn-nav-enroll-desktop">
            Enroll Now
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-links">
            <a href="#top" onClick={closeMenu}>Home</a>
            <a href="#about" onClick={closeMenu}>About Mentorship</a>
            <a href="#courses" onClick={closeMenu}>Courses & Fees</a>
            <a href="#faqs" onClick={closeMenu}>FAQs</a>
            <a href="#contact" onClick={closeMenu}>Contact Desk</a>
          </nav>
          <div className="mobile-nav-divider" />
          <div className="mobile-nav-actions">
            <Link href="/login" className="btn-mobile-login" onClick={closeMenu}>
              Student Portal Login
            </Link>
            <a href="#courses" className="btn-primary full" onClick={closeMenu}>
              Enroll Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
