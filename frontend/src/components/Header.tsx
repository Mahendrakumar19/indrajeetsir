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
            <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginRight: '0.4rem', fontSize: '0.9rem' }} aria-hidden="true" />
            <span>Student Login</span>
          </Link>
          <a href="#courses" className="btn-primary btn-nav-enroll btn-nav-enroll-desktop">
            <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.45rem', fontSize: '0.95rem' }} aria-hidden="true" />
            <span>Enroll Now</span>
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
              <i className="fa-solid fa-xmark" style={{ fontSize: '1.25rem' }} aria-hidden="true" />
            ) : (
              <i className="fa-solid fa-bars" style={{ fontSize: '1.2rem' }} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <nav className="mobile-nav-links">
            <a href="#top" onClick={closeMenu}>
              <i className="fa-solid fa-house" style={{ width: '20px', marginRight: '0.5rem', color: '#2563eb' }} aria-hidden="true" />
              Home
            </a>
            <a href="#about" onClick={closeMenu}>
              <i className="fa-solid fa-compass" style={{ width: '20px', marginRight: '0.5rem', color: '#2563eb' }} aria-hidden="true" />
              About Mentorship
            </a>
            <a href="#architecture" onClick={closeMenu}>
              <i className="fa-solid fa-sitemap" style={{ width: '20px', marginRight: '0.5rem', color: '#2563eb' }} aria-hidden="true" />
              Mentorship Architecture
            </a>
            <a href="#courses" onClick={closeMenu}>
              <i className="fa-solid fa-book-open" style={{ width: '20px', marginRight: '0.5rem', color: '#2563eb' }} aria-hidden="true" />
              Courses & Fees
            </a>
            <a href="#faqs" onClick={closeMenu}>
              <i className="fa-solid fa-circle-question" style={{ width: '20px', marginRight: '0.5rem', color: '#2563eb' }} aria-hidden="true" />
              FAQs
            </a>
            <a href="#contact" onClick={closeMenu}>
              <i className="fa-solid fa-headset" style={{ width: '20px', marginRight: '0.5rem', color: '#2563eb' }} aria-hidden="true" />
              Contact Desk
            </a>
          </nav>
          <div className="mobile-nav-divider" />
          <div className="mobile-nav-actions">
            <Link href="/login" className="btn-mobile-login" onClick={closeMenu}>
              <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginRight: '0.45rem' }} aria-hidden="true" />
              Student Portal Login
            </Link>
            <a href="#courses" className="btn-primary full" onClick={closeMenu}>
              <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.45rem' }} aria-hidden="true" />
              Enroll Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
