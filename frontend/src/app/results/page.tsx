'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadBanner from '@/components/LeadBanner';
import '@/app/home.css';

export default function ResultsPage() {
  const [siteContent, setSiteContent] = useState({
    resultsHeading: 'Aspirants Mentored by Indrajeet Sir',
    resultsSubheading: '',
    result1Name: 'Jatin Parashar (IRS) UPSC 2022',
    result2Name: 'Kritika Mishra (IAS) UPSC 2023',
    result3Name: 'Devesh Parashar (IPS) UPSC 2024',
    whatsappUrl: 'https://wa.me/919709992093',
  });

  useEffect(() => {
    const loadContent = () => {
      try {
        const saved = localStorage.getItem('indrajeet_site_content');
        if (saved) {
          setSiteContent((prev) => ({ ...prev, ...JSON.parse(saved) }));
        }
      } catch {}
    };

    loadContent();
    window.addEventListener('storage', loadContent);
    return () => window.removeEventListener('storage', loadContent);
  }, []);

  return (
    <div className="site">
      <Header />

      {/* ── Our Results Section ── */}
      <section id="results" className="section-wrap" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading">{siteContent.resultsHeading}</h2>
          {siteContent.resultsSubheading ? (
            <p className="section-subtext">{siteContent.resultsSubheading}</p>
          ) : null}

          <div className="topper-mentored-grid">
            {/* 1. Jatin Parashar (IRS) UPSC 2022 */}
            <div className="topper-mentored-card">
              <div className="topper-image-frame">
                <Image
                  src="/toppers/jatin-parashar.jpg"
                  alt="Jatin Parashar (IRS) UPSC 2022"
                  width={400}
                  height={480}
                  className="topper-photo"
                  priority
                />
              </div>
              <h3 className="topper-name-label">{siteContent.result1Name || 'Jatin Parashar (IRS) UPSC 2022'}</h3>
            </div>

            {/* 2. Kritika Mishra (IAS) UPSC 2023 */}
            <div className="topper-mentored-card">
              <div className="topper-image-frame">
                <Image
                  src="/toppers/kritika-mishra.jpg"
                  alt="Kritika Mishra (IAS) UPSC 2023"
                  width={400}
                  height={480}
                  className="topper-photo"
                  priority
                />
              </div>
              <h3 className="topper-name-label">{siteContent.result2Name || 'Kritika Mishra (IAS) UPSC 2023'}</h3>
            </div>

            {/* 3. Devesh Parashar (IPS) UPSC 2024 */}
            <div className="topper-mentored-card">
              <div className="topper-image-frame">
                <Image
                  src="/toppers/devesh-parashar.jpg"
                  alt="Devesh Parashar (IPS) UPSC 2024"
                  width={400}
                  height={480}
                  className="topper-photo"
                  priority
                />
              </div>
              <h3 className="topper-name-label">{siteContent.result3Name || 'Devesh Parashar (IPS) UPSC 2024'}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── Callback Lead Banner ── */}
      <LeadBanner />

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href={siteContent.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Direct WhatsApp Consultation"
        title="Direct WhatsApp Consultation with Indrajeet Sir"
      >
        <i className="fa-brands fa-whatsapp" aria-hidden="true" />
      </a>
    </div>
  );
}
