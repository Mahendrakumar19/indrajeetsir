import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer-wrap">
      <div className="footer-container">
        <div className="footer-grid-4">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <Image
                src="/logo.png"
                alt="Indrajeet Sir"
                width={36}
                height={36}
                className="nav-brand-logo"
              />
              <div className="nav-title">Indrajeet Sir</div>
            </div>
            <p className="footer-brand-desc">
              1:1 UPSC & State PCS Mentorship. Dedicated to personal evaluation, structured answer writing, and honest aspirant accountability.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#top">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Legal & Security</h4>
            <ul className="footer-links-list">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/terms#refund">Refund Policy</Link></li>
              <li><Link href="/disclaimer">Disclaimers & Cookies</Link></li>
            </ul>
          </div>

          <div className="footer-contact-block">
            <h4 className="footer-col-title">Contact Desk</h4>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#0088cc" aria-hidden="true" style={{ flexShrink: 0 }}>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z"/>
              </svg>
              <a
                href="https://t.me/Indrajeet_UPSC"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0088cc', fontWeight: 700, textDecoration: 'none' }}
              >
                Telegram: @Indrajeet_UPSC
              </a>
            </p>
            <p><a href="mailto:indrajeet.visionias@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>indrajeet.visionias@gmail.com</a></p>
            <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#94a3b8' }}>Delhi, India • Mon–Sat, 9 AM – 8 PM IST</p>
          </div>
        </div>

        <div className="footer-bottom-copy">
          <div>© 2026 Indrajeet Sir Mentorship. All rights reserved.</div>
          <div>
            Designed &amp; Developed by{' '}
            <a
              href="https://nighwantech.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
            >
              Nighwan Techology Pvt. Ltd. 
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
