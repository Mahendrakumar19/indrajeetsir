'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadBanner from '@/components/LeadBanner';
import './home.css';

export default function Home() {
  const [siteContent, setSiteContent] = useState({
    // 1. Hero Section & Process Pillars
    heroBadge: 'VisionIAS Faculty',
    heroImage: '/indrajeet-sir-hero.jpg',
    heroHeading: 'Every successful attempt begins with the right process.',
    heroSubheading: 'Keeping this in mind, Indrajeet Sir follows a structured, result-oriented approach built around five core pillars to make your preparation focused, strategic and effective.',
    heroPillar1: '600+ Topic Short Notes',
    heroPillar2: 'In-Depth PYQ Analysis',
    heroPillar3: "Toppers' Copy Analysis",
    heroPillar4: 'Answer Writing Skills',
    heroPillar5: '1-on-1 Personal Mentorship',
    dhoniQuote: 'The process is more important than the results. If you take care of the process, results will follow.',
    dhoniAuthor: 'MS Dhoni',
    dhoniTag: 'Our Mentorship Philosophy',

    // Mobile App Showcase
    appTitle: 'Indrajeet Sir UPSC Mentorship App',
    appBullet1Title: '10-Minute Live Class Reminders',
    appBullet1Desc: 'Receive timely alerts before 1:1 strategy calls and batch masterclasses.',
    appBullet2Title: 'Direct Doubt & Copy Evaluation',
    appBullet2Desc: 'Submit handwritten answer sheets and review personalized feedback from Indrajeet Sir.',
    appBullet3Title: 'Offline GS Micro-Notes & Models',
    appBullet3Desc: 'Download curated GS 1–4 micro-notes, brochures, and model answer copies.',
    appPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.nighwantech.indrajeetsir',

    // Contact Desk
    contactDeskHeading: 'Have Questions About Batch, Attempt Year or Strategy?',
    contactDeskSubheading: 'Call or WhatsApp Indrajeet Sir\'s direct desk. Get personalized guidance on which mentorship batch fits your current stage of preparation.',
    telegramHandle: '@Indrajeetsir_UPSC',
    telegramUrl: 'https://t.me/Indrajeetsir_UPSC',
    whatsappUrl: 'https://wa.me/919709992093',
    whatsappDisplay: '+91 97099 92093',
    contactEmail: 'indrajeet.visionias@gmail.com',
  });

  const [showBookModal, setShowBookModal] = useState(false);
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  useEffect(() => {
    const loadContent = () => {
      try {
        const savedContent = localStorage.getItem('indrajeet_site_content');
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          if (parsed.heroHeading && (parsed.heroHeading.includes('Sabhi exam ka ek process') || parsed.heroHeading.includes('Every exam has a process') || !parsed.heroHeading.includes('Every successful attempt'))) {
            delete parsed.heroHeading;
            delete parsed.heroSubheading;
            delete parsed.heroPillar1;
            delete parsed.heroPillar2;
            delete parsed.heroPillar3;
            delete parsed.heroPillar4;
            delete parsed.heroPillar5;
          }
          setSiteContent((prev) => ({ ...prev, ...parsed }));
        }
      } catch {}
    };

    loadContent();
    window.addEventListener('storage', loadContent);
    return () => window.removeEventListener('storage', loadContent);
  }, []);

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName.trim() || !callbackPhone.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('indrajeet_callback_leads') || '[]');
      existing.unshift({
        id: `lead-${Date.now()}`,
        name: callbackName.trim(),
        phone: callbackPhone.trim(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('indrajeet_callback_leads', JSON.stringify(existing));
    } catch {}

    setCallbackSubmitted(true);
    setTimeout(() => {
      setCallbackSubmitted(false);
      setShowBookModal(false);
      setCallbackName('');
      setCallbackPhone('');
    }, 2500);
  };

  return (
    <div className="site">
      <Header />

      {/* ── Indrajeet Sir Hero Section ── */}
      <section id="top" className="indrajeet-hero-section">
        <div className="indrajeet-hero-container">
          {/* Left Column: Text Content & 5 Pillars */}
          <div className="indrajeet-hero-content">
            <h1 className="indrajeet-hero-title">
              {siteContent.heroHeading ? (
                siteContent.heroHeading.includes('right process') ? (
                  <>
                    {siteContent.heroHeading.split('right process')[0]}
                    right{' '}
                    <span className="hero-highlight-process">
                      process.
                      <svg className="hero-process-svg-stroke" viewBox="0 0 130 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 8.5C38 3.5 88 3.5 127.5 9" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </span>
                  </>
                ) : (
                  siteContent.heroHeading
                )
              ) : (
                <>
                  Every successful attempt begins with the right{' '}
                  <span className="hero-highlight-process">
                    process.
                    <svg className="hero-process-svg-stroke" viewBox="0 0 130 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 8.5C38 3.5 88 3.5 127.5 9" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle / Paragraph */}
            <p className="hero-structured-desc">
              {siteContent.heroSubheading || 'Keeping this in mind, Indrajeet Sir follows a structured, result-oriented approach built around five core pillars to make your preparation focused, strategic and effective.'}
            </p>

            {/* Direct CTAs matching requested visual style */}
            <div className="indrajeet-hero-actions">
              <Link href="/courses" className="hero-btn-explore-solid">
                Explore Batches &amp; Fees
              </Link>
              <button className="hero-btn-callback-link" onClick={() => setShowBookModal(true)}>
                <span>Request a callback</span>
                <span className="arrow-icon" aria-hidden="true">&rarr;</span>
              </button>
            </div>

            {/* Mentorship Philosophy Quote Card */}
            <div className="hero-philosophy-card">
              <div className="hero-philosophy-header">
                <div className="hero-philosophy-tag">
                  <span className="hero-philosophy-dot" />
                  <span>THE CORE PHILOSOPHY</span>
                </div>
                <span className="hero-philosophy-quote-mark">&ldquo;&rdquo;</span>
              </div>
              <p className="hero-philosophy-text">
                &ldquo;{siteContent.dhoniQuote}&rdquo;
              </p>
              <div className="hero-philosophy-author">
                <span>&mdash;</span>
                <span>{siteContent.dhoniAuthor || 'MS Dhoni'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mentor Portrait Card with Name Plate */}
          <div className="indrajeet-hero-visual">
            <div className="mentor-visual-card">
              <div className="mentor-visual-frame">
                <Image
                  src={siteContent.heroImage || '/indrajeet-sir-hero.jpg'}
                  alt="Indrajeet Sir - 1-on-1 Mentorship for UPSC CSE"
                  width={819}
                  height={1024}
                  priority
                  unoptimized={Boolean(siteContent.heroImage?.startsWith('data:') || siteContent.heroImage?.startsWith('http'))}
                  quality={95}
                  className="mentor-visual-img"
                />
                {/* Floating Seal & Badge */}
                <div className="mentor-floating-tag top-right">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                  <span>{siteContent.heroBadge || 'VisionIAS Faculty'}</span>
                </div>
              </div>

              {/* Mentor Name Plate Below Photo */}
              <div className="mentor-caption-plate">
                <span className="mentor-card-name">Indrajeet Sir</span>
                <span className="mentor-card-sub">UPSC CSE Mentor • VisionIAS Faculty</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── My Five Core Pillars (Stepped Architecture Layout) ── */}
        <div className="five-pillars-stepped-section">
          <div className="stepped-pillars-header">
            <h2 className="stepped-pillars-title">My Five Core Pillars</h2>
          </div>

          <div className="stepped-pillars-grid">
            {/* Step 1 */}
            <div className="stepped-pillar-column">
              <div className="stepped-pillar-card pillar-card-light step-1">
                <span className="stepped-pillar-num">01</span>
                <span className="stepped-pillar-label">{siteContent.heroPillar1 || '600+ Topic Short Notes'}</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="stepped-pillar-column">
              <div className="stepped-pillar-card pillar-card-light step-2">
                <span className="stepped-pillar-num">02</span>
                <span className="stepped-pillar-label">{siteContent.heroPillar2 || 'In-Depth PYQ Analysis'}</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="stepped-pillar-column">
              <div className="stepped-pillar-card pillar-card-light step-3">
                <span className="stepped-pillar-num">03</span>
                <span className="stepped-pillar-label">{siteContent.heroPillar3 || "Toppers' Copy Analysis"}</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="stepped-pillar-column">
              <div className="stepped-pillar-card pillar-card-light step-4">
                <span className="stepped-pillar-num">04</span>
                <span className="stepped-pillar-label">{siteContent.heroPillar4 || 'Answer Writing Skills'}</span>
              </div>
            </div>

            {/* Step 5 (Peak Active Pillar) */}
            <div className="stepped-pillar-column">
              <div className="stepped-pillar-card pillar-card-active step-5">
                <span className="stepped-pillar-num">05</span>
                <span className="stepped-pillar-label">{siteContent.heroPillar5 || 'One-to-One Personal Mentorship'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hero Section Divider Line ── */}
      <div className="hero-section-divider-wrap" aria-hidden="true">
        <div className="hero-section-divider-line" />
        <span className="hero-section-divider-badge">
          <i className="fa-solid fa-diamond" />
        </span>
      </div>

      {/* ── Dedicated Mobile Application Showcase Section ── */}
      <section id="download-app" className="section-wrap app-showcase-section">
        <div className="app-showcase-card">
          <div className="app-showcase-grid">
            {/* Left Content Column */}
            <div className="app-showcase-content">
              <h2 className="app-showcase-title">
                {siteContent.appTitle || 'Indrajeet Sir UPSC Mentorship App'}
              </h2>

              <p className="app-showcase-desc">
                Access your personalized UPSC CSE mentorship directly from your phone. Receive live classroom session alerts, submit Mains answer sheets for line-by-line checking, and download high-yield GS revision notes.
              </p>

              <div className="app-feature-list">
                <div className="app-feature-row">
                  <div className="app-feature-icon">
                    <i className="fa-solid fa-bell" aria-hidden="true" />
                  </div>
                  <div className="app-feature-body">
                    <strong>{siteContent.appBullet1Title || '10-Minute Live Class Reminders'}</strong>
                    <p>{siteContent.appBullet1Desc || 'Receive timely alerts before 1:1 strategy calls and batch masterclasses.'}</p>
                  </div>
                </div>

                <div className="app-feature-row">
                  <div className="app-feature-icon">
                    <i className="fa-solid fa-comments" aria-hidden="true" />
                  </div>
                  <div className="app-feature-body">
                    <strong>{siteContent.appBullet2Title || 'Direct Doubt & Copy Evaluation'}</strong>
                    <p>{siteContent.appBullet2Desc || 'Submit handwritten answer sheets and review personalized feedback from Indrajeet Sir.'}</p>
                  </div>
                </div>

                <div className="app-feature-row">
                  <div className="app-feature-icon">
                    <i className="fa-solid fa-file-pdf" aria-hidden="true" />
                  </div>
                  <div className="app-feature-body">
                    <strong>{siteContent.appBullet3Title || 'Offline GS Micro-Notes & Models'}</strong>
                    <p>{siteContent.appBullet3Desc || 'Download concise 1–2 page revision frameworks and model answer copies anytime.'}</p>
                  </div>
                </div>
              </div>

              <div className="app-download-area">
                <a
                  href={siteContent.appPlayStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-playstore-link"
                  title="Get it on Google Play"
                >
                  <Image
                    src="/google-play.svg"
                    alt="Get it on Google Play"
                    width={190}
                    height={56}
                    style={{ height: '52px', width: 'auto', display: 'block' }}
                  />
                </a>
                <div className="app-download-subtext">
                  <i className="fa-solid fa-shield-check" aria-hidden="true" />
                  <span>Verified Google Play Store App • Android 8.0 &amp; Above</span>
                </div>
              </div>
            </div>

            {/* Right Visual: Clean Phone Mockup */}
            <div className="app-showcase-visual">
              <div className="app-mockup-frame">
                {/* Speaker & Camera Bar */}
                <div className="app-mockup-header">
                  <div className="app-mockup-speaker" />
                  <div className="app-mockup-camera" />
                </div>

                {/* Clean Screen Interface */}
                <div className="app-mockup-screen">
                  {/* Status Bar */}
                  <div className="app-screen-status-bar">
                    <span className="screen-time">09:41</span>
                    <div className="screen-status-icons">
                      <i className="fa-solid fa-signal" />
                      <i className="fa-solid fa-wifi" />
                      <i className="fa-solid fa-battery-full" />
                    </div>
                  </div>

                  {/* App Bar */}
                  <div className="app-screen-topbar">
                    <div className="app-screen-brand">
                      <Image
                        src="/logo.png"
                        alt="Indrajeet Sir Logo"
                        width={30}
                        height={30}
                        style={{ borderRadius: '50%' }}
                      />
                      <div>
                        <div className="app-screen-title">Indrajeet Sir</div>
                        <div className="app-screen-sub">Mentorship Portal</div>
                      </div>
                    </div>
                    <span className="app-screen-status">LIVE</span>
                  </div>

                  {/* Active Live Class Card */}
                  <div className="app-screen-card">
                    <div className="app-screen-card-tag">TODAY&apos;S 1:1 STRATEGY CALL</div>
                    <div className="app-screen-card-title">GS Mains Answer Evaluation &amp; Strategy</div>
                    <div className="app-screen-card-time">
                      <i className="fa-regular fa-clock" /> 07:00 PM • Personalized Slot
                    </div>
                    <div className="app-screen-badge-join">
                      <i className="fa-solid fa-video" /> Join Live Classroom
                    </div>
                  </div>

                  {/* Copy Evaluation Notification */}
                  <div className="app-screen-eval-card">
                    <div className="eval-icon">
                      <i className="fa-solid fa-file-pdf" />
                    </div>
                    <div className="eval-details">
                      <div className="eval-title">GS2_Governance_Checked.pdf</div>
                      <div className="eval-meta">Evaluated with Sir&apos;s handwritten notes</div>
                    </div>
                  </div>

                  {/* Direct Mentorship Chat */}
                  <div className="app-screen-chat-preview">
                    <div className="app-screen-bubble mentor">
                      <span className="bubble-author">Indrajeet Sir</span>
                      <p>Your copy is evaluated. Structure is solid; we will review conclusions during our call.</p>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="app-screen-bottom-nav">
                    <span className="app-nav-icon active"><i className="fa-solid fa-house" /></span>
                    <span className="app-nav-icon"><i className="fa-solid fa-graduation-cap" /></span>
                    <span className="app-nav-icon"><i className="fa-solid fa-comments" /></span>
                    <span className="app-nav-icon"><i className="fa-solid fa-gear" /></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Callback Lead Banner (Instant Mentorship Lead Capture) ── */}
      <LeadBanner />

      {/* ── Social Media Channels (Dr. Shivin Style 3-Card Grid) ── */}
      <section id="contact" className="section-wrap social-channels-section">
        <div className="social-cards-grid">
          {/* Card 1: YouTube */}
          <a
            href="https://www.youtube.com/@indrajeetsir_upsc"
            target="_blank"
            rel="noopener noreferrer"
            className="social-hub-card"
          >
            <div className="social-hub-label">Subscribe to</div>
            <div className="social-hub-divider" />
            <div className="social-hub-body">
              <div className="social-hub-icon yt-icon">
                <i className="fa-brands fa-youtube" aria-hidden="true" />
              </div>
              <div className="social-hub-text">
                <strong>Indrajeet Sir UPSC</strong>
              </div>
            </div>
          </a>

          {/* Card 2: Instagram */}
          <a
            href="https://www.instagram.com/indrajeetsir_upsc"
            target="_blank"
            rel="noopener noreferrer"
            className="social-hub-card"
          >
            <div className="social-hub-label">Follow me on</div>
            <div className="social-hub-divider" />
            <div className="social-hub-body">
              <div className="social-hub-icon insta-icon">
                <i className="fa-brands fa-instagram" aria-hidden="true" />
              </div>
              <div className="social-hub-text">
                <strong>indrajeetsir_upsc</strong>
              </div>
            </div>
          </a>

          {/* Card 3: Telegram */}
          <a
            href={siteContent.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="social-hub-card"
          >
            <div className="social-hub-label">Join my Telegram community</div>
            <div className="social-hub-divider" />
            <div className="social-hub-body">
              <div className="social-hub-icon tg-icon">
                <i className="fa-brands fa-telegram" aria-hidden="true" />
              </div>
              <div className="social-hub-text">
                <strong>{siteContent.telegramHandle}</strong>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ── Modular Footer ── */}
      <Footer />

      {/* ── Floating WhatsApp Button ── */}
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

      {/* ── Direct Callback Modal ── */}
      {showBookModal && (
        <div className="modal-backdrop" onClick={() => setShowBookModal(false)}>
          <div className="modal-box checkout-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-modal-header">
              <div>
                <span className="checkout-badge-pill">
                  <i className="fa-solid fa-phone" aria-hidden="true" /> Priority Callback
                </span>
                <h3 className="checkout-course-title">
                  Request Callback from Indrajeet Sir&apos;s Desk
                </h3>
              </div>
              <button
                type="button"
                className="checkout-modal-close"
                onClick={() => setShowBookModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {callbackSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>✅</div>
                <h4 style={{ fontWeight: 800, color: '#16a34a', marginBottom: '0.4rem', fontSize: '1.2rem' }}>Request Received!</h4>
                <p style={{ fontSize: '0.92rem', color: '#64748b' }}>Our desk counselor will call you back shortly on <strong>{callbackPhone}</strong>.</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="checkout-form">
                <div className="checkout-field-group">
                  <label className="checkout-field-label">
                    Your Name <span className="req-star">*</span>
                  </label>
                  <div className="checkout-input-wrap">
                    <i className="fa-solid fa-user checkout-input-icon" aria-hidden="true" />
                    <input
                      type="text"
                      required
                      placeholder="Enter your full name"
                      value={callbackName}
                      onChange={(e) => setCallbackName(e.target.value)}
                      className="checkout-input"
                    />
                  </div>
                </div>

                <div className="checkout-field-group" style={{ marginBottom: '1.4rem' }}>
                  <label className="checkout-field-label">
                    Contact Phone / WhatsApp Number <span className="req-star">*</span>
                  </label>
                  <div className="checkout-input-wrap">
                    <i className="fa-solid fa-phone checkout-input-icon" aria-hidden="true" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      className="checkout-input"
                    />
                  </div>
                </div>

                <button type="submit" className="checkout-submit-btn">
                  <i className="fa-solid fa-paper-plane" aria-hidden="true" />
                  <span>Submit Callback Request</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
