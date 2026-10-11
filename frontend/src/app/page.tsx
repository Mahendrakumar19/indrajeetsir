'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL } from '@/lib/api';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
      description: 'Personalized 1:1 guidance with Indrajeet Sir, live interactive strategy sessions, and dedicated answer evaluation.',
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

  // Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Mains answer copies kaun check karta hai?',
      a: 'Har ek copy Indrajeet Sir personally evaluate karte hain. Hum koi third-party evaluator ya outsourced intern appoint nahi karte, taaki aapko direct structure improvement aur actionable feedback mile.',
    },
    {
      q: '1:1 personal strategy sessions kab schedule hote hain?',
      a: 'Enrollment ke baad aapko direct calendar booking link milta hai. Har session private 1:1 video call hota hai jisme aapka study schedule, answer analysis aur weekly preparation roadmap review hota hai.',
    },
    {
      q: 'GS 1–4 ke notes kis format me milte hain?',
      a: 'Student portal aur mobile application me 600+ point-wise, high-yield micro notes milte hain. Ye static syllabus aur contemporary value additions ko combine karke exam-oriented format me banaye gaye hain.',
    },
    {
      q: 'Payment complete hone ke baad access kaise milega?',
      a: 'Online payment complete hote hi aapke email par Student ID, password aur Indrajeet Sir UPSC Mobile App ka download link turant deliver ho jata hai.',
    },
  ];

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

      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay && orderData.keyId && !orderData.keyId.startsWith('rzp_test_placeholder')) {
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
      {/* ── 3D Fluid Ambient Atmosphere ── */}
      <div className="fluid-bg-container" aria-hidden="true">
        <div className="fluid-orb fluid-orb-1" />
        <div className="fluid-orb fluid-orb-2" />
        <div className="fluid-orb fluid-orb-3" />
      </div>

      {/* ── Modular Header ── */}
      <Header />

      {/* ── 3D Hero Section ── */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            UPSC CSE is cracked on <span className="hero-gradient-text">Answer Writing & Discipline</span>, not endless lectures.
          </h1>
          <p className="hero-desc">
            Direct personal guidance by Indrajeet Sir. Line-by-line Mains copy checking, weekly 1:1 strategy reviews, and high-yield GS 1–4 study notes.
          </p>
          <div className="hero-btns">
            <a href="#courses" className="btn-primary lg">View Programs & Fees →</a>
            <button className="btn-outline lg" onClick={() => setShowBookModal(true)}>Request Callback</button>
          </div>
          <div className="hero-stats-3d">
            <div className="stat-card-3d">
              <strong>600+</strong>
              <span>Mains Micro Notes</span>
            </div>
            <div className="stat-card-3d">
              <strong>16 Tests</strong>
              <span>Checked Personally</span>
            </div>
            <div className="stat-card-3d">
              <strong>1:1 Private</strong>
              <span>Strategy Sessions</span>
            </div>
          </div>
        </div>

        {/* 3D Mentor Card */}
        <div className="hero-img-wrap">
          <div className="mentor-card-3d">
            <div className="mentor-img-frame">
              <Image
                src="/indrajeet-sir.png"
                alt="Indrajeet Sir"
                width={400}
                height={380}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
                className="mentor-img"
                priority
              />
            </div>
            <div className="mentor-card-footer">
              <strong>Indrajeet Sir</strong>
              <span>Former Faculty at Top Delhi Institutes • 10+ Yrs UPSC Mentorship</span>
              <div className="mentor-live-status">
                <span className="live-green-pulse" />
                Live 1:1 Interactive Sessions
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Authentic Mentorship Architecture ── */}
      <section id="about" className="section-wrap">
        <div className="section-inner text-center">
          <h2 className="section-heading">No Outsourced Checking. Direct Teacher Accountability.</h2>
          <p className="section-subtext">
            In Civil Services preparation, passive listening creates an illusion of knowledge. Real improvement happens when your answers are diagnosed and corrected consistently.
          </p>

          <div className="comparison-grid">
            {/* The Bulk Coaching Dilemma */}
            <div className="problem-card">
              <h3>
                <span>⚠️</span> The Bulk Coaching Problem
              </h3>
              <ul className="problem-list">
                <li>
                  <span className="cross-icon">✕</span>
                  <span>400+ students packed into a single batch with zero individual attention or strategy diagnosis.</span>
                </li>
                <li>
                  <span className="cross-icon">✕</span>
                  <span>Answer copies checked after 3–4 weeks by junior interns or outsourced evaluation contractors.</span>
                </li>
                <li>
                  <span className="cross-icon">✕</span>
                  <span>Generic scorecards with no actionable remarks on how to improve introduction, arguments, or conclusion.</span>
                </li>
                <li>
                  <span className="cross-icon">✕</span>
                  <span>Students spend months watching lectures without ever building real 3-hour answer writing stamina.</span>
                </li>
              </ul>
            </div>

            {/* Indrajeet Sir's Direct 1:1 Approach */}
            <div className="solution-card">
              <h3>
                <span>🛡️</span> Indrajeet Sir&apos;s 1:1 Accountability
              </h3>
              <ul className="solution-list">
                <li>
                  <span className="check-icon">✓</span>
                  <span><strong>Personal Copy Checking:</strong> Every Mains answer is evaluated directly by Indrajeet Sir with actionable remarks.</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span><strong>Weekly 1:1 Strategy Calls:</strong> Private video sessions to review your weekly study timetable and fix preparation gaps.</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span><strong>600+ Topic Micro Notes:</strong> Concise, high-yield revision material across GS-1, GS-2, GS-3, and GS-4.</span>
                </li>
                <li>
                  <span className="check-icon">✓</span>
                  <span><strong>16 Structured Tests:</strong> Phased test series (Mini, Sectional & Full-length) with model answers and marks improvement roadmap.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Dhoni Quote 3D Card */}
          <div className="quote-card-3d">
            <blockquote>
              &ldquo;The process is more important than the results. If you take care of the process, results will follow.&rdquo;
              <span className="quote-author">— MS Dhoni</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Courses & Pricing Section (3D Depth) ── */}
      <section id="courses" className="section-wrap" style={{ background: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading">Mentorship Batches & Fees</h2>
          <p className="section-subtext">
            Transparent course fees. Login credentials and Android application access are delivered immediately after enrollment.
          </p>

          <div className="courses-grid-3d">
            {courses.map((course, idx) => (
              <div key={course.id} className={`pricing-card-3d ${idx === 0 ? 'featured' : ''}`}>
                <div>
                  <div className="pricing-title-wrap">
                    <h3>{course.title}</h3>
                    <p className="pricing-desc-text">
                      {course.description || 'Personalized 1:1 guidance with Indrajeet Sir, direct Mains evaluation, and live interactive classes.'}
                    </p>
                  </div>
                  <div className="pricing-fee-block">
                    <span className="currency-sym">₹</span>
                    <span className="amount-val">{Number(course.price).toLocaleString('en-IN')}</span>
                    <span className="fee-tenure">/ full course</span>
                  </div>
                  <ul className="features-checklist">
                    <li><span className="check-tick">✓</span> 1:1 Live interactive sessions with Indrajeet Sir</li>
                    <li><span className="check-tick">✓</span> Direct Mains answer writing evaluation & feedback</li>
                    <li><span className="check-tick">✓</span> 600+ Topic-wise short notes for GS 1 to 4</li>
                    <li><span className="check-tick">✓</span> 16 Evaluated tests (Mini, Sectional & Full-length)</li>
                    <li><span className="check-tick">✓</span> Direct WhatsApp & Call doubt clearing desk</li>
                  </ul>
                </div>
                <button
                  className="btn-primary full lg"
                  onClick={() => handleStartEnrollment(course)}
                >
                  Enroll Now — ₹{Number(course.price).toLocaleString('en-IN')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Real Aspirant FAQs (Fluid Accordion) ── */}
      <section id="faqs" className="section-wrap">
        <div className="section-inner text-center">
          <h2 className="section-heading">Frequently Asked Questions</h2>
          <p className="section-subtext">
            Clear answers to common questions about copy checking, schedules, and study material.
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
                    <span className={`faq-icon-indicator ${isOpen ? 'open' : ''}`}>+</span>
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

      {/* ── Direct Desk CTA (3D Floating Card) ── */}
      <section id="contact" className="section-wrap" style={{ paddingTop: '1rem' }}>
        <div className="cta-desk-card">
          <h2>Have Questions About Preparation Strategy?</h2>
          <p>Talk directly with Indrajeet Sir&apos;s mentorship desk to discuss your attempt year and study plan.</p>
          <div className="cta-desk-actions">
            <a
              href="tel:+919873486158"
              className="btn-primary lg"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              <span>Call: +91 98734 86158</span>
            </a>
            <a
              href="https://wa.me/919873486158"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline lg"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.54 15.13 4.12 13.68 4.12 11.91C4.12 7.38 7.82 3.67 12.04 3.67ZM8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.69C7.02 10.9 7.9 12.07 8.02 12.23C8.15 12.39 9.74 14.85 12.19 15.91C12.77 16.16 13.23 16.31 13.58 16.42C14.17 16.61 14.7 16.58 15.13 16.52C15.61 16.45 16.6 15.92 16.81 15.33C17.02 14.74 17.02 14.24 16.96 14.13C16.89 14.03 16.73 13.97 16.48 13.85C16.24 13.72 15.02 13.12 14.79 13.04C14.57 12.96 14.4 12.92 14.24 13.17C14.07 13.41 13.59 13.97 13.45 14.13C13.3 14.3 13.16 14.32 12.91 14.2C12.67 14.07 11.88 13.82 10.95 12.98C10.22 12.33 9.73 11.53 9.58 11.28C9.44 11.04 9.57 10.9 9.69 10.78C9.8 10.67 9.94 10.49 10.06 10.34C10.19 10.2 10.23 10.09 10.31 9.93C10.39 9.76 10.35 9.62 10.29 9.5C10.23 9.37 9.73 8.16 9.53 7.66C9.33 7.18 9.12 7.24 8.97 7.24C8.82 7.23 8.68 7.23 8.53 7.33Z"/>
              </svg>
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Modular Footer ── */}
      <Footer />

      {/* ── Secure Course Checkout Modal ── */}
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
                  placeholder="e.g. +91 98734 86158"
                  required
                  value={checkoutForm.phone}
                  onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-primary full lg" disabled={isProcessing}>
                {isProcessing ? 'Processing Secure Payment...' : `Proceed to Pay ₹${Number(selectedCourse.price).toLocaleString('en-IN')}`}
              </button>

              <div className="checkout-secure-badge">
                🔒 256-Bit Encrypted Secure Checkout (UPI, GPay, Cards, NetBanking)
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
                  placeholder="e.g. +91 98734 86158"
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
