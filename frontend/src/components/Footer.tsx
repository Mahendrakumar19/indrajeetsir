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
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
              <i className="fa-brands fa-telegram" style={{ color: '#0088cc', fontSize: '1.25rem', flexShrink: 0 }} aria-hidden="true" />
              <a
                href="https://t.me/Indrajeetsir_UPSC"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0088cc', fontWeight: 700, textDecoration: 'none' }}
              >
                Telegram: @Indrajeetsir_UPSC
              </a>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
              <i className="fa-solid fa-envelope" style={{ color: '#64748b', fontSize: '1.05rem', flexShrink: 0 }} aria-hidden="true" />
              <a href="mailto:indrajeet.visionias@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>indrajeet.visionias@gmail.com</a>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#94a3b8', fontSize: '1rem', flexShrink: 0 }} aria-hidden="true" />
              <span>Delhi, India • Mon–Sat, 9 AM – 8 PM IST</span>
            </p>
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
              Nighwan Technology Pvt. Ltd. 
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
