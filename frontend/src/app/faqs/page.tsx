'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadBanner from '@/components/LeadBanner';
import '@/app/home.css';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    q: 'What is the duration of the mentorship program?',
    a: '365+1 days (1 full year of continuous guidance).',
  },
  {
    id: 'faq-2',
    q: 'Is an installment facility available for fee payment?',
    a: 'Yes, flexible installment options are available.',
  },
  {
    id: 'faq-3',
    q: 'Who will mentor students and evaluate answer copies?',
    a: 'Indrajeet Sir personally guides students and evaluates every copy.',
  },
  {
    id: 'faq-4',
    q: 'Does the Mains Mentorship include a Test Series?',
    a: 'Yes, an evaluated Mains test series is included.',
  },
  {
    id: 'faq-5',
    q: 'Does the Prelims Mentorship include Mock Tests?',
    a: 'Yes, comprehensive Prelims mock tests with solutions are included.',
  },
  {
    id: 'faq-6',
    q: 'What does the PYQ module cover?',
    a: 'In-depth trend analysis, theme-wise solving, and direct syllabus mapping.',
  },
  {
    id: 'faq-7',
    q: 'Are preparation targets assigned daily, weekly, or monthly?',
    a: 'Targets are structured on a clear weekly basis.',
  },
  {
    id: 'faq-8',
    q: 'Is student progress on weekly targets actively tracked?',
    a: 'Yes, milestone completion and performance are tracked weekly.',
  },
  {
    id: 'faq-9',
    q: 'Can aspirants enroll exclusively for Prelims or Mains?',
    a: 'Yes, stage-specific mentorship (Prelims or Mains only) is available.',
  },
  {
    id: 'faq-10',
    q: 'Can mentorship be joined alongside or after a Foundation Course?',
    a: 'Yes, you can join at either stage. Dedicated, separate batches are conducted for each.',
  },
];

export default function FaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [siteContent, setSiteContent] = useState({
    faqsHeading: 'Frequently Asked Questions',
    faqsSubheading: 'Clear answers to common questions about copy checking, schedules, and study material.',
    whatsappUrl: 'https://wa.me/919709992093',
  });

  useEffect(() => {
    const loadContent = () => {
      try {
        const savedContent = localStorage.getItem('indrajeet_site_content');
        if (savedContent) {
          setSiteContent((prev) => ({ ...prev, ...JSON.parse(savedContent) }));
        }
        const savedFaqs = localStorage.getItem('indrajeet_faqs_v2') || localStorage.getItem('indrajeet_faqs');
        if (savedFaqs) {
          const parsed = JSON.parse(savedFaqs);
          if (Array.isArray(parsed) && parsed.length >= 10 && parsed[0]?.a?.includes('full year')) {
            setFaqs(parsed);
          } else {
            setFaqs(DEFAULT_FAQS);
            try {
              localStorage.setItem('indrajeet_faqs_v2', JSON.stringify(DEFAULT_FAQS));
              localStorage.setItem('indrajeet_faqs', JSON.stringify(DEFAULT_FAQS));
            } catch {}
          }
        } else {
          setFaqs(DEFAULT_FAQS);
          try {
            localStorage.setItem('indrajeet_faqs_v2', JSON.stringify(DEFAULT_FAQS));
            localStorage.setItem('indrajeet_faqs', JSON.stringify(DEFAULT_FAQS));
          } catch {}
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

      {/* ── Real Aspirant FAQs (Fluid Accordion) ── */}
      <section id="faqs" className="section-wrap" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading">{siteContent.faqsHeading || 'Frequently Asked Questions'}</h2>
          <p className="section-subtext">
            {siteContent.faqsSubheading || 'Clear answers to common questions about copy checking, schedules, and study material.'}
          </p>

          <div className="faq-container">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="faq-card-fluid">
                  <button
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <span className={`faq-icon-indicator ${isOpen ? 'open' : ''}`} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`} aria-hidden="true" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer-wrap">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
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
