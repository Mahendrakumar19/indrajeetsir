'use client';

import { useState } from 'react';
import './home.css';

export default function Home() {
  const [showBookModal, setShowBookModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${form.name}! We'll contact you on ${form.phone} to confirm your slot.`);
    setShowBookModal(false);
    setForm({ name: '', phone: '' });
  };

  return (
    <div className="site">
      {/* ── Navbar ── */}
      <header className="navbar">
        <div className="nav-brand">
          <span className="nav-flag">🇮🇳</span>
          <div>
            <div className="nav-title">Indrajeet Sir</div>
            <div className="nav-sub">UPSC & State PCS Mentorship</div>
          </div>
        </div>
        <nav className="nav-links">
          <a href="#about">About</a>
          <a href="#mentorship">Mentorship</a>
          <a href="#how">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-actions">
          <a href="/login" className="btn-outline">Student Login</a>
          <button className="btn-primary" onClick={() => setShowBookModal(true)}>Book Free Call</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">10+ Years Teaching Experience</span>
          <h1>Start Your UPSC<br />Journey with <span className="hero-accent">Indrajeet Sir</span></h1>
          <p className="hero-desc">
            Benefit from 10 years of expert UPSC mentorship tailored for your success. Direct 1:1 live sessions, custom study roadmaps, and personal guidance.
          </p>
          <div className="hero-btns">
            <button className="btn-primary lg" onClick={() => setShowBookModal(true)}>Start Now →</button>
            <a href="#mentorship" className="btn-outline lg">Explore Mentorship</a>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>1,200+</strong><span>Students Mentored</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>10+ Yrs</strong><span>Teaching Experience</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>100%</strong><span>Personalised Guidance</span></div>
          </div>
        </div>
        <div className="hero-img-wrap">
          <div className="mentor-card">
            <img
              src="/indrajeet-sir.png"
              alt="Indrajeet Sir"
              className="mentor-img"
            />
            <div className="mentor-card-body">
              <strong>Indrajeet Sir</strong>
              <span>Founder & Chief UPSC Mentor</span>
              <span className="live-dot"><span className="dot" />Available for 1:1 Sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── About Indrajeet ── */}
      <section id="about" className="about-section">
        <div className="section-inner">
          <span className="pill">About Indrajeet Sir</span>
          <h2>Your Dedicated UPSC & State PCS Mentor</h2>
          <blockquote className="quote-box">
            "UPSC is not about reading 100 books. It's about reading the right books with the right strategy — guided personally."
          </blockquote>
          <p>
            With a decade of guiding UPSC aspirants, Indrajeet Sir blends experience and insight to help you navigate your path to success.
            Every student receives custom strategic roadmaps, doubt resolution, and direct 1:1 live guidance.
          </p>
          <button className="btn-primary" onClick={() => setShowBookModal(true)}>Book Strategy Call →</button>
        </div>
      </section>

      {/* ── Mentorship & Services ── */}
      <section id="mentorship" className="how-section">
        <div className="section-inner text-center">
          <span className="pill">Mentorship Programs</span>
          <h2>What We Offer</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>UPSC Mentorship</h3>
              <p>Personalised guidance from Indrajeet Sir to navigate the UPSC journey with confidence and clarity.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>State PCS Help</h3>
              <p>Focused strategies tailored for State PCS exams to boost your preparation effectively.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>1:1 Live Classes</h3>
              <p>Join your scheduled live interactive mentorship sessions directly from your student dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box text-center">
          <h2>Start Your UPSC Journey with Indrajeet Sir</h2>
          <p>Limited slots available for 1:1 mentorship. Schedule your free strategy call today.</p>
          <button className="btn-primary lg" onClick={() => setShowBookModal(true)}>Book Free 1:1 Call</button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="footer">
        <div className="footer-grid">
          <div>
            <div className="nav-title">Indrajeet Sir</div>
            <p className="footer-desc">Expert UPSC & State PCS Mentorship with 10 years of dedicated teaching experience.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#mentorship">Mentorship</a></li>
              <li><a href="/login">Student Login</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <p>email@indrajeetsir.com</p>
            <p>+91 98765 43210</p>
            <p>Mon–Sat, 9 AM – 8 PM IST</p>
          </div>
        </div>
        <div className="footer-copy">© 2026 Indrajeet Sir. All rights reserved.</div>
      </footer>

      {/* ── Booking Modal ── */}
      {showBookModal && (
        <div className="modal-overlay" onClick={() => setShowBookModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookModal(false)}>✕</button>
            <h3>Book Free 1:1 Strategy Call</h3>
            <p>We'll contact you within 24 hours to confirm your slot with Indrajeet Sir.</p>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Your Full Name</label>
                <input type="text" required placeholder="e.g. Rahul Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label>WhatsApp Number</label>
                <input type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button type="submit" className="btn-primary full">Confirm My Slot</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
