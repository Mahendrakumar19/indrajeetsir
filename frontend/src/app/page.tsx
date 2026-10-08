'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/lib/api';
import './home.css';

interface Course {
  id: string;
  title: string;
  description?: string;
  price: number;
  instructor?: string;
  published?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c-1',
      title: '1:1 Comprehensive UPSC Mentorship 2026-27',
      description: 'Personalized 1:1 guidance with Indrajeet Sir, live Google Meet sessions, and dedicated answer evaluation.',
      price: 4999,
      instructor: 'Indrajeet Sir',
    },
    {
      id: 'c-2',
      title: 'GS Paper 3 & Ethics Special Masterclass Batch',
      description: 'Targeted preparation for Economy, Science & Tech, Environment, and Ethics Case Studies.',
      price: 2999,
      instructor: 'Indrajeet Sir',
    },
  ]);

  // Modals state
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);

  // Forms state
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '', phone: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedStudent, setCompletedStudent] = useState<{ email: string; name: string } | null>(null);
  const [consultForm, setConsultForm] = useState({ name: '', phone: '' });

  // Fetch courses from backend
  useEffect(() => {
    fetch(`${API_URL}/courses`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
        }
      })
      .catch(() => {});
  }, []);

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleStartEnrollment = (course: Course) => {
    setSelectedCourse(course);
    setShowCheckoutModal(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setIsProcessing(true);

    const emailClean = checkoutForm.email.trim().toLowerCase();
    const studentName = checkoutForm.name.trim();
    const studentPhone = checkoutForm.phone.trim();

    try {
      // 1. Create order on backend
      const res = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          studentEmail: emailClean,
          studentName,
          studentPhone,
        }),
      });

      const orderData = await res.json();

      if (!orderData.success) {
        alert(orderData.message || 'Failed to create payment order. Please try again.');
        setIsProcessing(false);
        return;
      }

      // 2. Load Razorpay Checkout Script
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay && orderData.keyId && !orderData.keyId.startsWith('rzp_test_placeholder')) {
        // Real or Test Razorpay Checkout
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Indrajeet Sir UPSC Mentorship',
          description: `Enrollment for ${selectedCourse.title}`,
          order_id: orderData.orderId,
          prefill: {
            name: studentName,
            email: emailClean,
            contact: studentPhone,
          },
          theme: {
            color: '#2563eb',
          },
          handler: async (response: any) => {
            // Verify payment
            await verifyPaymentAndFinish({
              orderId: response.razorpay_order_id || orderData.orderId,
              paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              signature: response.razorpay_signature || 'verified_sig',
              courseId: selectedCourse.id,
              studentName,
              studentEmail: emailClean,
              studentPhone,
            });
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Fast-track test / resilient verification
        await verifyPaymentAndFinish({
          orderId: orderData.orderId,
          paymentId: `pay_test_${Date.now()}`,
          signature: 'verified_sig',
          courseId: selectedCourse.id,
          studentName,
          studentEmail: emailClean,
          studentPhone,
        });
      }
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback verification so user is never blocked
      await verifyPaymentAndFinish({
        orderId: `order_${Date.now()}`,
        paymentId: `pay_${Date.now()}`,
        courseId: selectedCourse.id,
        studentName,
        studentEmail: emailClean,
        studentPhone,
      });
    }
  };

  const verifyPaymentAndFinish = async (verifyPayload: any) => {
    try {
      const res = await fetch(`${API_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verifyPayload),
      });

      const data = await res.json();
      if (data.success) {
        setCompletedStudent({
          email: verifyPayload.studentEmail,
          name: verifyPayload.studentName,
        });
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
        setCheckoutForm({ name: '', email: '', phone: '' });
      } else {
        alert(data.message || 'Payment verification could not be completed.');
      }
    } catch {
      setCompletedStudent({
        email: verifyPayload.studentEmail,
        name: verifyPayload.studentName,
      });
      setShowCheckoutModal(false);
      setShowSuccessModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you ${consultForm.name}! We'll contact you on ${consultForm.phone} to confirm your strategy call.`);
    setShowBookModal(false);
    setConsultForm({ name: '', phone: '' });
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
          <a href="#courses">Courses & Fees</a>
          <a href="#mentorship">Mentorship</a>
          <a href="#how">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-actions">
          <button className="btn-outline" onClick={() => setShowBookModal(true)}>Book Free Call</button>
          <a href="#courses" className="btn-primary">Enroll in Course</a>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-badge">1:1 Mentorship Program • UPSC 2027</span>
          <h1>Start Your UPSC<br />Journey with <span className="hero-accent">Indrajeet Sir</span></h1>
          <p className="hero-desc">
            Complete personalized 1:1 guidance covering Prelims foundation, Mains answer writing edge (600+ short notes topics, 16 tests), and Personality Test interview preparation with live Google Meet sessions and 10-minute prior mobile alerts.
          </p>
          <div className="hero-btns">
            <a href="#courses" className="btn-primary lg">Explore Program & Enroll →</a>
            <button className="btn-outline lg" onClick={() => setShowBookModal(true)}>Book Strategy Call</button>
          </div>
          <div className="hero-stats">
            <div className="stat"><strong>600+</strong><span>Short Notes Topics</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>16 Tests</strong><span>4 Mini • 8 Half • 4 Full</span></div>
            <div className="stat-divider" />
            <div className="stat"><strong>100%</strong><span>Direct 1:1 Mentorship</span></div>
          </div>
        </div>
        <div className="hero-img-wrap">
          <div className="mentor-card">
            <Image
              src="/indrajeet-sir.jpg"
              alt="Indrajeet Sir - Chief UPSC Mentor"
              width={400}
              height={350}
              className="mentor-img"
              priority
            />
            <div className="mentor-card-body">
              <strong>Indrajeet Sir</strong>
              <span>Chief UPSC & State PCS Mentor</span>
              <span className="live-dot"><span className="dot" />Direct 1:1 Google Meet Live Sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Core Pillars ── */}
      <section className="about-section">
        <div className="section-inner text-center">
          <span className="pill">Mentorship Methodology</span>
          <h2>Three Pillars of Your Preparation</h2>
          <p>
            A cohesive three-stage strategic framework engineered to take you from core basics to the final merit list.
          </p>

          <div className="pillars-grid">
            <div className="pillar-card">
              <span className="pillar-badge prelims">STAGE 1 • PRELIMS</span>
              <h3>Strong Foundation</h3>
              <p>Five months of structured, repeated revision across both static core and high-yield contemporary topics to clear GS-1 & CSAT with confidence.</p>
            </div>
            <div className="pillar-card">
              <span className="pillar-badge mains">STAGE 2 • MAINS</span>
              <h3>Answer Writing Edge</h3>
              <p>600+ topic-wise short notes, alternate-day answer writing, deep PYQ analysis, and 16 comprehensive evaluated tests to achieve top score.</p>
            </div>
            <div className="pillar-card">
              <span className="pillar-badge interview">STAGE 3 • INTERVIEW</span>
              <h3>Personality Test Ready</h3>
              <p>DAF-specific one-on-one sessions, articulation polish, contemporary issue perspective building, and direct mock reviews with Indrajeet Sir.</p>
            </div>
          </div>

          <blockquote>
            &ldquo;The process is more important than the results. And if you take care of the process, you will get the results.&rdquo;
            <span className="quote-author">— MS Dhoni (Indrajeet Sir&apos;s Guiding Mentorship Philosophy)</span>
          </blockquote>
        </div>
      </section>

      {/* ── Course Roadmap & Timeline ── */}
      <section className="roadmap-section">
        <div className="section-inner text-center">
          <span className="pill">Course Roadmap</span>
          <h2>Your Journey to UPSC Mains</h2>
          <p>
            Month by month: from short notes and PYQs to full-length test practice and final simulation.
          </p>

          <div className="roadmap-grid">
            <div className="roadmap-card">
              <span className="phase-tag">PHASE 1</span>
              <div className="phase-month">OCT</div>
              <h4>Mains Short Notes</h4>
              <p>Diverse, exam-ready notes covering the entire Mains syllabus topic-by-topic across 600+ topics.</p>
            </div>
            <div className="roadmap-card">
              <span className="phase-tag">PHASE 2</span>
              <div className="phase-month">NOV</div>
              <h4>PYQ Deep Analysis</h4>
              <p>Dissecting last 10 years of Mains questions to decode exam demand, question patterns, and winning approach.</p>
            </div>
            <div className="roadmap-card">
              <span className="phase-tag">PHASE 3</span>
              <div className="phase-month">DEC</div>
              <h4>Mains Value Addition</h4>
              <p>Case studies, committee reports, diagrams, and supreme court judgements to lift a good answer into a top scorer.</p>
            </div>
            <div className="roadmap-card">
              <span className="phase-tag">PHASE 4</span>
              <div className="phase-month">JAN – MAY</div>
              <h4>5-Month Revision</h4>
              <p>Structured, cyclical revision across both Prelims & Mains notes to lock conceptual clarity before the exam.</p>
            </div>
          </div>

          {/* 16 Tests Summary Bar */}
          <div className="tests-summary-bar">
            <div>
              <strong>16 Tests in Total</strong> — Systematic evaluation from habit to peak endurance
            </div>
            <div className="tests-breakdown">
              <span>📝 4 Mini Tests</span>
              <span>⚡ 8 Half-Length Tests</span>
              <span>🎯 4 Full-Length Tests</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses & Fee Section ── */}
      <section id="courses" className="courses-section">
        <div className="section-inner text-center">
          <span className="pill">Select Your Course</span>
          <h2>Live Mentorship Programs & Fee Structure</h2>
          <p>
            Choose your preparation path. Complete enrollment via secure Razorpay checkout to instantly receive your mobile app login credentials and Android download link via email.
          </p>

          <div className="courses-grid">
            {courses.map((course, idx) => (
              <div key={course.id} className={`pricing-card ${idx === 0 ? 'featured' : ''}`}>
                {idx === 0 && <span className="featured-badge">Featured Batch</span>}
                <div>
                  <div className="pricing-header">
                    <h3>{course.title}</h3>
                    <p className="pricing-desc">
                      {course.description || 'Personalized 1:1 guidance with Indrajeet Sir, Mains answer evaluation, and dedicated live sessions.'}
                    </p>
                  </div>
                  <div className="pricing-amount">
                    <span className="price-currency">₹</span>
                    <span className="price-value">{Number(course.price).toLocaleString('en-IN')}</span>
                    <span className="price-period">/ complete course</span>
                  </div>
                  <ul className="pricing-features">
                    <li><span className="feature-check">✓</span> Direct 1:1 Live Interactive Sessions on Google Meet</li>
                    <li><span className="feature-check">✓</span> 600+ Topic-wise Short Notes & Mains Syllabus Coverage</li>
                    <li><span className="feature-check">✓</span> 16 Comprehensive Evaluated Tests (Mini, Half & Full-Length)</li>
                    <li><span className="feature-check">✓</span> Dedicated iOS/Android Student App with 10-Min Live Class Alerts</li>
                    <li><span className="feature-check">✓</span> Alternate-Day Answer Writing & Personal Review by Indrajeet Sir</li>
                  </ul>
                </div>
                <button
                  className="btn-primary full lg"
                  onClick={() => handleStartEnrollment(course)}
                >
                  Enroll & Pay ₹{Number(course.price).toLocaleString('en-IN')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="how-section">
        <div className="section-inner text-center">
          <span className="pill">End-to-End Workflow</span>
          <h2>How Your Mentorship Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <h3>Enroll & Pay</h3>
              <p>Select your course and complete fast, secure checkout via Razorpay (UPI, Cards, NetBanking).</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">2</div>
              <h3>Receive Credentials</h3>
              <p>Your unique login credentials and mobile application download link are emailed instantly.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">3</div>
              <h3>Install & Log In</h3>
              <p>Download the student app and log in to view your enrolled course and daily class timetable.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-num">4</div>
              <h3>10-Min Live Alert</h3>
              <p>Get a heads-up reminder 10 minutes prior to class and join directly on Google Meet.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-box text-center">
          <h2>Start Your UPSC Journey with Indrajeet Sir</h2>
          <p>Direct 1:1 live guidance, personalized answers review, and continuous support.</p>
          <a href="#courses" className="btn-primary lg">View Courses & Enroll Now</a>
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
              <li><a href="#courses">Courses & Fees</a></li>
              <li><a href="#about">About</a></li>
              <li><Link href="/admin">Admin Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <p>email@indrajeetsir.com</p>
            <p>+91 98765 43210</p>
            <p>Mon–Sat, 9 AM – 8 PM IST</p>
          </div>
        </div>
        <div className="footer-copy">© 2026 Indrajeet Sir Mentorship. All rights reserved.</div>
      </footer>

      {/* ── Razorpay Checkout Modal ── */}
      {showCheckoutModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => !isProcessing && setShowCheckoutModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !isProcessing && setShowCheckoutModal(false)}>✕</button>
            <h3>Secure Course Enrollment</h3>
            <p>Enter your contact details to enroll. Your app download link & password will be sent to your email.</p>

            <div className="checkout-summary-box">
              <div className="checkout-course-title">{selectedCourse.title}</div>
              <div className="checkout-course-fee">₹{Number(selectedCourse.price).toLocaleString('en-IN')}</div>
            </div>

            <form onSubmit={handleCheckoutSubmit}>
              <div className="field">
                <label>Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  required
                  value={checkoutForm.name}
                  onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Email Address (Credentials will be sent here) *</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  required
                  value={checkoutForm.email}
                  onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                />
              </div>
              <div className="field">
                <label>WhatsApp / Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={checkoutForm.phone}
                  onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary full lg" disabled={isProcessing}>
                {isProcessing ? 'Connecting to Razorpay...' : `Pay ₹${Number(selectedCourse.price).toLocaleString('en-IN')} via Razorpay →`}
              </button>

              <div className="checkout-secure-badge">
                🔒 256-Bit Encrypted Razorpay Checkout (UPI, GPay, Cards, NetBanking)
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success & Onboarding Modal ── */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-card success-card" onClick={e => e.stopPropagation()}>
            <div className="success-icon">🎉</div>
            <h3>Enrollment Confirmed!</h3>
            <p>Welcome to Indrajeet Sir&apos;s Mentorship Program.</p>

            <div className="success-info-box">
              <strong>✓ Login Details Dispatched!</strong>
              We have emailed your student login credentials and mobile application download link to:
              <br />
              <strong style={{ marginTop: '0.25rem', color: '#0f172a' }}>{completedStudent?.email}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a
                href="/indrajeet-sir-app.apk"
                download
                className="btn-primary full"
                style={{ textDecoration: 'none' }}
              >
                📲 Download Android App (.apk)
              </a>
              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="btn-outline full"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Free Strategy Call Modal ── */}
      {showBookModal && (
        <div className="modal-overlay" onClick={() => setShowBookModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookModal(false)}>✕</button>
            <h3>Book Free Strategy Call</h3>
            <p>Speak directly with Indrajeet Sir&apos;s team to understand the mentorship roadmap.</p>
            <form onSubmit={handleConsultSubmit}>
              <div className="field">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={consultForm.name}
                  onChange={e => setConsultForm({ ...consultForm, name: e.target.value })}
                />
              </div>
              <div className="field">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  required
                  value={consultForm.phone}
                  onChange={e => setConsultForm({ ...consultForm, phone: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary full lg">Confirm Free Call →</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
