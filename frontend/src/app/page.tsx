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
    heroHeading: 'Every exam has a process, and keeping that in mind, we have designed a structured methodology built on 5 core pillars:',
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
          if (parsed.heroHeading && parsed.heroHeading.includes('Sabhi exam ka ek process')) {
            delete parsed.heroHeading;
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
              {siteContent.heroHeading}
            </h1>

            {/* 5 Core Process Pillars Strip */}
            <div className="process-pillars-strip">
              <div className="process-pillar-item">
                <i className="fa-solid fa-file-lines" aria-hidden="true" />
                <span>{siteContent.heroPillar1}</span>
              </div>
              <div className="process-pillar-item">
                <i className="fa-solid fa-chart-line" aria-hidden="true" />
                <span>{siteContent.heroPillar2}</span>
              </div>
              <div className="process-pillar-item">
                <i className="fa-solid fa-award" aria-hidden="true" />
                <span>{siteContent.heroPillar3}</span>
              </div>
              <div className="process-pillar-item">
                <i className="fa-solid fa-pen-nib" aria-hidden="true" />
                <span>{siteContent.heroPillar4}</span>
              </div>
              <div className="process-pillar-item">
                <i className="fa-solid fa-user-graduate" aria-hidden="true" />
                <span>{siteContent.heroPillar5}</span>
              </div>
            </div>

            {/* Direct CTAs */}
            <div className="indrajeet-hero-actions">
              <Link href="/courses" className="btn-primary lg">
                <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.55rem' }} aria-hidden="true" />
                <span>Explore Batches &amp; Fees</span>
              </Link>
              <button className="btn-outline lg" onClick={() => setShowBookModal(true)}>
                <i className="fa-solid fa-phone" style={{ marginRight: '0.55rem' }} aria-hidden="true" />
                <span>Request Direct Callback</span>
              </button>
            </div>

            {/* Mentorship Philosophy Quote */}
            <div className="hero-dhoni-quote-wrap">
              <p className="hero-dhoni-quote-text">
                &ldquo;{siteContent.dhoniQuote}&rdquo;
              </p>
              <div className="hero-dhoni-quote-footer">
                <span className="quote-author-name">— {siteContent.dhoniAuthor}</span>
                <span className="quote-author-divider">•</span>
                <span className="quote-author-tag">{siteContent.dhoniTag}</span>
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
      </section>

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
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Request Callback from Indrajeet Sir&apos;s Desk
              </h3>
              <button
                type="button"
                onClick={() => setShowBookModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.4rem', color: '#64748b', cursor: 'pointer' }}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {callbackSubmitted ? (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.6rem' }}>✅</div>
                <h4 style={{ fontWeight: 800, color: '#16a34a', marginBottom: '0.4rem' }}>Request Received!</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Our desk counselor will call you back shortly on {callbackPhone}.</p>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit}>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={callbackName}
                    onChange={(e) => setCallbackName(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.4rem' }}>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
                    Contact Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={callbackPhone}
                    onChange={(e) => setCallbackPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.7rem 0.9rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem' }}
                  />
                </div>

                <button type="submit" className="btn-primary full lg" style={{ justifyContent: 'center' }}>
                  <i className="fa-solid fa-phone" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
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
