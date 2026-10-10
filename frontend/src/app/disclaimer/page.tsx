import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

export const metadata: Metadata = {
  title: 'Disclaimers & Cookie Policy | Indrajeet Sir IAS Mentorship',
  description: 'Official UPSC examination educational disclaimers, cookie usage guidelines, and trademark notices for Indrajeet Sir IAS Mentorship.',
};

export default function DisclaimersPage() {
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
        <span className="legal-badge">Transparency</span>
        <h1>Disclaimers & Cookie Policy</h1>
        <p className="legal-date">Last Updated: October 2026 • Public Educational Notice</p>
      </header>

      <main className="legal-container">
        <h2>1. Educational & Non-Affiliation Disclaimer</h2>
        <p>
          <strong>Indrajeet Sir IAS Mentorship</strong> is an independent academic mentorship initiative founded by Indrajeet Sir.
        </p>
        <div className="legal-callout">
          <strong>Important Notice:</strong> We are NOT affiliated with, authorized by, sponsored by, or endorsed by the <strong>Union Public Service Commission (UPSC)</strong>, the Government of India, or any State Public Service Commission. The terms &quot;UPSC&quot;, &quot;Civil Services Examination (CSE)&quot;, &quot;IAS&quot;, &quot;IPS&quot;, and &quot;State PCS&quot; are used solely in an educational, descriptive context to identify the competitive examinations for which mentorship is provided.
        </div>

        <h2>2. Examination Success & Results Disclaimer</h2>
        <p>
          The Civil Services Examination is one of the most competitive examinations globally. All testimonials, previous topper reviews, and success stories showcased on this platform represent genuine past student outcomes who benefited from Indrajeet Sir&apos;s guidance. However:
        </p>
        <ul>
          <li>Past performance and previous batch results do not guarantee identical future results.</li>
          <li>Final merit ranks depend entirely on individual student preparation rigor, writing execution on examination day, and official commission assessments.</li>
          <li>Mentorship provides strategy, answer evaluation frameworks, and critical feedback; it is not a substitute for sustained self-study.</li>
        </ul>

        <h2>3. Cookie & Local Storage Policy</h2>
        <p>
          Our web portal and mobile app utilize minimal, privacy-first session mechanisms:
        </p>
        <ul>
          <li><strong>Essential Session Cookies:</strong> Used exclusively to maintain administrative authentication, maintain checkout session states, and safeguard against Cross-Site Request Forgery (CSRF).</li>
          <li><strong>Preference Storage:</strong> Used to save UI display preferences (such as Light / Dark Mode toggles).</li>
          <li><strong>Zero Third-Party Advertising Trackers:</strong> We do NOT employ third-party behavioral advertising cookies, retargeting pixels, or data broker scripts. Your browsing activity is strictly private.</li>
        </ul>

        <h2>4. External Links Disclaimer</h2>
        <p>
          Our platform may contain external links to Google Meet, official government gazettes, PIB releases, or curriculum reference resources. We do not exercise editorial control over third-party domains and are not responsible for the privacy practices or contents of such external platforms.
        </p>

        <div className="legal-contact-card">
          <h3>Questions Regarding Disclaimers?</h3>
          <p>For any queries or formal correspondence:</p>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: '0.75rem' }}>
            <li><strong>Email:</strong> <a href="mailto:indrajeet.visionias@gmail.com" style={{ color: '#2563eb', fontWeight: 600 }}>indrajeet.visionias@gmail.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+919873486158" style={{ color: '#2563eb', fontWeight: 600 }}>+91 98734 86158</a></li>
            <li><strong>Support Desk:</strong> Indrajeet Sir IAS Mentorship Desk, Delhi, India</li>
          </ul>
        </div>
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '2rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>
        © 2026 Indrajeet Sir IAS Mentorship. All rights reserved. • <Link href="/privacy" style={{ color: '#2563eb' }}>Privacy Policy</Link> • <Link href="/terms" style={{ color: '#2563eb' }}>Terms of Service</Link>
      </footer>
    </div>
  );
}
