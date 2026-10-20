'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '@/components/ThemeToggle';
import '../legal.css';

const DEFAULT_DISCLAIMER = {
  headerBadge: 'Transparency',
  headerTitle: 'Disclaimers & Cookie Policy',
  lastUpdated: 'October 2026 • Public Educational Notice',
  callout: 'Important Notice: We are NOT affiliated with, authorized by, sponsored by, or endorsed by the Union Public Service Commission (UPSC), the Government of India, or any State Public Service Commission. The terms "UPSC", "Civil Services Examination (CSE)", "IAS", "IPS", and "State PCS" are used solely in an educational, descriptive context to identify the competitive examinations for which mentorship is provided.',
  section1Title: '1. Educational & Non-Affiliation Disclaimer',
  section1Content: 'Indrajeet Sir UPSC Mentorship is an independent academic mentorship initiative founded by Indrajeet Sir to provide authentic personal answer evaluation, test series feedback, and preparation strategies.',
  section2Title: '2. Examination Success & Results Disclaimer',
  section2Content: 'The Civil Services Examination is one of the most competitive examinations globally. All testimonials and success stories showcased represent genuine past student outcomes. However, final merit ranks depend entirely on individual candidate rigor, exam execution, and official commission evaluations.',
};

export default function DisclaimersPage() {
  const [content, setContent] = useState(DEFAULT_DISCLAIMER);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('indrajeet_disclaimer_content');
      if (saved) {
        setContent((prev) => ({ ...prev, ...JSON.parse(saved) }));
      }
    } catch {
      // ignore parse error
    }
  }, []);

  return (
    <div className="legal-page">
      <nav className="legal-nav-bar">
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="Indrajeet Sir"
            width={38}
            height={38}
            style={{ borderRadius: '50%', objectFit: 'cover' }}
          />
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827' }}>Indrajeet Sir</div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ThemeToggle />
          <Link href="/" className="back-link">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <header className="legal-header">
        <span className="legal-badge">{content.headerBadge}</span>
        <h1>{content.headerTitle}</h1>
        <p className="legal-date">{content.lastUpdated}</p>
      </header>

      <main className="legal-container">
        <h2>{content.section1Title}</h2>
        <p>{content.section1Content}</p>

        <div className="legal-callout">
          <strong>Important Notice:</strong> {content.callout}
        </div>

        <h2>{content.section2Title}</h2>
        <p>{content.section2Content}</p>

        <div className="legal-contact-card">
          <h3>Academic Administration & Inquiry Desk</h3>
          <p>For questions or educational clarifications:</p>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.75rem' }}>
            <li><strong>Desk:</strong> Indrajeet Sir Mentorship Desk</li>
            <li><strong>Email:</strong> <a href="mailto:indrajeet.visionias@gmail.com" style={{ color: '#2563eb', fontWeight: 600 }}>indrajeet.visionias@gmail.com</a></li>
            <li><strong>Helpline:</strong> <a href="tel:+919873486158" style={{ color: '#2563eb', fontWeight: 600 }}>+91 98734 86158</a></li>
          </ul>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        © 2026 Indrajeet Sir UPSC Mentorship. All rights reserved. • <Link href="/privacy" style={{ color: '#2563eb' }}>Privacy Policy</Link> • <Link href="/terms" style={{ color: '#2563eb' }}>Terms of Service</Link>
      </footer>
    </div>
  );
}
