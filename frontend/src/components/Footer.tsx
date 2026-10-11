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
              <li><a href="#about">Mentorship Model</a></li>
              <li><a href="#courses">Courses & Fees</a></li>
              <li><a href="#faqs">FAQs</a></li>
              <li><a href="#contact">Contact Desk</a></li>
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
            <p><a href="mailto:indrajeet.visionias@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>indrajeet.visionias@gmail.com</a></p>
            {/* <p><a href="tel:+919873486158" style={{ color: 'inherit', textDecoration: 'none' }}>+91 98734 86158</a></p> */}
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
