'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadBanner from '@/components/LeadBanner';
import { API_URL } from '@/lib/api';
import '@/app/home.css';

interface PdfResource {
  id: string;
  title: string;
  description: string;
  tag: string;
  size: string;
  fileUrl: string;
}

export default function ResourcesPage() {
  const [siteContent, setSiteContent] = useState({
    pdfSectionHeading: 'Free Mains Micro-Notes & Value-Addition PDFs',
    pdfSectionSubheading: 'Download curated sample notes, micro-syllabus frameworks, and model copies prepared by Indrajeet Sir.',
    whatsappUrl: 'https://wa.me/919709992093',
  });

  const [pdfList, setPdfList] = useState<PdfResource[]>([]);

  useEffect(() => {
    const loadContent = () => {
      try {
        const savedContent = localStorage.getItem('indrajeet_site_content');
        if (savedContent) {
          setSiteContent((prev) => ({ ...prev, ...JSON.parse(savedContent) }));
        }
        const savedPdfs = localStorage.getItem('indrajeet_pdf_list');
        if (savedPdfs) {
          const parsed = JSON.parse(savedPdfs);
          if (Array.isArray(parsed)) {
            setPdfList(parsed);
          }
        }
      } catch {}
    };

    loadContent();
    window.addEventListener('storage', loadContent);

    fetch(`${API_URL}/resources`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setPdfList(data);
          try { localStorage.setItem('indrajeet_pdf_list', JSON.stringify(data)); } catch {}
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('storage', loadContent);
  }, []);

  return (
    <div className="site">
      <Header />

      {/* ── Free Study Material & Resource PDFs Section ── */}
      <section id="resources" className="section-wrap" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading">{siteContent.pdfSectionHeading}</h2>
          <p className="section-subtext">
            {siteContent.pdfSectionSubheading}
          </p>

          <div className="pdf-grid-3d">
            {pdfList.map((item) => (
              <div key={item.id} className="pdf-card-3d">
                <div>
                  <div className="pdf-card-header">
                    <div className="pdf-icon-badge">
                      <i className="fa-solid fa-file-pdf" style={{ fontSize: '1.4rem', color: '#dc2626' }} aria-hidden="true" />
                    </div>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="pdf-card-desc">{item.description}</p>
                </div>

                <div className="pdf-card-footer">
                  <div className="pdf-meta-info">
                    <span className="pdf-meta-pages">PDF Document</span>
                    <span className="pdf-meta-sub">{item.size} • Free Access</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pdf-view"
                      title={`Open ${item.title} in new tab`}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                      <span>View</span>
                    </a>
                    <a
                      href={`${item.fileUrl}${item.fileUrl.includes('?') ? '&' : '?'}download=1`}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pdf-download"
                      title={`Download ${item.title}`}
                    >
                      <i className="fa-solid fa-download" style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
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
