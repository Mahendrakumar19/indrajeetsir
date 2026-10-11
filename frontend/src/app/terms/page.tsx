'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

const DEFAULT_TERMS = {
  headerBadge: 'Agreement',
  headerTitle: 'Terms of Service',
  lastUpdated: 'October 2026 • Effective for all enrolled candidates',
  callout: 'Academic Excellence & Mutual Respect: Enrolling in Indrajeet Sir\'s mentorship means embarking on a focused, disciplined preparation journey. By registering or paying course fees, you agree to these Terms of Service.',
  section1Title: '1. Acceptance of Terms',
  section1Content: 'These Terms of Service ("Terms") constitute a legally binding agreement between you ("Student", "Enrolled Aspirant", or "User") and Indrajeet Sir IAS Mentorship ("Academy", "We", "Us"). These terms govern your access to the web portal, live interactive sessions, curriculum notes, evaluative feedback, and the Indrajeet Sir UPSC mobile application.',
  section2Title: '2. Enrollment & Student Account Integrity',
  section2Content: 'Single-User License: Each mentorship seat is strictly personal and non-transferable. You agree not to share, resell, or distribute your mobile app credentials, login tokens, or live session links to any non-enrolled person. Accurate Information: Aspirants must provide authentic contact details (email, WhatsApp number) during enrollment to ensure receipt of live class links, meeting reschedule notifications, and evaluation copies.',
  section3Title: '3. Intellectual Property & Anti-Piracy Policy',
  section3Content: 'All educational materials, live lectures, curated question banks, evaluation frameworks, model answers, and proprietary strategy frameworks created by Indrajeet Sir are the exclusive intellectual property of the Academy. Screen recording, capturing, or unauthorized rebroadcasting of 1:1 mentorship calls or group live classes is strictly prohibited.',
  section4Title: '4. Refund & Cancellation Policy',
  section4Content: 'We pride ourselves on offering intense, high-value mentorship with dedicated mentor bandwidth. Due to the high-touch, limited-seat nature of 1:1 mentorship, fees are non-refundable once an aspirant has attended their initial 1:1 diagnostic call and received evaluation feedback.',
};

export default function TermsOfServicePage() {
  const [content, setContent] = useState(DEFAULT_TERMS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('indrajeet_terms_content');
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
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </nav>

      <header className="legal-header">
        <span className="legal-badge">{content.headerBadge}</span>
        <h1>{content.headerTitle}</h1>
        <p className="legal-date">{content.lastUpdated}</p>
      </header>

      <main className="legal-container">
        <div className="legal-callout">
          <strong>Academic Excellence & Mutual Respect:</strong> {content.callout}
        </div>

        <h2>{content.section1Title}</h2>
        <p>{content.section1Content}</p>

        <h2>{content.section2Title}</h2>
        <p>{content.section2Content}</p>

        <h2>{content.section3Title}</h2>
        <p>{content.section3Content}</p>

        <h2>{content.section4Title}</h2>
        <p>{content.section4Content}</p>

        <div className="legal-contact-card">
          <h3>Contacting Academic Administration</h3>
          <p>For questions regarding these Terms, enrollment agreements, or fee inquiries:</p>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.75rem' }}>
            <li><strong>Official Desk:</strong> Indrajeet Sir Mentorship</li>
            <li><strong>Email:</strong> <a href="mailto:indrajeet.visionias@gmail.com" style={{ color: '#2563eb', fontWeight: 600 }}>indrajeet.visionias@gmail.com</a></li>
            <li><strong>Helpline:</strong> <a href="tel:+919873486158" style={{ color: '#2563eb', fontWeight: 600 }}>+91 98734 86158</a></li>
            <li><strong>Operating Hours:</strong> Mon–Sat, 9:00 AM – 8:00 PM IST</li>
          </ul>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        © 2026 Indrajeet Sir IAS Mentorship. All rights reserved. • <Link href="/privacy" style={{ color: '#2563eb' }}>Privacy Policy</Link> • <Link href="/disclaimer" style={{ color: '#2563eb' }}>Disclaimers</Link>
      </footer>
    </div>
  );
}
