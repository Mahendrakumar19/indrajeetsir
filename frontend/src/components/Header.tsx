'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStudentSession, getAdminSession, StudentUser } from '@/lib/api';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    setStudent(getStudentSession());
    setIsAdmin(getAdminSession());

    // Check if dark mode is active
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    // Listen to storage events so changes in other tabs or actions update the header immediately
    const handleStorageChange = () => {
      setStudent(getStudentSession());
      setIsAdmin(getAdminSession());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

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
          <a href="#download-app">Mobile App</a>
          <a href="#faqs">FAQs</a>
          <a href="#contact">Contact</a>
        </nav>

        {/* Navigation Actions */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button
            type="button"
            className="btn-theme-toggle"
            onClick={toggleTheme}
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <i className="fa-solid fa-sun" style={{ color: '#f59e0b', fontSize: '1rem' }} aria-hidden="true" />
            ) : (
              <i className="fa-solid fa-moon" style={{ color: '#475569', fontSize: '1rem' }} aria-hidden="true" />
            )}
          </button>
          {mounted && student ? (
            <Link href="/dashboard" className="btn-nav-dashboard" title={`Logged in as ${student.name} (${student.email})`}>
              <i className="fa-solid fa-user-graduate" aria-hidden="true" />
              <span>Dashboard ({student.name ? student.name.split(' ')[0] : 'Portal'})</span>
            </Link>
          ) : mounted && isAdmin ? (
            <Link href="/admin" className="btn-nav-dashboard" title="Admin Control Center">
              <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              <span>Admin Panel</span>
            </Link>
          ) : (
            <Link href="/login" className="btn-nav-login">
              <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginRight: '0.4rem', fontSize: '0.9rem' }} aria-hidden="true" />
              <span>Student Login</span>
            </Link>
          )}

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
            <a href="#download-app" onClick={closeMenu}>
              <i className="fa-brands fa-google-play" style={{ width: '20px', marginRight: '0.5rem', color: '#2563eb' }} aria-hidden="true" />
              Download Mobile App
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
            <button
              type="button"
              className="btn-mobile-login"
              style={{ justifyContent: 'center', background: 'transparent', cursor: 'pointer', marginBottom: '0.4rem' }}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <>
                  <i className="fa-solid fa-sun" style={{ color: '#f59e0b', marginRight: '0.5rem' }} aria-hidden="true" />
                  <span>Switch to Light Mode</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-moon" style={{ color: '#475569', marginRight: '0.5rem' }} aria-hidden="true" />
                  <span>Switch to Dark Mode</span>
                </>
              )}
            </button>
            {mounted && student ? (
              <Link href="/dashboard" className="btn-mobile-dashboard" onClick={closeMenu}>
                <i className="fa-solid fa-user-graduate" aria-hidden="true" />
                <span>Go to Dashboard ({student.name ? student.name.split(' ')[0] : 'Portal'})</span>
              </Link>
            ) : mounted && isAdmin ? (
              <Link href="/admin" className="btn-mobile-dashboard" onClick={closeMenu}>
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                <span>Open Admin Panel</span>
              </Link>
            ) : (
              <Link href="/login" className="btn-mobile-login" onClick={closeMenu}>
                <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginRight: '0.45rem' }} aria-hidden="true" />
                <span>Student Portal Login</span>
              </Link>
            )}
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
