'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

const DEFAULT_PRIVACY = {
  headerBadge: 'Legal & Security',
  headerTitle: 'Privacy Policy',
  lastUpdated: 'October 2026 • Effective Immediately',
  callout: 'Aspirant Confidentiality Commitment: Indrajeet Sir IAS Mentorship operates on complete student privacy. We understand that Civil Services preparation requires psychological safety, candid feedback, and personal performance diagnostics. We never sell, rent, or trade your personal or academic data with third-party marketers or coaching aggregators.',
  section1Title: '1. Scope & Introduction',
  section1Content: 'This Privacy Policy governs the manner in which Indrajeet Sir IAS Mentorship collects, uses, maintains, and discloses information collected from users across the official website (indrajeetsir.com) and the official Indrajeet Sir UPSC Android Mobile Application.',
  section2Title: '2. Information We Collect',
  section2Content: 'To provide high-touch 1:1 mentorship and live classroom access, we collect student full name, email address, contact phone/WhatsApp number, target UPSC CSE attempt year, handwritten copy submissions, and transaction metadata.',
  section3Title: '3. Data Storage & Security Protocols',
  section3Content: 'All web traffic and mobile API interactions utilize HTTPS and TLS 1.3 encryption. Only Indrajeet Sir and authorized academic evaluators have access to student evaluation copies. Administrative access requires multi-factor authentication.',
};

export default function PrivacyPolicyPage() {
  const [content, setContent] = useState(DEFAULT_PRIVACY);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('indrajeet_privacy_content');
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
          <strong>Aspirant Confidentiality Commitment:</strong> {content.callout}
        </div>

        <h2>{content.section1Title}</h2>
        <p>{content.section1Content}</p>

        <h2>{content.section2Title}</h2>
        <p>{content.section2Content}</p>

        <h2>{content.section3Title}</h2>
        <p>{content.section3Content}</p>

        <div className="legal-contact-card">
          <h3>Grievance Redressal & Contact Officer</h3>
          <p>For any privacy concerns, data inquiries, or account management questions, you can reach out directly to the official mentorship desk:</p>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.75rem' }}>
            <li><strong>Officer:</strong> Indrajeet Sir / Support Desk</li>
            <li><strong>Email:</strong> <a href="mailto:indrajeet.visionias@gmail.com" style={{ color: '#2563eb', fontWeight: 600 }}>indrajeet.visionias@gmail.com</a></li>
            <li><strong>Phone / WhatsApp:</strong> <a href="tel:+919873486158" style={{ color: '#2563eb', fontWeight: 600 }}>+91 98734 86158</a></li>
            <li><strong>Hours:</strong> Monday – Saturday, 9:00 AM – 8:00 PM IST</li>
            <li><strong>Location:</strong> Delhi, India</li>
          </ul>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        © 2026 Indrajeet Sir IAS Mentorship. All rights reserved. • <Link href="/terms" style={{ color: '#2563eb' }}>Terms of Service</Link> • <Link href="/disclaimer" style={{ color: '#2563eb' }}>Disclaimers</Link>
      </footer>
    </div>
  );
}
