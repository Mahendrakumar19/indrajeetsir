'use client';

import { useState, useEffect } from 'react';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);

    // Add temporary smooth transition class to root
    document.documentElement.classList.add('theme-transitioning');

    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 400);
  };

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          display: 'inline-flex',
        }}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label="Toggle theme"
      style={{
        width: '38px',
        height: '38px',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDarkMode ? '#111827' : '#f1f5f9',
        border: isDarkMode ? '1px solid #1f2937' : '1px solid #e2e8f0',
        color: isDarkMode ? '#fbbf24' : '#475569',
        cursor: 'pointer',
        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08) rotate(12deg)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
    >
      <i
        className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}
        style={{
          fontSize: '0.95rem',
          transition: 'transform 0.35s ease, opacity 0.2s ease',
          transform: isDarkMode ? 'rotate(0deg)' : 'rotate(0deg)',
        }}
        aria-hidden="true"
      />
    </button>
  );
}
