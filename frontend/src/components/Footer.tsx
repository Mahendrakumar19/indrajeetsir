'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const [siteContent, setSiteContent] = useState({
    telegramHandle: '@Indrajeetsir_UPSC',
    telegramUrl: 'https://t.me/Indrajeetsir_UPSC',
    contactEmail: 'indrajeet.visionias@gmail.com',
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('indrajeet_site_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.telegramHandle || parsed.telegramUrl || parsed.contactEmail) {
          setSiteContent((prev) => ({
            telegramHandle: parsed.telegramHandle || prev.telegramHandle,
            telegramUrl: parsed.telegramUrl || prev.telegramUrl,
            contactEmail: parsed.contactEmail || prev.contactEmail,
          }));
        }
      }
    } catch {}
  }, []);

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
              UPSC &amp; State PCS Mentorship by Indrajeet Sir. Dedicated to personal evaluation, structured answer writing, and honest aspirant accountability.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/courses">Courses</Link></li>
              <li><Link href="/results">Results</Link></li>
              <li><Link href="/resources">Resources</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Legal &amp; Security</h4>
            <ul className="footer-links-list">
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/terms#refund">Refund Policy</Link></li>
              <li><Link href="/disclaimer">Disclaimers &amp; Cookies</Link></li>
            </ul>
          </div>

          <div className="footer-contact-block">
            <h4 className="footer-col-title">Connect &amp; Desk</h4>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
              <i className="fa-brands fa-youtube" style={{ color: '#dc2626', fontSize: '1.25rem', flexShrink: 0 }} aria-hidden="true" />
              <a
                href="https://www.youtube.com/@indrajeetsir_upsc"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}
              >
                YouTube: @indrajeetsir_upsc
              </a>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
              <i className="fa-brands fa-instagram" style={{ color: '#e1306c', fontSize: '1.25rem', flexShrink: 0 }} aria-hidden="true" />
              <a
                href="https://www.instagram.com/indrajeetsir_upsc"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#e1306c', fontWeight: 600, textDecoration: 'none' }}
              >
                Instagram: @indrajeetsir_upsc
              </a>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
              <i className="fa-brands fa-telegram" style={{ color: '#0088cc', fontSize: '1.25rem', flexShrink: 0 }} aria-hidden="true" />
              <a
                href={siteContent.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#0088cc', fontWeight: 600, textDecoration: 'none' }}
              >
                Telegram: {siteContent.telegramHandle}
              </a>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '0.65rem' }}>
              <i className="fa-solid fa-envelope" style={{ color: '#64748b', fontSize: '1.05rem', flexShrink: 0 }} aria-hidden="true" />
              <a href={`mailto:${siteContent.contactEmail}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {siteContent.contactEmail}
              </a>
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
