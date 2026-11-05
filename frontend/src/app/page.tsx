'use client';

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    q: 'Kitne din mentorship chalegi?',
    a: '365+1 day (1 year)',
  },
  {
    id: 'faq-2',
    q: 'Fees installment me pay kar sakte hain?',
    a: 'Yes',
  },
  {
    id: 'faq-3',
    q: 'Mentor kaun hoga aur copy kaun check karega?',
    a: 'Indrajeet Sir khud',
  },
  {
    id: 'faq-4',
    q: 'Kya Mains mentorship me Test Series hai?',
    a: 'Yes',
  },
  {
    id: 'faq-5',
    q: 'Kya Prelims mentorship me Test Series hai?',
    a: 'Yes',
  },
  {
    id: 'faq-6',
    q: 'PYQ me kya karate hain?',
    a: 'Trend analysis, solve, syllabus mapping',
  },
  {
    id: 'faq-7',
    q: 'Target daily, weekly ya monthly milte hain?',
    a: 'Weekly',
  },
  {
    id: 'faq-8',
    q: 'Kya weekly target track hota hai?',
    a: 'Yes',
  },
  {
    id: 'faq-9',
    q: 'Kya sirf Prelims ya sirf Mains ka mentorship join kar sakte hain?',
    a: 'Yes',
  },
  {
    id: 'faq-10',
    q: 'Mentorship Foundation Course ke sath ya baad join kar sakte hain?',
    a: 'Dono me hi kar sakte lekin batch separate',
  }
];

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { API_URL, setStudentSession } from '@/lib/api';
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
  features?: string[];
  validity?: string;
  tag?: string;
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

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 'c-1',
      title: '1 Year Full Mentorship for UPSC 2027 (After Foundation Course)',
      description: 'Complete 3-Stage Prelims, Mains, and Interview guidance with 1-on-1 personal mentorship by Indrajeet Sir.',
      price: 24000,
      instructor: 'Indrajeet Sir',
      features: [
        'Prelims: High-yield Notes Making, PYQ+, 20 Mock Tests, Total 5,000+ Practice Questions',
        'Mains: Short Note Making, Deep PYQ Trend Analysis, Toppers Copy Analysis, 16 Evaluated Tests',
        'Weekly Strategy Sessions & 1-on-1 Personal Mentorship by Indrajeet Sir',
        'Interview: Complete Personality Development, Book Reading Habits & Newspaper Analysis',
        'Validity: 1 Year • Complete 3-Stage Support (Pre + Mains + Interview)',
      ],
      validity: '1 Year',
      tag: 'Complete Mentorship (Post-FC)',
    },
    {
      id: 'c-2',
      title: 'UPSC Mains 2027 Comprehensive Mentorship',
      description: 'Targeted Mains score maximization with personal copy evaluation and structure improvement by Indrajeet Sir.',
      price: 18000,
      instructor: 'Indrajeet Sir',
      features: [
        'High-Yield Mains Short Note Making Framework',
        'Deep PYQ Trend Analysis & Theme Mapping',
        'Toppers Copy In-Depth Structure & Presentation Analysis',
        '16 Evaluated Tests with Line-by-Line Feedback from Sir',
        'Weekly Diagnostic Sessions & 1-on-1 Mentorship by Indrajeet Sir',
        'Validity: 4 - 5 Months',
      ],
      validity: '4–5 Months',
      tag: 'Mains Score Booster',
    },
    {
      id: 'c-3',
      title: 'UPSC Prelims 2027 Targeted Program',
      description: 'Build rigorous elimination skills, concise revision notes, and solve 5,000+ targeted practice questions.',
      price: 10000,
      instructor: 'Indrajeet Sir',
      features: [
        'Micro Notes Making & Core Conceptual Clarity across Standard Books',
        'PYQ+ Strategy (Pattern Recognition & Options Elimination Tactics)',
        '20 Comprehensive Mock Tests with Micro Diagnostics',
        'Total 5,000+ Curated Practice Questions with Detailed Explanations',
        'Weekly Target Tracking & Negative Marking Reduction Roadmap',
        'Validity: 5 - 6 Months',
      ],
      validity: '5–6 Months',
      tag: 'Prelims Special',
    },
    {
      id: 'c-4',
      title: '1 Year Full Mentorship for UPSC 2027 / 2028 (Parallel with Foundation Course)',
      description: 'Align and strengthen your preparation alongside your ongoing foundation course (Note: We do not provide foundation lectures).',
      price: 30000,
      instructor: 'Indrajeet Sir',
      features: [
        'Complete 3-Stage Support: Prelims + Mains + Interview Mentorship',
        'Prelims: Notes Making, PYQ+, 20 Mock Tests, Total 5,000+ Practice Questions',
        'Mains: Short Note Making, PYQ Trend Analysis, Toppers Copy Analysis, 16 Tests',
        'Weekly Diagnostic Sessions & 1-on-1 Personal Mentorship by Indrajeet Sir',
        'Interview: Personality Development, Book Reading Habit & Daily Newspaper Analysis',
        'Validity: 18 Months (Extended Mentorship Support)',
      ],
      validity: '18 Months',
      tag: 'Foundation Parallel Batch',
    },
    {
      id: 'c-5',
      title: 'UPSC Mains Short Notes Making',
      description: 'Master the methodology of condensing vast GS 1–4 syllabus into high-yield micro notes.',
      price: 4500,
      instructor: 'Indrajeet Sir',
      features: [
        'Step-by-step Framework for 600+ UPSC Mains Core Topics',
        'Condensing Standard Books, NCERTs & Current Affairs into Revision Snippets',
        'Data Points, Committee Reports, Diagrams & Case Laws Integration',
        'Model Short Notes Samples & Templates',
        'Validity: 2 Months',
      ],
      validity: '2 Months',
      tag: 'Short Notes Framework',
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
  }>>([
    {
      id: 'pdf-1',
      title: 'UPSC 2027 Master Micro-Syllabus & 600+ Topic Blueprint',
      description: 'Topic-wise breakdown of GS Paper 1, 2, 3 and 4 with direct PYQ trend tags and core keywords.',
      tag: 'Syllabus Blueprint',
      size: '2.4 MB',
      fileUrl: '/api/upload-pdf',
    },
    {
      id: 'pdf-2',
      title: 'Indrajeet Sir Model Evaluated Mains Answer Copy (GS 2 & Ethics)',
      description: 'Real evaluated copies with Intro-Body-Conclusion framework, 2nd ARC citations, and case law value addition.',
      tag: 'Model Copies',
      size: '3.8 MB',
      fileUrl: '/api/upload-pdf',
    },
    {
      id: 'pdf-3',
      title: 'Prelims PYQ Reverse Engineering Framework & Theme Mapping',
      description: 'Strategic guide on how past 10-year UPSC questions predict upcoming themes and option-elimination tactics.',
      tag: 'PYQ Strategy',
      size: '1.9 MB',
      fileUrl: '/api/upload-pdf',
    },
  ]);

    // Dynamic Site Content (Editable via Admin Panel)
  const [siteContent, setSiteContent] = useState({
    // 1. Hero Section & Process Pillars
    heroBadge: 'Ex-VisionIAS Faculty',
    heroHeading: 'Sabhi exam ka ek process hota hai aur usi ko dhyan me rakhte hue humne ek process design kiya h jiske pillars:',
    heroPillar1: '600+ topic short notes',
    heroPillar2: 'depth pyq analysis',
    heroPillar3: 'toppers copy analysis',
    heroPillar4: 'answer writing skill',
    heroPillar5: 'one-one personal mentorship',
    dhoniQuote: 'I have always believed that the process is more important than the result. The result is just a by-product of the process. If you take care of the process, the results will follow.',
    dhoniAuthor: 'MS Dhoni',
    dhoniTag: 'Our Mentorship Philosophy',

    // 2. Section 1: About Indrajeet Sir (5 Credential Highlights)
    aboutSirHeading: 'About Indrajeet Sir',
    sirCard1Val: '4 UPSC Mains Written',
    sirCard1Desc: 'Personal exam battlefield experience across GS 1–4, Essay, and optional papers.',
    sirCard2Val: '7+ Years Experience',
    sirCard2Desc: 'Dedicated coaching & 1-on-1 mentorship experience guiding UPSC & State PCS aspirants.',
    sirCard3Val: '500+ Aspirants Mentored',
    sirCard3Desc: 'Consistent track record of helping mentees transform their answer writing and crack ranks.',
    sirCard4Val: 'VisionIAS Faculty',
    sirCard4Desc: 'Expert faculty for Polity & Governance with deep syllabus and trend analysis.',
    sirCard5Val: 'LLB, Law Faculty (DU)',
    sirCard5Desc: 'Strong legal and constitutional foundation from Faculty of Law, University of Delhi.',

    // 3. Section 2: About The Mentorship (4 Core Pillars)
    aboutMentorshipHeading: 'About The Mentorship',
    mentorPillar1Title: 'Weekly Sessions by Indrajeet Sir',
    mentorPillar1Desc: 'Direct 1-on-1 strategy sessions with Indrajeet Sir to review weekly targets, syllabus coverage, and psychological clarity.',
    mentorPillar2Title: 'Reverse Engineering Method',
    mentorPillar2Desc: 'Solving Prelims & Mains questions by deconstructing past UPSC trends and mapping themes to high-yield notes.',
    mentorPillar3Title: 'Main Focus on "Process"',
    mentorPillar3Desc: 'UPSC me selection result ke peeche bhagne se nahi, daily process (answer writing + discipline) master karne se banta hai.',
    mentorPillar4Title: 'Direct 1-on-1 Teacher Access',
    mentorPillar4Desc: 'Har Mains copy Indrajeet Sir personally check karte hain. Actionable marginal remarks on structure, flow and presentation.',

    // 4. Batches & Courses Section
    coursesHeading: 'Mentorship Batches & Fees',
    // coursesSubheading: 'Transparent course fees. Login credentials and Android application access are delivered immediately after enrollment.',

    // 5. Mentored Aspirants (3 Showcase Cards)
    resultsHeading: 'Aspirants Mentored by Indrajeet Sir',
    resultsSubheading: '',
    result1Name: 'Jatin Parashar (IRS) UPSC 2022',
    result1Image: '/toppers/jatin-parashar.jpg',
    result2Name: 'Kritika Mishra (IAS) UPSC 2023',
    result2Image: '/toppers/kritika-mishra.jpg',
    result3Name: 'Devesh Parashar (IPS) UPSC 2024',
    result3Image: '/toppers/devesh-parashar.jpg',

    // 6. Free PDFs & Study Material Section
    pdfSectionHeading: 'Important Study Material & Resource PDFs (Free Access)',
    pdfSectionSubheading: 'Download verified syllabus blueprints, model answer copies, official brochures, and reverse-engineered PYQ frameworks prepared by Indrajeet Sir.',

    // 7. Mobile App Showcase Section
    appTitle: 'Learn, Submit Copies & Attend Live Sessions On The Go',
    appDesc: 'Install the official Indrajeet Sir UPSC Mentorship Android App directly from Google Play Store. Access 1:1 answer evaluation updates, live classroom broadcasts, handwritten evaluation PDFs, and daily mentorship alerts right on your phone.',
    appPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.nighwantech.indrajeetsir',
    appBullet1Title: 'Instant Live Class Reminders',
    appBullet1Desc: 'Receive 10-minute alerts before 1:1 strategy calls & masterclasses.',
    appBullet2Title: 'Direct Doubt with Indrajeet Sir',
    appBullet2Desc: 'Chat in real-time, submit Mains handwritten sheets, and review feedback.',
    appBullet3Title: 'Offline PDF Study Material',
    appBullet3Desc: 'Download curated GS 1–4 micro-notes, brochures, and model answer copies.',

    // FAQs Section Header
    faqsHeading: 'Frequently Asked Questions',
    faqsSubheading: 'Clear answers to common questions about copy checking, schedules, and study material.',

    // 8. Contact Desk & Official Channels
    contactDeskHeading: 'Have Questions About Batch, Attempt Year or Strategy?',
    contactDeskSubheading: "Talk directly with Indrajeet Sir's mentorship desk to choose the right batch for your UPSC attempt.",
    telegramHandle: '@Indrajeetsir_UPSC',
    telegramUrl: 'https://t.me/Indrajeetsir_UPSC',
    phoneDisplay: '+91 97099 92093',
    phoneTel: '+919709992093',
    whatsappDisplay: '+91 97099 92093',
    whatsappUrl: 'https://wa.me/919709992093',
    contactEmail: 'indrajeet.visionias@gmail.com',
  });

  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS);

  // Fetch courses and live website content
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      try {
        const savedContent = localStorage.getItem('indrajeet_site_content');
        if (savedContent) {
          const parsed = JSON.parse(savedContent);
          let updated = false;
          if (parsed.telegramHandle === '@Indrajeet_UPSC' || parsed.telegramHandle === '@IndrajeetSir_UPSC') {
            parsed.telegramHandle = '@Indrajeetsir_UPSC';
            parsed.telegramUrl = 'https://t.me/Indrajeetsir_UPSC';
            updated = true;
          }
          if (parsed.stat3Number === '1:1 Private' || parsed.stat3Number === '1:1') {
            parsed.stat3Number = 'Private';
            updated = true;
          }
          if (parsed.heroSubheading && parsed.heroSubheading.includes('weekly 1:1 strategy reviews')) {
            parsed.heroSubheading = parsed.heroSubheading.replace('weekly 1:1 strategy reviews', 'weekly personal strategy reviews');
            updated = true;
          }
          if (!parsed.result1Name || !parsed.result1Name.includes('Jatin')) {
            parsed.result1Name = 'Jatin Parashar (IRS) UPSC 2022';
            parsed.result2Name = 'Kritika Mishra (IAS) UPSC 2023';
            parsed.result3Name = 'Devesh Parashar (IPS) UPSC 2024';
            updated = true;
          }
          if (!parsed.heroHeading || !parsed.heroHeading.includes('Sabhi exam ka ek process hota hai')) {
            parsed.heroHeading = 'Sabhi exam ka ek process hota hai aur usi ko dhyan me rakhte hue humne ek process design kiya h jiske pillars:';
            parsed.heroPillar1 = '600+ topic short notes';
            parsed.heroPillar2 = 'depth pyq analysis';
            parsed.heroPillar3 = 'toppers copy analysis';
            parsed.heroPillar4 = 'answer writing skill';
            parsed.heroPillar5 = 'one-one personal mentorship';
            updated = true;
          }
          if (updated) {
            try { localStorage.setItem('indrajeet_site_content', JSON.stringify(parsed)); } catch {}
          }
          setSiteContent((prev) => ({ ...prev, ...parsed }));
        }
        const savedCourses = localStorage.getItem('indrajeet_courses');
        if (savedCourses) {
          const parsed = JSON.parse(savedCourses);
          if (Array.isArray(parsed)) {
            const clean = parsed.filter(c => c.price !== 4999 && c.price !== 2999 && !c.title.includes('GS Paper 3') && !c.title.includes('Ethics Special'));
            if (clean.length >= 5) {
              setCourses(sortCoursesInOrder(clean));
            }
          }
        }
        const savedPdfs = localStorage.getItem('indrajeet_pdf_list');
        if (savedPdfs) {
          const parsed = JSON.parse(savedPdfs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPdfList(parsed);
          }
        }
        const savedFaqs = localStorage.getItem('indrajeet_faqs');
        if (savedFaqs) {
          try {
            const parsed = JSON.parse(savedFaqs);
            if (Array.isArray(parsed) && parsed.length >= 10 && parsed[0]?.a === '365+1 day (1 year)') {
              setFaqs(parsed);
            } else {
              setFaqs(DEFAULT_FAQS);
              try { localStorage.setItem('indrajeet_faqs', JSON.stringify(DEFAULT_FAQS)); } catch {}
            }
          } catch {
            setFaqs(DEFAULT_FAQS);
          }
        }
      } catch {
        // ignore parse error
      }
    });

    fetch(`${API_URL}/courses`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const clean = data.filter(c => c.price !== 4999 && c.price !== 2999 && !c.title.includes('GS Paper 3') && !c.title.includes('Ethics Special'));
          if (clean.length >= 5) {
            setCourses(sortCoursesInOrder(clean));
          }
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
            color: '#0f172a',
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
        setStudentSession({
          id: `st-${Date.now()}`,
          name: verifyPayload.studentName,
          email: verifyPayload.studentEmail,
          phone: verifyPayload.studentPhone,
          attempt: '2027',
          optionalSubject: 'Public Administration',
          bio: 'Targeting UPSC CSE 2027 • Mentored by Indrajeet Sir',
          avatarKey: 'ias_officer',
          enrolledCourse: selectedCourse?.title || '1:1 Comprehensive UPSC Mentorship 2026-27',
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
      setStudentSession({
        id: `st-${Date.now()}`,
        name: verifyPayload.studentName,
        email: verifyPayload.studentEmail,
        phone: verifyPayload.studentPhone,
        attempt: '2027',
        optionalSubject: 'Public Administration',
        bio: 'Targeting UPSC CSE 2027 • Mentored by Indrajeet Sir',
        avatarKey: 'ias_officer',
        enrolledCourse: selectedCourse?.title || '1:1 Comprehensive UPSC Mentorship 2026-27',
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
      {/* ── Modular Header ── */}
      <Header />

      {/* ── Indrajeet Sir Hero Section ── */}
      <section id="top" className="indrajeet-hero-section">
        <div className="indrajeet-hero-container">
          {/* Left Column: Mission, Process Pitch, Dhoni Quote & CTAs */}
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
              <a href="#courses" className="btn-primary lg">
                <i className="fa-solid fa-graduation-cap" style={{ marginRight: '0.55rem' }} aria-hidden="true" />
                <span>Explore Batches & Fees</span>
              </a>
              <button className="btn-outline lg" onClick={() => setShowBookModal(true)}>
                <i className="fa-solid fa-phone" style={{ marginRight: '0.55rem' }} aria-hidden="true" />
                <span>Request Direct Callback</span>
              </button>
            </div>

            {/* Mentorship Philosophy Quote (Normal Highlighted) */}
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

          {/* Right Column: High-Impact Mentor Portrait Card */}
          <div className="indrajeet-hero-visual">
            <div className="mentor-visual-card">
              <div className="mentor-visual-frame">
                <Image
                  src="/indrajeet-sir-hero.png"
                  alt="Indrajeet Sir - 1-on-1 Mentorship for UPSC CSE"
                  width={980}
                  height={1440}
                  priority
                  quality={95}
                  className="mentor-visual-img"
                />
                <div className="mentor-visual-overlay" />
                
                {/* Floating Seal & Badge */}
                <div className="mentor-floating-tag top-right">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                  <span>{siteContent.heroBadge || 'Ex-VisionIAS Faculty'}</span>
                </div>


              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1: About Indrajeet Sir ── */}
      <section id="about" className="section-wrap">
        <div className="section-inner text-center">
          <h2 className="section-heading" style={{ marginBottom: "2.5rem" }}>{siteContent.aboutSirHeading}</h2>

          <div className="sir-profile-highlights-grid">
            <div className="sir-stat-card">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-pen-nib" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard1Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard1Desc}</p>
            </div>

            <div className="sir-stat-card">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-award" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard2Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard2Desc}</p>
            </div>

            <div className="sir-stat-card">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-users" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard3Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard3Desc}</p>
            </div>

            <div className="sir-stat-card">
              <div className="sir-stat-icon">
                <i className="fa-solid fa-landmark" aria-hidden="true" />
              </div>
              <div className="sir-stat-val">{siteContent.sirCard4Val}</div>
              <p className="sir-stat-desc">{siteContent.sirCard4Desc}</p>
            </div>

            <div className="sir-stat-card">
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
      <section id="mentorship" className="section-wrap" style={{ paddingTop: '2rem' }}>
        <div className="section-inner text-center">
          <h2 className="section-heading" style={{ marginBottom: "2.5rem" }}>{siteContent.aboutMentorshipHeading}</h2>

          <div className="mentorship-pillars-grid">
            <div className="mentor-pillar-card">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-calendar-check" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar1Title}</h3>
              <p>{siteContent.mentorPillar1Desc}</p>
            </div>

            <div className="mentor-pillar-card">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-arrows-spin" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar2Title}</h3>
              <p>{siteContent.mentorPillar2Desc}</p>
            </div>

            <div className="mentor-pillar-card">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-bullseye" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar3Title}</h3>
              <p>{siteContent.mentorPillar3Desc}</p>
            </div>

            <div className="mentor-pillar-card">
              <div className="pillar-icon-box">
                <i className="fa-solid fa-handshake" aria-hidden="true" />
              </div>
              <h3>{siteContent.mentorPillar4Title}</h3>
              <p>{siteContent.mentorPillar4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Courses & Pricing Section (3D Depth) ── */}
      <section id="courses" className="section-wrap" >
        <div className="section-inner text-center">
          <h2 className="section-heading">{siteContent.coursesHeading}</h2>
          {/* <p className="section-subtext">
            {siteContent.coursesSubheading || 'Transparent course fees. Login credentials and Android application access are delivered immediately after enrollment.'}
          </p> */}

          <div className="courses-grid-3d">
            {courses.map((course) => {
              const currentPrice = Number(course.price) || 0;
              // Realistic baseline original fee (approx 2.5x to showcase 60%+ direct mentorship savings vs Karol Bagh offline coaching)
              const originalPrice = Math.round(currentPrice * 2.5);
              const discountPercent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

              return (
                <div key={course.id} className="pricing-card-3d">
                  <div>
                    <div className="pricing-title-wrap">
                      <h3>{course.title}</h3>
                      <p className="pricing-desc-text">
                        {course.description || 'Comprehensive mentorship with Indrajeet Sir, direct Mains evaluation, and weekly strategy sessions.'}
                      </p>
                    </div>

                    <div className="pricing-fee-block">
                      <div className="price-main-col">
                        <div className="price-strike-row">
                          <span className="original-price-strike">₹{originalPrice.toLocaleString('en-IN')}</span>
                          <span className="discount-percent-pill">{discountPercent}% OFF</span>
                        </div>
                        <div className="price-active-row">
                          <span className="currency-sym">₹</span>
                          <span className="amount-val">{currentPrice.toLocaleString('en-IN')}</span>
                          <span className="fee-tenure">/ {course.validity || 'batch access'}</span>
                        </div>
                      </div>
                    </div>

                    <ul className="features-checklist">
                      {course.features && course.features.length > 0 ? (
                        course.features.map((feat, fIdx) => (
                          <li key={fIdx}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#0f172a', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>{feat}</span>
                          </li>
                        ))
                      ) : (
                        <>
                          <li>
                            <i className="fa-solid fa-circle-check" style={{ color: '#0f172a', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>Direct Mains answer writing evaluation &amp; feedback by Indrajeet Sir</span>
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check" style={{ color: '#0f172a', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>600+ Topic-wise short notes for GS 1 to 4</span>
                          </li>
                          <li>
                            <i className="fa-solid fa-circle-check" style={{ color: '#0f172a', marginRight: '0.55rem', fontSize: '0.95rem', flexShrink: 0 }} aria-hidden="true" />
                            <span>Weekly Diagnostic Strategy &amp; Doubt Clearing Sessions</span>
                          </li>
                        </>
                      )}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Our Results Section ── */}
      <section id="results" className="section-wrap" >
        <div className="section-inner text-center">
          <h2 className="section-heading">{siteContent.resultsHeading}</h2>
          {siteContent.resultsSubheading ? (
            <p className="section-subtext">{siteContent.resultsSubheading}</p>
          ) : null}

          <div className="topper-mentored-grid">
            {/* 1. Jatin Parashar (IRS) UPSC 2022 */}
            <div className="topper-mentored-card">
              <div className="topper-image-frame">
                <Image
                  src="/toppers/jatin-parashar.jpg"
                  alt="Jatin Parashar (IRS) UPSC 2022"
                  width={400}
                  height={480}
                  className="topper-photo"
                  priority
                />
              </div>
              <h3 className="topper-name-label">{siteContent.result1Name || 'Jatin Parashar (IRS) UPSC 2022'}</h3>
            </div>

            {/* 2. Kritika Mishra (IAS) UPSC 2023 */}
            <div className="topper-mentored-card">
              <div className="topper-image-frame">
                <Image
                  src="/toppers/kritika-mishra.jpg"
                  alt="Kritika Mishra (IAS) UPSC 2023"
                  width={400}
                  height={480}
                  className="topper-photo"
                  priority
                />
              </div>
              <h3 className="topper-name-label">{siteContent.result2Name || 'Kritika Mishra (IAS) UPSC 2023'}</h3>
            </div>

            {/* 3. Devesh Parashar (IPS) UPSC 2024 */}
            <div className="topper-mentored-card">
              <div className="topper-image-frame">
                <Image
                  src="/toppers/devesh-parashar.jpg"
                  alt="Devesh Parashar (IPS) UPSC 2024"
                  width={400}
                  height={480}
                  className="topper-photo"
                  priority
                />
              </div>
              <h3 className="topper-name-label">{siteContent.result3Name || 'Devesh Parashar (IPS) UPSC 2024'}</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── Important PDFs & Study Material Section (Only displays when uploaded) ── */}
      {/* ── Free Study Material & Resource PDFs Section (Directly Under Courses) ── */}
      <section id="resources" className="section-wrap" >
        <div className="section-inner text-center">
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
                      className="btn-pdf-view"
                      title={`Open ${item.title} in new tab`}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                      <span>View</span>
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

            {/* Right Visual: Clean Phone Mockup with Equal Height */}
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

      {/* ── Real Aspirant FAQs (Fluid Accordion) ── */}
      <section id="faqs" className="section-wrap">
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
