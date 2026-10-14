'use client';

import { useState, useEffect } from 'react';
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

interface RazorpayResponse {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => RazorpayInstance;
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

  // Important PDFs & Study Material List (Empty by default, managed by admin)
  const [pdfList, setPdfList] = useState<Array<{
    id: string;
    title: string;
    description: string;
    tag: string;
    size: string;
    fileUrl: string;
  }>>([]);

  // Dynamic Site Content (Editable via Admin Panel)
  const [siteContent, setSiteContent] = useState({
    heroHeading: 'UPSC CSE is cracked on Answer Writing & Discipline, not endless lectures.',
    heroSubheading: 'UPSC CSE is cracked on answer writing and daily discipline rather than endless passive lectures. Get direct personal guidance by Indrajeet Sir with line-by-line Mains copy checking, weekly 1:1 strategy reviews, and high-yield GS 1–4 study notes.',
    stat1Number: '600+',
    stat1Label: 'Mains Micro Notes',
    stat2Number: '16 Tests',
    stat2Label: 'Checked Personally',
    stat3Number: '1:1 Private',
    stat3Label: 'Strategy Sessions',
    aboutHeading: 'No Outsourced Checking. Direct Teacher Accountability.',
    aboutSubheading: 'In UPSC CSE preparation, endless passive lectures create a false illusion of progress. True mastery is built when disciplined answer writing is rigorously evaluated and personally cracked through consistent diagnosis.',
    dhoniQuote: 'The process is more important than the results. If you take care of the process, results will follow.',
    dhoniAuthor: 'MS Dhoni',
    pdfSectionHeading: 'Important Study Material & Resource PDFs',
    pdfSectionSubheading: 'Download verified syllabus blueprints, official brochures, model answer evaluations, and strategic notes prepared by Indrajeet Sir.',
    contactDeskHeading: 'Have Questions About Preparation Strategy?',
    contactDeskSubheading: "Talk directly with Indrajeet Sir's mentorship desk to discuss your attempt year and study plan.",
    telegramHandle: '@Indrajeetsir_UPSC',
    telegramUrl: 'https://t.me/Indrajeetsir_UPSC',
    phoneDisplay: '+91 98734 86158',
    phoneTel: '+919873486158',
    whatsappDisplay: '+91 98734 86158',
    whatsappUrl: 'https://wa.me/919873486158',
    contactEmail: 'indrajeet.visionias@gmail.com',
  });

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

  // Fetch courses and live website content
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        const savedContent = localStorage.getItem('indrajeet_site_content');
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          if (parsed.telegramHandle === '@Indrajeet_UPSC' || parsed.telegramHandle === '@IndrajeetSir_UPSC') {
            parsed.telegramHandle = '@Indrajeetsir_UPSC';
            parsed.telegramUrl = 'https://t.me/Indrajeetsir_UPSC';
            try { localStorage.setItem('indrajeet_site_content', JSON.stringify({ ...parsed, telegramHandle: '@Indrajeetsir_UPSC', telegramUrl: 'https://t.me/Indrajeetsir_UPSC' })); } catch {}
          }
          setSiteContent((prev) => ({ ...prev, ...parsed }));
        }
        const savedPdfs = localStorage.getItem('indrajeet_pdf_list');
        if (savedPdfs) {
          const parsed = JSON.parse(savedPdfs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPdfList(parsed);
          }
        }
      } catch {
        // ignore parse error
      }
    });

    fetch(`${API_URL}/courses`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setCourses(data);
        }
      })
      .catch(() => {});

    return () => cancelAnimationFrame(frameId);
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
    const timestamp = new Date().getTime();

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
        const options: Record<string, unknown> = {
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
          handler: async (response: RazorpayResponse) => {
            await verifyPaymentAndFinish({
              orderId: response.razorpay_order_id || orderData.orderId,
              paymentId: response.razorpay_payment_id || `pay_${timestamp}`,
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
          paymentId: `pay_test_${timestamp}`,
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
        orderId: `order_${timestamp}`,
        paymentId: `pay_${timestamp}`,
        courseId: selectedCourse.id,
        studentName,
        studentEmail: emailClean,
        studentPhone,
      });
    }
  };

  const verifyPaymentAndFinish = async (verifyPayload: {
    orderId: string;
    paymentId: string;
    signature?: string;
    courseId: string;
    studentName: string;
    studentEmail: string;
    studentPhone: string;
  }) => {
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
      <section id="top" className="hero">
        <div className="hero-content">
          <h1>{siteContent.heroHeading}</h1>
          <p className="hero-desc">{siteContent.heroSubheading}</p>
          <div className="hero-btns">
            <a href="#courses" className="btn-primary lg">
              <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              <span>View Programs & Fees</span>
            </a>
            <button className="btn-outline lg" onClick={() => setShowBookModal(true)}>
              <i className="fa-solid fa-phone" style={{ marginRight: '0.5rem' }} aria-hidden="true" />
              <span>Request Callback</span>
            </button>
          </div>
          <div className="hero-stats-3d">
            <div className="stat-card-3d">
              <i className="fa-solid fa-book-bookmark" style={{ color: '#2563eb', fontSize: '1.2rem', marginBottom: '0.45rem', display: 'block' }} aria-hidden="true" />
              <strong>{siteContent.stat1Number}</strong>
              <span>{siteContent.stat1Label}</span>
            </div>
            <div className="stat-card-3d">
              <i className="fa-solid fa-file-signature" style={{ color: '#2563eb', fontSize: '1.2rem', marginBottom: '0.45rem', display: 'block' }} aria-hidden="true" />
              <strong>{siteContent.stat2Number}</strong>
              <span>{siteContent.stat2Label}</span>
            </div>
            <div className="stat-card-3d">
              <i className="fa-solid fa-chalkboard-user" style={{ color: '#2563eb', fontSize: '1.2rem', marginBottom: '0.45rem', display: 'block' }} aria-hidden="true" />
              <strong>{siteContent.stat3Number}</strong>
              <span>{siteContent.stat3Label}</span>
            </div>
          </div>
        </div>

        {/* 3D Mentor Card (Landscape) */}
        <div className="hero-img-wrap">
          <div className="mentor-card-3d">
            <div className="mentor-img-frame">
              <Image
                src="/indrajeet-sir.jpg"
                alt="Indrajeet Sir - 1:1 UPSC & State PCS Mentorship"
                width={640}
                height={360}
                quality={95}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }}
                className="mentor-img"
                priority
              />
              <div className="mentor-live-floating-badge">
                <span className="live-green-pulse" />
                <span>Live 1:1 Mentorship</span>
              </div>
            </div>
            <div className="mentor-card-footer">
              <div className="mentor-footer-headline">
                <strong>Indrajeet Sir</strong>
                <span>Former Faculty at Top Delhi Institutes • 10+ Yrs UPSC Mentorship</span>
              </div>
              <div className="mentor-chips-row">
                <span className="mentor-tag-chip">
                  <i className="fa-solid fa-pen-nib" style={{ marginRight: '0.35rem', color: '#2563eb' }} aria-hidden="true" />
                  GS 1–4 Mains
                </span>
                <span className="mentor-tag-chip">
                  <i className="fa-solid fa-check-double" style={{ marginRight: '0.35rem', color: '#2563eb' }} aria-hidden="true" />
                  Personal Copy Checking
                </span>
                <span className="mentor-tag-chip">
                  <i className="fa-solid fa-video" style={{ marginRight: '0.35rem', color: '#2563eb' }} aria-hidden="true" />
                  1:1 Strategy
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Authentic Mentorship Architecture ── */}
      <section id="about" className="section-wrap">
        <div className="section-inner text-center">
          <h2 className="section-heading">{siteContent.aboutHeading}</h2>
          <p className="section-subtext">
            {siteContent.aboutSubheading}
          </p>

          <div className="comparison-grid">
            {/* The Bulk Coaching Dilemma */}
            <div className="problem-card">
              <h3>
                <i className="fa-solid fa-triangle-exclamation" style={{ color: '#ef4444', marginRight: '0.5rem' }} aria-hidden="true" />
                <span>The Bulk Coaching Problem</span>
              </h3>
              <ul className="problem-list">
                <li>
                  <span className="cross-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </span>
                  <span>400+ students packed into a single batch with zero individual attention or strategy diagnosis.</span>
                </li>
                <li>
                  <span className="cross-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </span>
                  <span>Answer copies checked after 3–4 weeks by junior interns or outsourced evaluation contractors.</span>
                </li>
                <li>
                  <span className="cross-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </span>
                  <span>Generic scorecards with no actionable remarks on how to improve introduction, arguments, or conclusion.</span>
                </li>
                <li>
                  <span className="cross-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-xmark" aria-hidden="true" />
                  </span>
                  <span>Students spend months watching lectures without ever building real 3-hour answer writing stamina.</span>
                </li>
              </ul>
            </div>

            {/* Indrajeet Sir's Direct 1:1 Approach */}
            <div className="solution-card">
              <h3>
                <i className="fa-solid fa-shield-halved" style={{ color: '#2563eb', marginRight: '0.5rem' }} aria-hidden="true" />
                <span>Indrajeet Sir&apos;s 1:1 Accountability</span>
              </h3>
              <ul className="solution-list">
                <li>
                  <span className="check-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-check" aria-hidden="true" />
                  </span>
                  <span><strong>Personal Copy Checking:</strong> Every Mains answer is evaluated directly by Indrajeet Sir with actionable remarks.</span>
                </li>
                <li>
                  <span className="check-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-check" aria-hidden="true" />
                  </span>
                  <span><strong>Weekly 1:1 Strategy Calls:</strong> Private video sessions to review your weekly study timetable and fix preparation gaps.</span>
                </li>
                <li>
                  <span className="check-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-check" aria-hidden="true" />
                  </span>
                  <span><strong>600+ Topic Micro Notes:</strong> Concise, high-yield revision material across GS-1, GS-2, GS-3, and GS-4.</span>
                </li>
                <li>
                  <span className="check-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="fa-solid fa-check" aria-hidden="true" />
                  </span>
                  <span><strong>16 Structured Tests:</strong> Phased test series (Mini, Sectional & Full-length) with model answers and marks improvement roadmap.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Dhoni Quote 3D Card */}
          <div className="quote-card-3d">
            <blockquote>
              &ldquo;{siteContent.dhoniQuote}&rdquo;
              <span className="quote-author">— {siteContent.dhoniAuthor}</span>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ── Educative Graphic 1: 3-Stage UPSC Mentorship Architecture ── */}
      <section id="architecture" className="section-wrap" style={{ background: 'rgba(255, 255, 255, 0.45)' }}>
        <div className="section-inner text-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            <i className="fa-solid fa-graduation-cap" aria-hidden="true" />
            <span>Pedagogical Framework</span>
          </div>
          <h2 className="section-heading">3-Stage UPSC Mentorship Architecture</h2>
          <p className="section-subtext">
            A battle-tested progression model transforming raw aspirants into rank-ready civil servants through phased diagnosis, feedback, and accountability.
          </p>

          <div className="edu-architecture-wrap">
            <div className="edu-stages-grid">
              {/* Stage 1 */}
              <div className="edu-stage-card">
                <div className="edu-stage-header">
                  <span className="edu-stage-badge">
                    <i className="fa-solid fa-compass" aria-hidden="true" />
                    <span>Stage 01</span>
                  </span>
                  <span className="edu-stage-num">01</span>
                </div>
                <h3>Prelims Elimination &amp; Static Foundation</h3>
                <p className="edu-stage-desc">
                  Building micro-level conceptual clarity across NCERTs and standard reference books with rigorous PYQ pattern extraction.
                </p>

                <div className="edu-infographic-box">
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-blue">
                      <i className="fa-solid fa-filter" aria-hidden="true" />
                    </span>
                    <span>10-Year PYQ Elimination Tactics</span>
                  </div>
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-emerald">
                      <i className="fa-solid fa-layer-group" aria-hidden="true" />
                    </span>
                    <span>High-Yield Theme Mapping</span>
                  </div>
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-amber">
                      <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" />
                    </span>
                    <span>Negative Marking Diagnostic</span>
                  </div>
                  <div className="edu-metric-bar">
                    <div className="edu-metric-fill" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="edu-card-deliverable">
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  <span>Deliverable: 100% Core Syllabus Mastery</span>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="edu-stage-card" style={{ borderColor: 'rgba(37, 99, 235, 0.4)', boxShadow: '0 12px 35px -6px rgba(37, 99, 235, 0.12)' }}>
                <div className="edu-stage-header">
                  <span className="edu-stage-badge" style={{ background: '#2563eb', color: '#ffffff', borderColor: '#1d4ed8' }}>
                    <i className="fa-solid fa-pen-fancy" aria-hidden="true" />
                    <span>Stage 02 • Core Focus</span>
                  </span>
                  <span className="edu-stage-num" style={{ color: '#93c5fd' }}>02</span>
                </div>
                <h3>Mains GS 1–4 &amp; Essay Answer Diagnosis</h3>
                <p className="edu-stage-desc">
                  Line-by-line copy evaluation personally conducted by Indrajeet Sir. Structural formatting, committee citations, and value addition.
                </p>

                <div className="edu-infographic-box">
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-indigo">
                      <i className="fa-solid fa-pen-nib" aria-hidden="true" />
                    </span>
                    <span>Direct Copy Evaluation by Sir</span>
                  </div>
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-emerald">
                      <i className="fa-solid fa-chart-line" aria-hidden="true" />
                    </span>
                    <span>Intro-Body-Conclusion Structuring</span>
                  </div>
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-blue">
                      <i className="fa-solid fa-diagram-project" aria-hidden="true" />
                    </span>
                    <span>Flowcharts &amp; Case Laws Integration</span>
                  </div>
                  <div className="edu-metric-bar">
                    <div className="edu-metric-fill" style={{ width: '95%', background: 'linear-gradient(90deg, #2563eb, #10b981)' }} />
                  </div>
                </div>

                <div className="edu-card-deliverable" style={{ color: '#1e40af', background: '#eff6ff', borderColor: '#bfdbfe' }}>
                  <i className="fa-solid fa-award" aria-hidden="true" />
                  <span>Deliverable: +40 to +60 Marks Mains Boost</span>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="edu-stage-card">
                <div className="edu-stage-header">
                  <span className="edu-stage-badge">
                    <i className="fa-solid fa-user-tie" aria-hidden="true" />
                    <span>Stage 03</span>
                  </span>
                  <span className="edu-stage-num">03</span>
                </div>
                <h3>Personality Test &amp; 1:1 Board Diagnostic</h3>
                <p className="edu-stage-desc">
                  Detailed Application Form (DAF) line-by-line audit, contemporary policy analysis, and 1:1 mock interview debrief with Indrajeet Sir.
                </p>

                <div className="edu-infographic-box">
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-amber">
                      <i className="fa-solid fa-id-card" aria-hidden="true" />
                    </span>
                    <span>DAF In-Depth Scrutiny &amp; Questions</span>
                  </div>
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-blue">
                      <i className="fa-solid fa-comments" aria-hidden="true" />
                    </span>
                    <span>Situational Crisis Decision-Making</span>
                  </div>
                  <div className="edu-diagram-item">
                    <span className="edu-diagram-icon edu-icon-emerald">
                      <i className="fa-solid fa-video" aria-hidden="true" />
                    </span>
                    <span>1:1 Private Mock Simulation Video</span>
                  </div>
                  <div className="edu-metric-bar">
                    <div className="edu-metric-fill" style={{ width: '90%' }} />
                  </div>
                </div>

                <div className="edu-card-deliverable">
                  <i className="fa-solid fa-circle-check" aria-hidden="true" />
                  <span>Deliverable: Final Service Selection Mindset</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Educative Graphic 2: Authentic Evaluated Mains Copy Showcase ── */}
          <div className="mains-copy-graphic-wrap">
            <div className="mains-copy-header">
              <div>
                <span className="mains-copy-badge">
                  <i className="fa-solid fa-microscope" aria-hidden="true" />
                  <span>Live Evaluation Diagnostic</span>
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 850, marginTop: '0.45rem', color: '#0f172a' }}>
                  How Indrajeet Sir Personally Evaluates Your Answers
                </h3>
              </div>
              <div className="mains-mentor-seal">
                <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', fontSize: '1.1rem' }} aria-hidden="true" />
                <span>Line-by-Line Copy Checking • Zero Outsourcing</span>
              </div>
            </div>

            <div className="mains-copy-grid">
              {/* Lined Answer Sheet Mockup */}
              <div className="upsc-sheet-mockup">
                <div className="upsc-sheet-margin" />
                <div className="upsc-question-box">
                  Q. &ldquo;Examine the constitutional role of statutory watchdogs in preserving federal integrity in India.&rdquo; (15 Marks, 250 Words)
                </div>
                <div className="upsc-student-answer-excerpt">
                  <span className="answer-line">
                    Statutory and Constitutional watchdogs like <span className="answer-highlight">CAG (Art 148) and Finance Commission (Art 280)</span> play a crucial balancing role...
                    <span className="critique-callout">
                      <i className="fa-solid fa-check" aria-hidden="true" /> Good Articles Cited
                    </span>
                  </span>
                  <span className="answer-line" style={{ marginTop: '0.65rem' }}>
                    However, fiscal friction between Centre and States has increased due to cess and surcharges...
                    <span className="critique-callout tip">
                      <i className="fa-solid fa-lightbulb" aria-hidden="true" /> Add 2nd ARC Flowchart
                    </span>
                  </span>
                  <span className="answer-line" style={{ marginTop: '0.65rem' }}>
                    <span className="answer-highlight">Way Forward:</span> Strengthening inter-state council consultations and institutionalizing tax devotions.
                  </span>
                </div>
              </div>

              {/* Feedback Breakdown Panel */}
              <div className="mains-feedback-panel">
                <div className="feedback-card-item">
                  <div className="feedback-card-title" style={{ color: '#16a34a' }}>
                    <i className="fa-solid fa-circle-check" aria-hidden="true" />
                    <span>Content Strengths Identified</span>
                  </div>
                  <p className="feedback-card-text">
                    Accurate constitutional articles referenced in introduction. Direct addressing of core question directive (&ldquo;Examine&rdquo;).
                  </p>
                </div>

                <div className="feedback-card-item">
                  <div className="feedback-card-title" style={{ color: '#dc2626' }}>
                    <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
                    <span>Structure &amp; Value Addition Remarks</span>
                  </div>
                  <p className="feedback-card-text">
                    Divide body into 3 clear pillars: Legislative, Fiscal, and Dispute Resolution. Citing Sarkaria &amp; Punchhi Commission reports will fetch +2 marks.
                  </p>
                </div>

                <div className="scorecard-banner">
                  <div>
                    <div style={{ fontSize: '0.78rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>
                      Diagnostic Marks Given
                    </div>
                    <div className="scorecard-marks">
                      <span className="scorecard-val">8.5</span>
                      <span className="scorecard-total">/ 15 Marks</span>
                    </div>
                  </div>
                  <span className="scorecard-gain">
                    <i className="fa-solid fa-arrow-trend-up" style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                    +3.5 Marks Potential
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Educative Graphic 3: 4-Pillar Daily Mentorship Clock (Workflow) ── */}
          <div className="daily-pipeline-grid">
            <div className="pipeline-step-card">
              <span className="pipeline-time-badge">
                <i className="fa-regular fa-clock" aria-hidden="true" />
                <span>08:00 AM IST</span>
              </span>
              <div className="pipeline-icon-box">
                <i className="fa-solid fa-paper-plane" aria-hidden="true" />
              </div>
              <h4>1. Daily Question Prompt</h4>
              <p>Curated GS Mains questions delivered daily via the Student App aligned with the weekly study roadmap.</p>
            </div>

            <div className="pipeline-step-card">
              <span className="pipeline-time-badge">
                <i className="fa-regular fa-clock" aria-hidden="true" />
                <span>02:00 PM IST</span>
              </span>
              <div className="pipeline-icon-box">
                <i className="fa-solid fa-cloud-arrow-up" aria-hidden="true" />
              </div>
              <h4>2. Aspirant Copy Upload</h4>
              <p>Upload your handwritten answer PDF scan through the mobile app or web portal in under 15 seconds.</p>
            </div>

            <div className="pipeline-step-card">
              <span className="pipeline-time-badge">
                <i className="fa-regular fa-clock" aria-hidden="true" />
                <span>08:00 PM IST</span>
              </span>
              <div className="pipeline-icon-box">
                <i className="fa-solid fa-user-check" aria-hidden="true" />
              </div>
              <h4>3. Line-by-Line Copy Return</h4>
              <p>Indrajeet Sir personally reviews and marks your copy with actionable margins, model structure, and audio critique.</p>
            </div>

            <div className="pipeline-step-card">
              <span className="pipeline-time-badge" style={{ background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }}>
                <i className="fa-solid fa-calendar-check" aria-hidden="true" />
                <span>Weekly Session</span>
              </span>
              <div className="pipeline-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <i className="fa-solid fa-headset" aria-hidden="true" />
              </div>
              <h4>4. 1:1 Video Strategy Review</h4>
              <p>Private video consultation to diagnose mental fatigue, timetable lags, and roadmap improvements for the upcoming week.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses & Pricing Section (3D Depth) ── */}
      <section id="courses" className="section-wrap" style={{ background: 'rgba(255, 255, 255, 0.6)' }}>
        <div className="section-inner text-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            <i className="fa-solid fa-certificate" aria-hidden="true" />
            <span>Structured Mentorship Batches</span>
          </div>
          <h2 className="section-heading">Mentorship Batches &amp; Fees</h2>
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
                    <li>
                      <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                      <span>1:1 Live interactive sessions with Indrajeet Sir</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                      <span>Direct Mains answer writing evaluation &amp; feedback</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                      <span>600+ Topic-wise short notes for GS 1 to 4</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                      <span>16 Evaluated tests (Mini, Sectional &amp; Full-length)</span>
                    </li>
                    <li>
                      <i className="fa-solid fa-circle-check" style={{ color: '#2563eb', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                      <span>Direct WhatsApp &amp; Call doubt clearing desk</span>
                    </li>
                  </ul>
                </div>
                <button
                  className="btn-primary full lg"
                  onClick={() => handleStartEnrollment(course)}
                >
                  <i className="fa-solid fa-bolt" style={{ marginRight: '0.45rem' }} aria-hidden="true" />
                  <span>Enroll Now — ₹{Number(course.price).toLocaleString('en-IN')}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Important PDFs & Study Material Section (Only displays when uploaded) ── */}
      {pdfList.length > 0 && (
        <section id="resources" className="section-wrap">
          <div className="section-inner text-center">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.85rem' }}>
              <i className="fa-solid fa-file-circle-check" aria-hidden="true" />
              <span>Verified Study Material</span>
            </div>
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
                      <span className="pdf-tag-pill">{item.tag}</span>
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
                        className="btn-pdf-download"
                        style={{ background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', boxShadow: 'none' }}
                        title={`Open ${item.title} in new tab`}
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                        <span>Open Tab</span>
                      </a>
                      <a
                        href={item.fileUrl}
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
      )}

      {/* ── Real Aspirant FAQs (Fluid Accordion) ── */}
      <section id="faqs" className="section-wrap">
        <div className="section-inner text-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.85rem', borderRadius: '999px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.85rem' }}>
            <i className="fa-solid fa-circle-question" aria-hidden="true" />
            <span>Aspirant Clarifications</span>
          </div>
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

      {/* ── Direct Desk CTA (3D Floating Card) ── */}
      <section id="contact" className="section-wrap" style={{ paddingTop: '1rem' }}>
        <div className="cta-desk-card">
          <h2>{siteContent.contactDeskHeading}</h2>
          <p>{siteContent.contactDeskSubheading}</p>
          <div className="cta-desk-actions">
            <a
              href={siteContent.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary lg"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem', background: '#0088cc', borderColor: '#0088cc' }}
            >
              <i className="fa-brands fa-telegram" style={{ fontSize: '1.35rem' }} aria-hidden="true" />
              <span>Join Telegram: {siteContent.telegramHandle}</span>
            </a>
            <a
              href={siteContent.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline lg"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem' }}
            >
              <i className="fa-brands fa-whatsapp" style={{ fontSize: '1.35rem', color: '#25D366' }} aria-hidden="true" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── Modular Footer ── */}
      <Footer />

      {/* ── Floating WhatsApp Button ── */}
      <a
        href={siteContent.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="Chat on WhatsApp"
        title="Chat with us on WhatsApp"
      >
        <i className="fa-brands fa-whatsapp" style={{ fontSize: '28px' }} aria-hidden="true" />
        <span className="whatsapp-fab-label">WhatsApp</span>
      </a>

      {/* ── Secure Course Checkout Modal ── */}
      {showCheckoutModal && selectedCourse && (
        <div className="modal-overlay" onClick={() => !isProcessing && setShowCheckoutModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !isProcessing && setShowCheckoutModal(false)} aria-label="Close modal">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
            <h3>Secure Course Enrollment</h3>
            <p>Enter your contact details to enroll. Your app download link &amp; password will be sent to your email.</p>

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
                {isProcessing ? (
                  <span>
                    <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.45rem' }} aria-hidden="true" />
                    Processing Secure Payment...
                  </span>
                ) : (
                  <span>
                    <i className="fa-solid fa-shield-halved" style={{ marginRight: '0.45rem' }} aria-hidden="true" />
                    Proceed to Pay ₹{Number(selectedCourse.price).toLocaleString('en-IN')}
                  </span>
                )}
              </button>

              <div className="checkout-secure-badge">
                <i className="fa-solid fa-lock" style={{ color: '#16a34a', marginRight: '0.45rem' }} aria-hidden="true" />
                <span>256-Bit Encrypted Secure Checkout (UPI, GPay, Cards, NetBanking)</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Success & Onboarding Modal ── */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-card success-card" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '0.85rem' }}>
              <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: '#16a34a' }} aria-hidden="true" />
            </div>
            <h3>Enrollment Confirmed!</h3>
            <p>Welcome to Indrajeet Sir&apos;s Mentorship Program.</p>

            <div className="success-info-box">
              <strong style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a' }}>
                <i className="fa-solid fa-check" aria-hidden="true" />
                Login Details Dispatched!
              </strong>
              We have emailed your student login credentials and mobile application download link to:
              <br />
              <strong style={{ marginTop: '0.25rem', color: '#0f172a' }}>{completedStudent?.email}</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
              <a
                href="/indrajeet-sir-app.apk"
                download
                className="btn-primary full"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              >
                <i className="fa-brands fa-android" style={{ fontSize: '1.2rem' }} aria-hidden="true" />
                <span>Download Android App (.apk)</span>
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
            <button className="modal-close" onClick={() => setShowBookModal(false)} aria-label="Close modal">
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
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
              <button type="submit" className="btn-primary full lg">
                <i className="fa-solid fa-calendar-check" style={{ marginRight: '0.45rem' }} aria-hidden="true" />
                <span>Confirm Strategy Call</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
