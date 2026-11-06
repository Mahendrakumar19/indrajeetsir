'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadBanner from '@/components/LeadBanner';
import '@/app/home.css';

export default function AboutPage() {
  const [siteContent, setSiteContent] = useState({
    aboutSirHeading: 'About Indrajeet Sir',
    sirCard1Val: '4 UPSC Mains Written',
    sirCard1Desc: 'Appeared in 4 UPSC CSE Mains examinations with hands-on experience in GS 1–4 and Essay.',
    sirCard2Val: '7+ Years Experience',
    sirCard2Desc: 'Over 7 years of dedicated mentorship guiding UPSC CSE and State PCS aspirants.',
    sirCard3Val: '500+ Students Mentored',
    sirCard3Desc: 'Personally guided 500+ aspirants with structured study plans and diagnostic copy evaluation.',
    sirCard4Val: 'Faculty at VisionIAS',
    sirCard4Desc: 'Expert faculty for Polity & Governance with specialized focus on GS Paper 2.',
    sirCard5Val: 'LLB from DU',
    sirCard5Desc: 'Graduated in Law from the Faculty of Law, University of Delhi.',
    aboutMentorshipHeading: 'About The Mentorship',
    mentorPillar1Title: 'Weekly Sessions by Indrajeet Sir',
    mentorPillar1Desc: 'Direct 1-on-1 strategy sessions every week to review targets, syllabus progress, and test performance.',
    mentorPillar2Title: 'Reverse Engineering Method',
    mentorPillar2Desc: 'Deconstructing past UPSC Prelims & Mains questions (PYQs) to master recurring themes and core frameworks.',
    mentorPillar3Title: 'Main Focus on "Process"',
    mentorPillar3Desc: 'Results are a by-product of daily discipline, regular answer writing, and honest milestone tracking.',
    mentorPillar4Title: 'Direct Teacher Access',
    mentorPillar4Desc: 'Every Mains answer copy is personally evaluated by Indrajeet Sir with line-by-line actionable feedback.',
    whatsappUrl: 'https://wa.me/919709992093',
  });

  useEffect(() => {
    const loadContent = () => {
      try {
        const saved = localStorage.getItem('indrajeet_site_content');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.sirCard1Val === 'VisionIAS' || !parsed.sirCard1Val?.includes('Mains')) {
            delete parsed.aboutSirHeading;
            delete parsed.sirCard1Val;
            delete parsed.sirCard1Desc;
            delete parsed.sirCard2Val;
            delete parsed.sirCard2Desc;
            delete parsed.sirCard3Val;
            delete parsed.sirCard3Desc;
            delete parsed.sirCard4Val;
            delete parsed.sirCard4Desc;
            delete parsed.sirCard5Val;
            delete parsed.sirCard5Desc;
            delete parsed.aboutMentorshipHeading;
            delete parsed.mentorPillar1Title;
            delete parsed.mentorPillar1Desc;
            delete parsed.mentorPillar2Title;
            delete parsed.mentorPillar2Desc;
            delete parsed.mentorPillar3Title;
            delete parsed.mentorPillar3Desc;
            delete parsed.mentorPillar4Title;
            delete parsed.mentorPillar4Desc;
          }
          setSiteContent((prev) => ({ ...prev, ...parsed }));
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

      {/* ── Section 1: About Indrajeet Sir ── */}
      <section id="about" className="section-wrap" style={{ paddingTop: '7rem' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>{siteContent.aboutSirHeading}</h2>

          <div className="sir-profile-highlights-grid">
            <div className="sir-stat-card card-color-blue">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-pen-nib" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard1Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard1Desc}</p>
            </div>

            <div className="sir-stat-card card-color-amber">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-award" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard2Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard2Desc}</p>
            </div>

            <div className="sir-stat-card card-color-emerald">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-users" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard3Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard3Desc}</p>
            </div>

            <div className="sir-stat-card card-color-purple">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-landmark" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard4Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard4Desc}</p>
            </div>

            <div className="sir-stat-card card-color-teal">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-scale-balanced" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard5Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard5Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: About The Mentorship ── */}
      <section id="mentorship" className="section-wrap" style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading" style={{ marginBottom: '2.5rem' }}>{siteContent.aboutMentorshipHeading}</h2>

          <div className="mentorship-pillars-grid">
            <div className="mentor-pillar-card pillar-color-blue">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-calendar-check" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar1Title}</h3>
              <p>{siteContent.mentorPillar1Desc}</p>
            </div>

            <div className="mentor-pillar-card pillar-color-indigo">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-arrows-spin" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar2Title}</h3>
              <p>{siteContent.mentorPillar2Desc}</p>
            </div>

            <div className="mentor-pillar-card pillar-color-amber">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-bullseye" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar3Title}</h3>
              <p>{siteContent.mentorPillar3Desc}</p>
            </div>

            <div className="mentor-pillar-card pillar-color-emerald">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-handshake" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar4Title}</h3>
              <p>{siteContent.mentorPillar4Desc}</p>
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
