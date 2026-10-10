import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import '../legal.css';

export const metadata: Metadata = {
  title: 'Terms of Service | Indrajeet Sir IAS Mentorship',
  description: 'Terms and Conditions, Student Code of Conduct, and Refund Policies for Indrajeet Sir 1:1 UPSC Mentorship programs.',
};

export default function TermsOfServicePage() {
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
        <span className="legal-badge">Agreement</span>
        <h1>Terms of Service</h1>
        <p className="legal-date">Last Updated: October 2026 • Effective for all enrolled candidates</p>
      </header>

      <main className="legal-container">
        <div className="legal-callout">
          <strong>Academic Excellence & Mutual Respect:</strong> Enrolling in Indrajeet Sir&apos;s mentorship means embarking on a focused, disciplined preparation journey. By registering or paying course fees, you agree to these Terms of Service.
        </div>

        <h2>1. Acceptance of Terms</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;Student&quot;, &quot;Enrolled Aspirant&quot;, or &quot;User&quot;) and <strong>Indrajeet Sir IAS Mentorship</strong> (&quot;Academy&quot;, &quot;We&quot;, &quot;Us&quot;). These terms govern your access to the web portal, live Google Meet sessions, curriculum notes, evaluative feedback, and the <strong>Indrajeet Sir UPSC</strong> mobile application.
        </p>

        <h2>2. Enrollment & Student Account Integrity</h2>
        <ul>
          <li><strong>Single-User License:</strong> Each mentorship seat is strictly personal and non-transferable. You agree not to share, resell, or distribute your mobile app credentials, login tokens, or live Google Meet links to any non-enrolled person.</li>
          <li><strong>Accurate Information:</strong> Aspirants must provide authentic contact details (email, WhatsApp number) during enrollment to ensure receipt of live class links, meeting reschedule notifications, and evaluation copies.</li>
        </ul>

        <h2>3. Intellectual Property & Anti-Piracy Policy</h2>
        <p>
          All educational materials, live lectures, curated question banks, evaluation frameworks, model answers, and proprietary strategy frameworks created by Indrajeet Sir are the exclusive intellectual property of the Academy:
        </p>
        <ul>
          <li><strong>Recording Prohibition:</strong> Screen recording, capturing, or unauthorized rebroadcasting of 1:1 mentorship calls or group live classes is strictly prohibited.</li>
          <li><strong>Copyright Protection:</strong> Any unauthorized upload of proprietary study materials to public Telegram groups, YouTube, or file-sharing websites constitutes a violation of the Indian Copyright Act, 1957, and will lead to immediate cancellation of enrollment without refund and potential legal remedies.</li>
        </ul>

        <h2>4. Live Classroom & 1:1 Mentorship Etiquette</h2>
        <p>To preserve high academic standards:</p>
        <ol>
          <li><strong>Punctuality:</strong> Aspirants must join scheduled Google Meet sessions on time. Live sessions start precisely at the notified hour.</li>
          <li><strong>Prior Notice for Rescheduling:</strong> If an aspirant is unable to attend a scheduled 1:1 strategy slot due to unavoidable emergency, at least 4 hours prior notice must be provided via WhatsApp/Email to allow slot re-allocation.</li>
          <li><strong>Constructive Discourse:</strong> Respectful, professional communication is mandatory during all student-mentor interactions. Disruptive behavior will result in immediate suspension.</li>
        </ol>

        <h2>5. Fees & Razorpay Payment Processing</h2>
        <ul>
          <li><strong>Transparent Pricing:</strong> Mentorship course fees are explicitly stated on the portal prior to checkout. All transactions are securely processed in Indian Rupees (INR) via Razorpay.</li>
          <li><strong>Tax Invoicing:</strong> Successful payments generate a formal digital fee receipt delivered immediately to your registered email address.</li>
        </ul>

        <h2>6. Refund & Cancellation Policy</h2>
        <p>
          We pride ourselves on offering intense, high-value mentorship with dedicated mentor bandwidth. Due to the high-touch, limited-seat nature of 1:1 mentorship:
        </p>
        <ul>
          <li><strong>Seat Allocation:</strong> Enrolling reserves an exclusive mentor slot, limiting total batch intake to guarantee individual attention.</li>
          <li><strong>Evaluation Window:</strong> If you face genuine technical issues preventing app access or meeting connectivity within 48 hours of enrollment, contact our desk for full resolution. If our team is unable to resolve your access within 7 business days, a full refund will be processed to the original payment source.</li>
          <li><strong>Course Progression:</strong> Once an aspirant has attended their initial 1:1 diagnostic call and received evaluation feedback, fees are non-refundable.</li>
        </ul>

        <h2>7. Limitation of Liability</h2>
        <p>
          While Indrajeet Sir delivers time-tested UPSC strategies and rigorous answer writing methodologies, final civil services selection depends on candidate self-study, consistency, and official Union Public Service Commission (UPSC) evaluations. The Academy disclaims any guarantee of guaranteed selection or specific rank.
        </p>

        <h2>8. Governing Law & Jurisdiction</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in Delhi, India.
        </p>

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
