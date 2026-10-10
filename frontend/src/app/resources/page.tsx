'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import '../resources.css';

interface Article {
  id: string;
  title: string;
  category: 'mains' | 'prelims' | 'mentorship' | 'ethics' | 'optional';
  categoryLabel: string;
  readTime: string;
  excerpt: string;
  keyPoints: string[];
}

const ARTICLES: Article[] = [
  {
    id: 'mains-answer-structuring',
    title: 'The 4-Tier Answer Structure: How to Score 110+ in UPSC GS Mains Papers',
    category: 'mains',
    categoryLabel: 'Mains Answer Writing',
    readTime: '6 min read',
    excerpt: 'Examiners spend under 3 minutes per copy. Discover how to hook evaluators with concise contextual introductions, hub-and-spoke flowchart representations, and constitutional/NITI Aayog value-additions.',
    keyPoints: [
      '3-line context introduction using authoritative reports or Articles',
      'Categorized body arguments (Social, Economic, Administrative)',
      'Clean hub-and-spoke diagrams to break textual monotony',
      'Forward-looking conclusion linked with SDG 2030 or Vision 2047'
    ]
  },
  {
    id: '1-to-1-vs-large-batch',
    title: 'Why 1:1 Mentorship Beats 500-Student Batch Coachings in UPSC CSE',
    category: 'mentorship',
    categoryLabel: '1:1 Mentorship Insights',
    readTime: '5 min read',
    excerpt: 'Mass classroom lectures provide generic syllabus coverage but fail to address candidate-specific blind spots. Learn how diagnostic answer evaluations and personalized strategy calls shave years off preparation.',
    keyPoints: [
      'Tailored timeline calibrated to your optional subject & attempt year',
      'Uncompromising line-by-line critique of handwritten answer copies',
      'Direct psychological clarity and accountability with Indrajeet Sir',
      'No wasted commute or passive 3-hour theoretical lectures'
    ]
  },
  {
    id: 'upsc-preparation-timeline',
    title: 'UPSC 2026-27 Timeline: When to Transition from Foundation to Intensive Answer Writing',
    category: 'prelims',
    categoryLabel: 'Preparation Roadmap',
    readTime: '7 min read',
    excerpt: 'A month-by-month blueprint for aspirants targeting UPSC CSE 2026-27. Balance static NCERT mastery with daily answer writing before shifting into high-gear Prelims test series testing.',
    keyPoints: [
      'Phase 1: Comprehensive syllabus mapping & Optional completion',
      'Phase 2: Intensive 16-test full Mains answer evaluation sprint',
      'Phase 3: Prelims objective elimination mastery & 50+ mock tests',
      'Phase 4: Final 60-day rapid revision & Current Affairs compilation'
    ]
  },
  {
    id: 'ethics-case-studies',
    title: 'Cracking GS-4 Ethics Case Studies: The 5-Step Administrative Decision Matrix',
    category: 'ethics',
    categoryLabel: 'Ethics & Essay',
    readTime: '6 min read',
    excerpt: 'Case studies carry 120 marks in GS-4. Avoid emotional responses by structuring solutions through stakeholder matrices, constitutional values, and administratively viable courses of action.',
    keyPoints: [
      'Exhaustive stakeholder mapping (direct, indirect, public interest)',
      'Explicit articulation of conflicting ethical dilemmas',
      'Evaluating 3 practical courses of action with pros and cons',
      'Justifying the selected pathway using Nolan Committee principles'
    ]
  },
  {
    id: 'daily-answer-writing-routine',
    title: 'Daily Answer Writing: Why 2 Evaluated Answers are 10x Better Than 20 Unevaluated Ones',
    category: 'mains',
    categoryLabel: 'Mains Answer Writing',
    readTime: '4 min read',
    excerpt: 'Writing without qualitative feedback reinforces flawed writing habits. Understand why a disciplined 2-question daily cycle with mentor evaluation transforms score trajectory.',
    keyPoints: [
      'Immediate identification of word count overshoot & tangential deviations',
      'Learning micro-diagramming to convey complex concepts in 10 seconds',
      'Feedback loop: Re-writing the evaluated answer incorporates corrections',
      'Building muscle memory for 3-hour exam pressure'
    ]
  },
  {
    id: 'pub-ad-optional-strategy',
    title: 'Public Administration Optional Strategy: Maximizing Synergy with GS-2 Governance',
    category: 'optional',
    categoryLabel: 'Optional Subject',
    readTime: '5 min read',
    excerpt: 'Explore why Public Administration remains one of the highest ROI optionals. Leverage administrative thinkers and dynamic contemporary governance cases to score 300+ in Paper 1 and 2.',
    keyPoints: [
      'Paper 1 theoretical framework integration into Paper 2 Indian administration',
      'Over 60% direct syllabus overlap with GS Paper 2 (Governance & Constitution)',
      'Citing 2nd ARC recommendations and NITI Aayog action agendas',
      'Answer writing techniques specifically tailored for Pub Ad evaluators'
    ]
  }
];

const FAQS = [
  {
    question: 'How does 1:1 Mentorship with Indrajeet Sir work?',
    answer: 'Every enrolled aspirant undergoes an initial diagnostic session where their current preparation stage, strengths, and optional subject are mapped. You receive customized weekly targets, attend live Google Meet sessions directly with Sir, and submit handwritten Mains answers through the mobile app for detailed line-by-line evaluation.'
  },
  {
    question: 'How are Mains handwritten answer copies evaluated?',
    answer: 'Students upload clear photos/PDFs of their handwritten answer sheets through the Indrajeet Sir UPSC mobile app. Indrajeet Sir directly reviews the copy, assessing question comprehension, content density, sub-heading organization, diagrammatic representation, and conclusion. Evaluated copies with marks and specific voice/text annotations are returned via the app.'
  },
  {
    question: 'What is the fee and enrollment procedure?',
    answer: 'Aspirants can choose from our 1:1 Comprehensive Mentorship (₹4,999) or Mains Intensive Answer Writing Program (₹3,499). Payment is securely completed via Razorpay on this portal. Upon enrollment, login credentials and mobile app download instructions are immediately dispatched to your registered email.'
  },
  {
    question: 'Can working professionals prepare effectively through this program?',
    answer: 'Yes! Over 35% of Indrajeet Sir\'s mentored aspirants are working professionals or college seniors. 1:1 sessions and live classes are scheduled during convenient morning/evening slots, and session recordings are accessible on-demand within the mobile app.'
  },
  {
    question: 'Where can I download the Indrajeet Sir UPSC mobile app?',
    answer: 'The official Android mobile app ("Indrajeet Sir UPSC") is available for enrolled students. You can install the official APK or download directly via the Google Play Store package (com.nighwantech.indrajeetsir). Login is exclusive to enrolled aspirants.'
  }
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredArticles = activeCategory === 'all'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === activeCategory);

  return (
    <div className="resources-page">
      {/* Navigation */}
      <nav className="legal-nav-bar">
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <Image
            src="/logo.png"
            alt="Indrajeet Sir Logo"
            width={38}
            height={38}
            style={{ borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #2563eb' }}
          />
          <div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', lineHeight: 1.1 }}>Indrajeet Sir</div>
            <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>IAS Mentorship</div>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/#courses" style={{ color: '#4b5563', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            Courses & Fees
          </Link>
          <Link href="/" className="back-link">
            ← Home
          </Link>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="resources-hero">
        <span className="resources-hero-badge">📚 Knowledge & Strategy Hub</span>
        <h1>UPSC Mentorship Guides, Strategy & Answer Writing Blueprint</h1>
        <p>
          Authoritative articles, battle-tested Mains frameworks, and preparation roadmaps curated by Indrajeet Sir to give serious aspirants an unfair analytical edge.
        </p>

        {/* Category Filter Tabs */}
        <div className="filter-tabs-wrapper">
          <button
            className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Guides ({ARTICLES.length})
          </button>
          <button
            className={`filter-tab ${activeCategory === 'mains' ? 'active' : ''}`}
            onClick={() => setActiveCategory('mains')}
          >
            Mains Answer Writing
          </button>
          <button
            className={`filter-tab ${activeCategory === 'mentorship' ? 'active' : ''}`}
            onClick={() => setActiveCategory('mentorship')}
          >
            1:1 Mentorship
          </button>
          <button
            className={`filter-tab ${activeCategory === 'prelims' ? 'active' : ''}`}
            onClick={() => setActiveCategory('prelims')}
          >
            Roadmap 2026-27
          </button>
          <button
            className={`filter-tab ${activeCategory === 'ethics' ? 'active' : ''}`}
            onClick={() => setActiveCategory('ethics')}
          >
            Ethics GS-4
          </button>
          <button
            className={`filter-tab ${activeCategory === 'optional' ? 'active' : ''}`}
            onClick={() => setActiveCategory('optional')}
          >
            Public Administration
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="resources-container">
        {/* Articles Grid */}
        <div className="articles-grid">
          {filteredArticles.map(article => (
            <article key={article.id} className="article-card">
              <div className="article-meta">
                <span className="article-category">{article.categoryLabel}</span>
                <span className="article-read-time">{article.readTime}</span>
              </div>
              <h2 className="article-title">{article.title}</h2>
              <p className="article-excerpt">{article.excerpt}</p>

              <div className="article-key-points">
                <div className="article-key-points-title">Key Strategic Takeaways:</div>
                <ul>
                  {article.keyPoints.map((point, idx) => (
                    <li key={idx}>
                      <span style={{ color: '#2563eb', fontWeight: 'bold' }}>✓</span> {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="article-footer">
                <div className="article-author">
                  <Image
                    src="/logo.png"
                    alt="Indrajeet Sir"
                    width={32}
                    height={32}
                    className="author-avatar"
                  />
                  <div className="author-info">
                    <div className="author-name">Indrajeet Sir</div>
                    <div className="author-role">Lead UPSC Mentor</div>
                  </div>
                </div>
                <Link
                  href="/#courses"
                  style={{
                    color: '#2563eb',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  Join Mentorship →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* FAQ Accordion Section for SEO & Customer Inquiries */}
        <section className="faq-section" id="faqs">
          <div className="faq-header">
            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Got Questions?
            </span>
            <h2>Frequently Asked Questions</h2>
            <p>Direct answers to questions aspirants frequently ask before enrolling in 1:1 mentorship.</p>
          </div>

          <div className="faq-list">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-icon" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* High-Converting CTA Banner */}
        <section className="resources-cta-banner">
          <h2>Ready to Transform Your UPSC Preparation?</h2>
          <p>
            Join Indrajeet Sir&apos;s exclusive 1:1 mentorship batch. Limited seats to ensure personalized diagnostic evaluation for every candidate.
          </p>
          <div className="resources-cta-buttons">
            <Link href="/#courses" className="btn-white">
              View Mentorship Programs & Enroll
            </Link>
            <a href="tel:+919873486158" className="btn-ghost-white">
              📞 Call Desk: +91 98734 86158
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '2.5rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', background: '#f8fafc' }}>
        <p style={{ marginBottom: '0.5rem' }}>
          © 2026 Indrajeet Sir IAS Mentorship. All rights reserved.
        </p>
        <div>
          <Link href="/privacy" style={{ color: '#2563eb', margin: '0 0.5rem' }}>Privacy Policy</Link> •
          <Link href="/terms" style={{ color: '#2563eb', margin: '0 0.5rem' }}>Terms of Service</Link> •
          <Link href="/disclaimer" style={{ color: '#2563eb', margin: '0 0.5rem' }}>Disclaimers & Cookies</Link>
        </div>
      </footer>
    </div>
  );
}
