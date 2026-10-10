import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

export const metadata: Metadata = {
  title: 'Privacy Policy | Indrajeet Sir IAS Mentorship',
  description: 'Official Privacy Policy of Indrajeet Sir IAS Mentorship. Learn how aspirant data, evaluations, and confidentiality are protected under industry security standards.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="legal-page">
      <nav className="legal-nav-bar">
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="Indrajeet Sir Logo"
            width={38}
            height={38}
            style={{ borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #2563eb' }}
          />
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>Indrajeet Sir</div>
            <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>IAS Mentorship</div>
          </div>
        </Link>
        <Link href="/" className="back-link">
          ← Back to Home
        </Link>
      </nav>

      <header className="legal-header">
        <span className="legal-badge">Legal & Security</span>
        <h1>Privacy Policy</h1>
        <p className="legal-date">Last Updated: October 2026 • Effective Immediately</p>
      </header>

      <main className="legal-container">
        <div className="legal-callout">
          <strong>Aspirant Confidentiality Commitment:</strong> Indrajeet Sir IAS Mentorship operates on complete student privacy. We understand that Civil Services preparation requires psychological safety, candid feedback, and personal performance diagnostics. We never sell, rent, or trade your personal or academic data with third-party marketers or coaching aggregators.
        </div>

        <h2>1. Scope & Introduction</h2>
        <p>
          This Privacy Policy governs the manner in which <strong>Indrajeet Sir IAS Mentorship</strong> (operated by Nighwan Technology Pvt. Ltd.) collects, uses, maintains, and discloses information collected from users (referred to as &quot;Students&quot;, &quot;Aspirants&quot;, or &quot;You&quot;) across the official website (<code>indrajeetsir.com</code>) and the official <strong>Indrajeet Sir UPSC</strong> Android Mobile Application.
        </p>

        <h2>2. Information We Collect</h2>
        <p>To provide high-touch 1:1 mentorship and live classroom access, we collect the following limited details:</p>
        <ul>
          <li><strong>Personal Identifiers:</strong> Student full name, email address, contact phone/WhatsApp number.</li>
          <li><strong>Academic Profile:</strong> Target UPSC CSE attempt year (e.g., 2026, 2027), Optional Subject (e.g., Public Administration, PSIR, Geography), educational background, and preparation stage (Beginner, Intermediate, Mains-appearing).</li>
          <li><strong>Classroom & Evaluation Records:</strong> Uploaded Mains handwritten answer copies, evaluation sheets, marks scored, attendance in live Google Meet sessions, and 1:1 strategy interaction notes.</li>
          <li><strong>Transaction Metadata:</strong> Order IDs, payment transaction status, amount paid, and invoice details processed securely via Razorpay. <em>(Note: We do NOT store card numbers, CVVs, or net banking passwords; all payments are tokenized and processed directly by RBI-regulated payment gateways).</em></li>
          <li><strong>Device & Application Diagnostics:</strong> Device model, OS version, and crash logs needed to guarantee smooth video class delivery and real-time push reminder reliability.</li>
        </ul>

        <h2>3. How We Use Collected Information</h2>
        <p>We process your data strictly for legitimate educational mentorship functions:</p>
        <ol>
          <li><strong>Course Delivery & Session Scheduling:</strong> Allotting personalized 1:1 mentorship time slots, distributing private Google Meet links, and sending session schedules and class updates.</li>
          <li><strong>Mains Answer Evaluation:</strong> Analyzing your answer copies, highlighting structural gaps, suggesting diagram additions, and tracking improvement metrics across phases.</li>
          <li><strong>Communication & Desk Support:</strong> Answering academic queries, sending course schedule updates, and resolving technical support issues via WhatsApp/Email.</li>
          <li><strong>Compliance & Invoicing:</strong> Generating tax-compliant invoices and verifying enrollments under Indian regulatory frameworks.</li>
        </ol>

        <h2>4. Data Storage & Security Protocols</h2>
        <p>
          We employ state-of-the-art administrative, technical, and physical safeguards:
        </p>
        <ul>
          <li><strong>Encryption in Transit & at Rest:</strong> All web traffic and mobile API interactions utilize HTTPS and TLS 1.3 encryption. Passwords are cryptographically salted and hashed using bcrypt.</li>
          <li><strong>Strict Role-Based Access:</strong> Only Indrajeet Sir and authorized academic evaluators have access to student evaluation copies. Administrative access requires multi-factor authentication.</li>
          <li><strong>Secure Hosting:</strong> Production servers and databases are housed in secure, ISO/IEC 27001-certified data center environments with regular security audits and automated backups.</li>
        </ul>

        <h2>5. Third-Party Service Providers</h2>
        <p>We partner only with vetted industry leaders for core technological infrastructure:</p>
        <ul>
          <li><strong>Razorpay:</strong> Certified PCI-DSS Level 1 payment gateway partner handling secure UPI, card, and net banking transactions.</li>
          <li><strong>Google Meet / Workspace:</strong> End-to-end encrypted video conferencing for live strategy calls and doubt clearance.</li>
          <li><strong>Transactional Email (SMTP):</strong> Secure delivery of login credentials, schedules, and fee receipts.</li>
        </ul>

        <h2>6. Data Retention & Student Rights</h2>
        <p>
          We retain your academic records for the duration of your mentorship program and subsequent attempt cycle to ensure historical continuity in your preparation tracking. Under Indian digital data privacy regulations, you have the right to:
        </p>
        <ul>
          <li>Request a copy of your stored academic performance and profile records.</li>
          <li>Request correction or updating of contact details directly via the mobile app Settings or support desk.</li>
          <li>Request permanent deletion of your account and uploaded submission copies upon course completion.</li>
        </ul>

        <div className="legal-contact-card">
          <h3>7. Grievance Redressal & Contact Officer</h3>
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
