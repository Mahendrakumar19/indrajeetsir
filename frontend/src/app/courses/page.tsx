'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LeadBanner from '@/components/LeadBanner';
import { API_URL, getStudentSession, setStudentSession } from '@/lib/api';
import '@/app/home.css';

interface Course {
  id: string;
  title: string;
  description?: string;
  price: number;
  instructor?: string;
  published?: boolean;
  features?: string[];
  validity?: string;
  tag?: string;
  thumbnail?: string;
}

interface RazorpayResponse {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: any) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

const DEFAULT_COURSE_THUMBNAILS: Record<string, string> = {
  'c-1': '/courses/course-1.svg',
  'c-2': '/courses/course-2.svg',
  'c-3': '/courses/course-3.svg',
  'c-4': '/courses/course-4.svg',
  'c-5': '/courses/course-5.svg',
};

function enrichWithThumbnails(list: Course[]): Course[] {
  return list.map((c, i) => ({
    ...c,
    thumbnail: c.thumbnail || DEFAULT_COURSE_THUMBNAILS[c.id] || `/courses/course-${(i % 5) + 1}.svg`,
  }));
}

function sortCoursesInOrder(list: Course[]): Course[] {
  return [...list].sort((a, b) => {
    const getIdx = (c: Course) => {
      const t = (c.title || '').trim().toLowerCase();
      if (t.includes('after') && t.includes('foundation')) return 0;
      if (t.includes('mains') && t.includes('comprehensive')) return 1;
      if (t.includes('prelims') && t.includes('targeted')) return 2;
      if (t.includes('parallel') && t.includes('foundation')) return 3;
      if (t.includes('short notes')) return 4;
      return 99;
    };
    return getIdx(a) - getIdx(b);
  });
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c-1',
      title: '1 Year Full Mentorship for UPSC 2027 (After Foundation Course)',
      description: 'Complete 3-Stage Prelims, Mains, and Interview guidance with 1-on-1 personal mentorship by Indrajeet Sir.',
      price: 24000,
      instructor: 'Indrajeet Sir',
      thumbnail: '/courses/course-1.svg',
      features: [
        'Prelims: High-yield Notes Making, PYQ+, 20 Mock Tests, Total 5,000+ Practice Questions',
        'Mains: Short Note Making, Deep PYQ Trend Analysis, Toppers Copy Analysis, 16 Evaluated Tests',
        'Weekly Strategy Sessions & 1-on-1 Personal Mentorship by Indrajeet Sir',
      ],
      validity: '365+1 Day (1 Year)',
      tag: 'Comprehensive Flagship',
    },
    {
      id: 'c-2',
      title: 'Mains Mentorship 2026/2027 (Comprehensive GS & Answer Writing)',
      description: 'Master Mains answer writing precision, daily evaluations, and structured feedback from Indrajeet Sir.',
      price: 18000,
      instructor: 'Indrajeet Sir',
      thumbnail: '/courses/course-2.svg',
      features: [
        '600+ Topic Short Note Making Framework for GS Paper 1, 2, 3, and 4',
        'Deep Trend Analysis of Last 12 Years UPSC Mains Questions',
        'Toppers Copy Structural & Presentation Reverse-Engineering',
        '16 Evaluated Tests (Mini, Sectional & Full Length) with Line-by-Line Review',
      ],
      validity: '4-5 Months',
      tag: 'Mains Intensive',
    },
    {
      id: 'c-3',
      title: 'Prelims Mentorship 2026 (Targeted Prelims Mastery & PYQ Reverse Engineering)',
      description: 'Eliminate option traps, master theme forecasting, and secure 110+ cutoff safety in UPSC Prelims.',
      price: 15000,
      instructor: 'Indrajeet Sir',
      thumbnail: '/courses/course-3.svg',
      features: [
        'High-Yield Prelims Short Notes & Option Elimination Tactics',
        'PYQ+ Trend Forecasting (Mapping Past 10-Year Themes to Future Questions)',
        '20 Full-Length Mock Tests with In-Depth Performance Analytics',
        '5,000+ Topic-Wise High Probability Practice Questions',
      ],
      validity: '5-6 Months',
      tag: 'Prelims Mastery',
    },
    {
      id: 'c-4',
      title: 'Parallel Mentorship with Foundation Course (18 Months Extended Support)',
      description: 'Designed for aspirants currently enrolled in coaching classes who need parallel personal guidance and accountability.',
      price: 28000,
      instructor: 'Indrajeet Sir',
      thumbnail: '/courses/course-4.svg',
      features: [
        'Synchronized Study Schedules Parallel to Your Coaching Classroom',
        'Weekly Syllabus Coverage & Consistency Audits with Sir',
        'Early Answer Writing Fundamentals & Keyword Placement Training',
        'Full 18 Months Direct Mentor Access and Doubt Resolution',
      ],
      validity: '18 Months',
      tag: 'Extended Parallel Support',
    },
    {
      id: 'c-5',
      title: 'Mains Short Notes Making Mentorship (GS 1, 2, 3 & 4 Ready Reckoners)',
      description: 'Consolidate 10,000+ pages of bulky coaching material into concise 600+ micro-notes for lightning revision.',
      price: 9000,
      instructor: 'Indrajeet Sir',
      thumbnail: '/courses/course-5.svg',
      features: [
        'Micro-Syllabus Breakdown of Every Single UPSC Mains Keyword',
        'Intro-Body-Conclusion Ready Templates & Value Addition Enriched (2nd ARC, Law Comm, Case Laws)',
        'Diagrams, Flowcharts, Data Points & Committee Recommendations Ready Reckoners',
        'Weekly Submission Review & Template Refinement by Indrajeet Sir',
      ],
      validity: '2 Months',
      tag: 'Micro Notes Mastery',
    },
  ]);

  const [siteContent, setSiteContent] = useState({
    coursesHeading: 'Mentorship Batches & Fees',
    coursesSubheading: 'Transparent course fees. Login credentials and Android application access are delivered immediately after enrollment.',
    whatsappUrl: 'https://wa.me/919709992093',
  });

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [attemptYear, setAttemptYear] = useState(String(new Date().getFullYear() + 1));
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [enrolledCourseTitle, setEnrolledCourseTitle] = useState('');
  const [enrolledPassword, setEnrolledPassword] = useState('');

  useEffect(() => {
    const loadContent = () => {
      try {
        const savedContent = localStorage.getItem('indrajeet_site_content');
        if (savedContent) {
          setSiteContent((prev) => ({ ...prev, ...JSON.parse(savedContent) }));
        }
        const savedCourses = localStorage.getItem('indrajeet_courses');
        if (savedCourses) {
          const parsed = JSON.parse(savedCourses);
          if (Array.isArray(parsed) && parsed.length >= 5) {
            setCourses(sortCoursesInOrder(enrichWithThumbnails(parsed)));
          }
        }
      } catch {}
    };

    loadContent();
    window.addEventListener('storage', loadContent);

    fetch(`${API_URL}/courses`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length >= 5) {
          setCourses(sortCoursesInOrder(enrichWithThumbnails(data)));
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('storage', loadContent);
  }, []);

  // Restore session keys & process deep-link enrollment parameters from Mobile App
  useEffect(() => {
    // 1. Check existing student session in localStorage
    const existing = getStudentSession();
    if (existing) {
      if (existing.name) setStudentName((prev) => prev || existing.name);
      if (existing.email) setStudentEmail((prev) => prev || existing.email);
      if (existing.phone) setStudentPhone((prev) => prev || existing.phone || '');
      if (existing.attempt) setAttemptYear((prev) => prev || existing.attempt || String(new Date().getFullYear() + 1));
    }

    // 2. Read query params if redirected from mobile app
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlEmail = params.get('email');
      const urlName = params.get('name');
      const urlPhone = params.get('phone');
      const urlAttempt = params.get('attempt') || params.get('attemptYear');
      const urlOptional = params.get('optional') || params.get('optionalSubject');
      const urlCourseId = params.get('courseId');
      const urlCourseTitle = params.get('courseTitle');

      if (urlEmail) {
        setStudentEmail(urlEmail);
        if (urlName) setStudentName(urlName);
        if (urlPhone) setStudentPhone(urlPhone);
        if (urlAttempt) setAttemptYear(urlAttempt);

        // Keep session keys synced and preserved across mobile & website
        setStudentSession({
          id: existing?.id || `st-${Date.now()}`,
          name: urlName || existing?.name || 'Aspirant',
          email: urlEmail,
          phone: urlPhone || existing?.phone || '',
          attempt: urlAttempt || existing?.attempt || String(new Date().getFullYear() + 1),
          optionalSubject: urlOptional || existing?.optionalSubject || '',
        });
        window.dispatchEvent(new Event('storage'));
      }

      // Automatically open checkout modal if a course was selected in mobile app
      if (urlCourseId || urlCourseTitle) {
        const targetId = urlCourseId?.toLowerCase();
        const targetTitle = urlCourseTitle?.toLowerCase();
        const matched = courses.find((c) => {
          if (targetId && c.id.toLowerCase() === targetId) return true;
          if (targetTitle && c.title.toLowerCase().includes(targetTitle)) return true;
          return false;
        });
        if (matched) {
          setSelectedCourse(matched);
        }
      }
    }
  }, [courses]);

  const handleStartEnrollment = (course: Course) => {
    setSelectedCourse(course);
    setPaymentError('');
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    if (!studentEmail || !studentEmail.includes('@')) {
      setPaymentError('Please enter a valid email address.');
      return;
    }
    if (!studentName.trim()) {
      setPaymentError('Please enter your full name.');
      return;
    }

    setPaymentLoading(true);
    setPaymentError('');

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || !window.Razorpay) {
        throw new Error('Could not load payment gateway. Please check your internet connection and try again.');
      }

      const res = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          studentEmail: studentEmail.trim().toLowerCase(),
          studentName: studentName.trim(),
          studentPhone: studentPhone.trim(),
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.orderId) {
        throw new Error(orderData.message || 'Unable to create payment order. Please contact support.');
      }

      const options: Record<string, unknown> = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_TyxWr8jpaqC5mi',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Indrajeet Sir',
        description: `Enrollment: ${selectedCourse.title}`,
        image: 'https://indrajeetsir.com/logo.png',
        order_id: orderData.orderId,
        handler: async (response: RazorpayResponse) => {
          await verifyPayment(response, orderData.orderId);
        },
        prefill: {
          name: studentName,
          email: studentEmail,
          contact: studentPhone,
        },
        theme: {
          color: '#0f172a',
        },
        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
            setPaymentError('Payment window closed. You can retry whenever you are ready.');
          },
        },
      };

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection and try again.');
      }

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response: any) => {
        const errorDesc = response?.error?.description || response?.error?.reason || 'Payment failed. Please try another payment method.';
        setPaymentError(`Payment failed: ${errorDesc}`);
        setPaymentLoading(false);
      });
      rzp.open();
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : 'Payment initiation failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const verifyPayment = async (response: RazorpayResponse, orderId: string) => {
    setPaymentLoading(true);
    try {
      const res = await fetch(`${API_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          courseId: selectedCourse?.id,
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim().toLowerCase(),
          studentPhone: studentPhone.trim(),
          attemptYear,
        }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Payment verification failed.');
      }

      if (result.student) {
        setStudentSession({
          id: result.student.id || `st-${Date.now()}`,
          name: result.student.name || studentName,
          email: result.student.email || studentEmail,
          phone: studentPhone,
          attempt: attemptYear,
        });
      }

      setEnrolledCourseTitle(selectedCourse?.title || 'UPSC Mentorship Batch');
      setEnrolledPassword(result.tempPassword || 'UPSC@2026');
      setSelectedCourse(null);
      setSuccessModalOpen(true);
    } catch (err: unknown) {
      setPaymentError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="site">
      <Header />

      {/* ── Courses & Pricing Section (3D Depth) ── */}
      <section id="courses" className="section-wrap" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading">{siteContent.coursesHeading}</h2>

          <div className="courses-grid-3d">
            {courses.map((course) => {
              const currentPrice = Number(course.price) || 0;
              const originalPrice = Math.round(currentPrice * 2.5);
              const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
              const posterSrc = course.thumbnail || DEFAULT_COURSE_THUMBNAILS[course.id] || '/courses/course-1.svg';

              return (
                <div key={course.id} className="pricing-card-3d">
                  <div>
                    <div className="course-card-thumb-wrap">
                      <img
                        src={posterSrc}
                        alt={course.title}
                        className="course-card-thumb-img"
                        loading="lazy"
                      />
                    </div>

                    <div className="pricing-title-wrap">
                      <h3>{course.title}</h3>
                      <p className="pricing-desc-text">
                        {course.description || 'Comprehensive mentorship with Indrajeet Sir, direct Mains evaluation, and weekly strategy sessions.'}
                      </p>
                    </div>

                    <div className="pricing-fee-block">
                      <div className="price-main-col">
                        <div className="price-strike-row">
                          <span className="amount-val-blue">₹{currentPrice.toLocaleString('en-IN')}</span>
                          <span className="original-price-strike">₹{originalPrice.toLocaleString('en-IN')}</span>
                          <span className="discount-percent-pill">{discountPercent}% OFF</span>
                        </div>
                        <div className="fee-tenure-text">
                          <i className="fa-regular fa-calendar-check" style={{ marginRight: '0.4rem', color: '#2563eb' }} />
                          <span>{course.validity || 'Batch Access'}</span>
                        </div>
                      </div>
                    </div>

                    <ul className="features-checklist">
                      {course.features && course.features.length > 0 ? (
                        course.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>Direct Mains answer writing evaluation &amp; feedback by Indrajeet Sir</span>
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>600+ Topic-wise short notes for GS 1 to 4</span>
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>Weekly Diagnostic Strategy &amp; Doubt Clearing Sessions</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="course-card-cta-wrap">
                    <button
                      className="btn-primary full lg course-enroll-btn"
                      onClick={() => handleStartEnrollment(course)}
                    >
                      <span>Enroll Now — ₹{Number(course.price).toLocaleString('en-IN')}</span>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '0.45rem' }}>
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Razorpay Checkout Student Modal ── */}
      {selectedCourse && (
        <div className="modal-backdrop" onClick={() => setSelectedCourse(null)}>
          <div className="modal-box checkout-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="checkout-modal-header">
              <div>
                <span className="checkout-badge-pill">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" /> Secure Admission
                </span>
                <h3 className="checkout-course-title">
                  {selectedCourse.title}
                </h3>
              </div>
              <button
                type="button"
                className="checkout-modal-close"
                onClick={() => setSelectedCourse(null)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="checkout-fee-box">
              <div>
                <div className="checkout-fee-label">TOTAL PAYABLE FEE (ALL INCLUSIVE)</div>
                <div className="checkout-fee-amount">
                  ₹{Number(selectedCourse.price).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="checkout-instant-badge">
                <i className="fa-solid fa-bolt" aria-hidden="true" /> Instant Access
              </div>
            </div>

            {paymentError && (
              <div className="checkout-error-banner">
                <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
                <span>{paymentError}</span>
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="checkout-form">
              <div className="checkout-field-group">
                <label className="checkout-field-label">
                  Aspirant Full Name <span className="req-star">*</span>
                </label>
                <div className="checkout-input-wrap">
                  <i className="fa-solid fa-user checkout-input-icon" aria-hidden="true" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </div>

              <div className="checkout-field-group">
                <label className="checkout-field-label">
                  Email Address (For Live Portal Login) <span className="req-star">*</span>
                </label>
                <div className="checkout-input-wrap">
                  <i className="fa-solid fa-envelope checkout-input-icon" aria-hidden="true" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </div>

              <div className="checkout-grid-2">
                <div className="checkout-field-group" style={{ marginBottom: 0 }}>
                  <label className="checkout-field-label">
                    Phone Number (WhatsApp)
                  </label>
                  <div className="checkout-input-wrap">
                    <i className="fa-solid fa-phone checkout-input-icon" aria-hidden="true" />
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="checkout-input"
                    />
                  </div>
                </div>
                <div className="checkout-field-group" style={{ marginBottom: 0 }}>
                  <label className="checkout-field-label">
                    Target Attempt Year
                  </label>
                  <div className="checkout-input-wrap">
                    <i className="fa-solid fa-calendar-check checkout-input-icon" aria-hidden="true" />
                    <select
                      value={attemptYear}
                      onChange={(e) => setAttemptYear(e.target.value)}
                      className="checkout-select"
                    >
                      <option value={String(new Date().getFullYear() + 1)}>UPSC CSE {new Date().getFullYear() + 1}</option>
                      <option value={String(new Date().getFullYear() + 2)}>UPSC CSE {new Date().getFullYear() + 2}</option>
                      <option value={String(new Date().getFullYear() + 3)}>UPSC CSE {new Date().getFullYear() + 3}</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentLoading}
                className="checkout-submit-btn"
                style={{ marginTop: '0.4rem' }}
              >
                {paymentLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock" aria-hidden="true" />
                    <span>Proceed to Pay ₹{Number(selectedCourse.price).toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="checkout-trust-badge">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                <span>256-Bit SSL Encrypted • Razorpay Certified • Instant Activation</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success Celebration Modal ── */}
      {successModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-box text-center" style={{ maxWidth: '440px', padding: '2rem 1.6rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.2rem' }}>
              ✓
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Enrollment Confirmed!
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              Welcome aboard! You are now enrolled in <strong>{enrolledCourseTitle}</strong>.
            </p>

            <div className="checkout-credentials-box">
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Your Portal Login Credentials
              </div>
              <div style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                <strong>User ID / Email:</strong> {studentEmail}
              </div>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Temporary Passcode:</strong> <code style={{ background: 'rgba(100, 116, 139, 0.2)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>{enrolledPassword}</code>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link
                href="/dashboard"
                className="btn-primary full"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#0f172a' }}
              >
                <i className="fa-solid fa-user-graduate" style={{ fontSize: '1rem' }} aria-hidden="true" />
                <span>Go to My Dashboard →</span>
              </Link>
              <a
                href="https://play.google.com/store/apps/details?id=com.nighwantech.indrajeetsir"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.25rem 0' }}
              >
                <Image
                  src="/google-play.svg"
                  alt="Get it on Google Play"
                  width={180}
                  height={54}
                  style={{ height: '48px', width: 'auto' }}
                />
              </a>
              <button
                type="button"
                className="btn-outline full"
                onClick={() => setSuccessModalOpen(false)}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

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
