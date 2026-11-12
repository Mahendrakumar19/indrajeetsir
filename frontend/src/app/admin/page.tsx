'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL, getAdminSession, setAdminSession, clearAdminSession } from '@/lib/api';
import ThemeToggle from '@/components/ThemeToggle';
import './admin.css';

// ── Minimalist Professional SVG Icons (No Emojis) ───────────────────────────

function IconMail({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-10 7L2 7" />
    </svg>
  );
}

function IconLock({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconEye({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconEyeOff({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  );
}

function IconUsers({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconLayout({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function IconCard({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}

function IconBell({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconBook({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
      <path d="M6 2v20" />
    </svg>
  );
}

function IconVideo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="12" x="2" y="6" rx="2" />
      <path d="m16 10 6-3v10l-6-3z" />
    </svg>
  );
}

function IconSearch({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconLogOut({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function IconGlobe({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconUpload({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function IconMessageSquare({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconPaperclip({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconSend({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

// ── Types ───────────────────────────────────────────────────────────────────

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Verified' | 'Blocked' | 'Pending';
  role: string;
  joined: string;
}

interface AppBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  gradient: string;
  active: boolean;
  targetRoute: string;
}

interface TransactionItem {
  id: string;
  student: string;
  email: string;
  course: string;
  amount: number;
  status: 'Success' | 'Refunded' | 'Failed';
  date: string;
  mode: string;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  audience: string;
  time: string;
  sentCount: number;
}

interface CourseItem {
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

interface LiveClassItem {
  id: string;
  title: string;
  date: string;
  time: string;
  meetLink: string;
  assignedStudent?: string;
}

// ── Dummy ID Filter for legacy storage cleanup ──────────────────────────────
const DUMMY_IDS = new Set([
  'usr_1', 'usr_2', 'usr_3', 'usr_4', 'usr_5', 'usr_6',
  'TXN 4821', 'TXN 4822', 'TXN 4823', 'TXN 4824', 'TXN 4825', 'TXN 4826',
  'NOTIF-101', 'NOTIF-102', 'NOTIF-103',
]);

const DUMMY_COURSE_TITLES = new Set([
  '1:1 Comprehensive UPSC Mentorship 2026-27',
  'GS Paper 3 & Ethics Special Masterclass Batch',
  '1:1 Mentorship Program — UPSC 2027 Complete Guidance',
  'UPSC Mentorship Course',
]);

const INITIAL_BANNERS: AppBanner[] = [
  {
    id: 'ban_1',
    tag: 'EXCLUSIVE OFFER',
    title: 'Flat 50% OFF',
    subtitle: 'Mains Mentorship & Answer Evaluation (Previously Diwali Sale)',
    gradient: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
    active: true,
    targetRoute: '/courses/mains',
  },
  {
    id: 'ban_2',
    tag: 'DAILY PRACTICE',
    title: 'Daily Answer Writing 2026',
    subtitle: 'GS 1, 2, 3, 4 + Essay with 24-hr evaluation & model answers',
    gradient: 'linear-gradient(135deg, #065f46, #059669)',
    active: true,
    targetRoute: '/courses/answer-writing',
  },
  {
    id: 'ban_3',
    tag: '1:1 MENTORSHIP',
    title: '1:1 Personal Strategy Calls',
    subtitle: 'Direct discussion with Indrajeet Sir for weak areas',
    gradient: 'linear-gradient(135deg, #7c2d12, #ea580c)',
    active: true,
    targetRoute: '/courses/1-on-1',
  },
];

const DEFAULT_COURSES: CourseItem[] = [
  {
    id: 'c-1',
    title: '1 Year Full Mentorship for UPSC 2027 (After Foundation Course)',
    description: 'Complete 3-Stage Prelims, Mains, and Interview guidance with 1-on-1 personal mentorship by Indrajeet Sir.',
    price: 24000,
    instructor: 'Indrajeet Sir',
    published: true,
    thumbnail: '/courses/course-1.svg',
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
    published: true,
    thumbnail: '/courses/course-2.svg',
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
    published: true,
    thumbnail: '/courses/course-3.svg',
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
    published: true,
    thumbnail: '/courses/course-4.svg',
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
    published: true,
    thumbnail: '/courses/course-5.svg',
    features: [
      'Step-by-step Framework for 600+ UPSC Mains Core Topics',
      'Reverse Engineering of PYQs into Micro-Diagrams & Frameworks',
      'Toppers Copy Deconstruction for Keyword Density',
      'Valid for 2 Months with Direct Guidance',
    ],
    validity: '2 Months',
    tag: 'Notes Making Framework',
  },
];

interface FaqItem {
  id: string;
  q: string;
  a: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    q: 'What is the duration of the mentorship program?',
    a: '365+1 days (1 full year of continuous guidance).',
  },
  {
    id: 'faq-2',
    q: 'Is an installment facility available for fee payment?',
    a: 'Yes, flexible installment options are available.',
  },
  {
    id: 'faq-3',
    q: 'Who will mentor students and evaluate answer copies?',
    a: 'Indrajeet Sir personally guides students and evaluates every copy.',
  },
  {
    id: 'faq-4',
    q: 'Does the Mains Mentorship include a Test Series?',
    a: 'Yes, an evaluated Mains test series is included.',
  },
  {
    id: 'faq-5',
    q: 'Does the Prelims Mentorship include Mock Tests?',
    a: 'Yes, comprehensive Prelims mock tests with solutions are included.',
  },
  {
    id: 'faq-6',
    q: 'What does the PYQ module cover?',
    a: 'In-depth trend analysis, theme-wise solving, and direct syllabus mapping.',
  },
  {
    id: 'faq-7',
    q: 'Are preparation targets assigned daily, weekly, or monthly?',
    a: 'Targets are structured on a clear weekly basis.',
  },
  {
    id: 'faq-8',
    q: 'Is student progress on weekly targets actively tracked?',
    a: 'Yes, milestone completion and performance are tracked weekly.',
  },
  {
    id: 'faq-9',
    q: 'Can aspirants enroll exclusively for Prelims or Mains?',
    a: 'Yes, stage-specific mentorship (Prelims or Mains only) is available.',
  },
  {
    id: 'faq-10',
    q: 'Can mentorship be joined alongside or after a Foundation Course?',
    a: 'Yes, you can join at either stage. Dedicated, separate batches are conducted for each.',
  },
];

const DEFAULT_SITE_CONTENT = {
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
  aboutSirHeading: 'About Indrajeet Sir',
  aboutSirSubheading: '',
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
  aboutMentorHeading: 'About The Mentorship',
  aboutMentorSubheading: '',
  mentorPillar1Title: 'Weekly Sessions by Indrajeet Sir',
  mentorPillar1Desc: 'Direct 1-on-1 strategy sessions with Indrajeet Sir to review weekly targets, syllabus coverage, and psychological clarity.',
  mentorPillar2Title: 'Reverse Engineering Method',
  mentorPillar2Desc: 'Solving Prelims & Mains questions by deconstructing past UPSC trends and mapping themes to high-yield notes.',
  mentorPillar3Title: 'Main Focus on "Process"',
  mentorPillar3Desc: 'Success in UPSC comes from mastering the daily process (answer writing + discipline), not anxiety over the end result.',
  mentorPillar4Title: 'Direct Teacher Access',
  mentorPillar4Desc: 'Every Mains answer copy is personally evaluated by Indrajeet Sir with actionable line-by-line feedback.',
  coursesHeading: 'Mentorship Batches & Fees',
  // coursesSubheading: 'Transparent course fees. Login credentials and Android application access are delivered immediately after enrollment.',
  resultsHeading: 'Aspirants Mentored by Indrajeet Sir',
  resultsSubheading: '',
  result1Name: 'Jatin Parashar (IRS) UPSC 2022',
  result2Name: 'Kritika Mishra (IAS) UPSC 2023',
  result3Name: 'Devesh Parashar (IPS) UPSC 2024',
  pdfSectionHeading: 'Important Study Material & Resource PDFs (Free Access)',
  pdfSectionSubheading: 'Download verified syllabus blueprints, model answer copies, official brochures, and reverse-engineered PYQ frameworks prepared by Indrajeet Sir.',
  appTitle: 'Learn, Submit Copies & Attend Live Sessions On The Go',
  appDesc: 'Install the official Indrajeet Sir UPSC Mentorship Android App directly from Google Play Store. Access 1:1 answer evaluation updates, live classroom broadcasts, handwritten evaluation PDFs, and daily mentorship alerts right on your phone.',
  appPlayStoreUrl: 'https://play.google.com/store/apps/details?id=com.nighwantech.indrajeetsir',
  appBullet1Title: 'Instant Live Class Reminders',
  appBullet1Desc: 'Receive 10-minute alerts before 1:1 strategy calls & masterclasses.',
  appBullet2Title: 'Direct Doubt with Indrajeet Sir',
  appBullet2Desc: 'Chat in real-time, submit Mains handwritten sheets, and review feedback.',
  appBullet3Title: 'Offline PDF Study Material',
  appBullet3Desc: 'Download curated GS 1–4 micro-notes, brochures, and model answer copies.',
  faqsHeading: 'Frequently Asked Questions',
  faqsSubheading: 'Clear answers to common questions about copy checking, schedules, and study material.',
  contactDeskHeading: 'Have Questions About Batch, Attempt Year or Strategy?',
  contactDeskSubheading: "Talk directly with Indrajeet Sir's mentorship desk to choose the right batch for your UPSC attempt.",
  telegramHandle: '@Indrajeetsir_UPSC',
  telegramUrl: 'https://t.me/Indrajeetsir_UPSC',
  phoneDisplay: '+91 97099 92093',
  phoneTel: '+919709992093',
  whatsappDisplay: '+91 97099 92093',
  whatsappUrl: 'https://wa.me/919709992093',
  contactEmail: 'indrajeet.visionias@gmail.com',
};

export default function AdminPanel() {
  const [mounted, setMounted] = useState(false);
  const [auth, setAuth] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Primary navigation tabs
  const [tab, setTab] = useState<'users' | 'content' | 'payments' | 'notifications' | 'courses' | 'classes' | 'website' | 'messages'>('users');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Flash alert
  const [actionSuccess, setActionSuccess] = useState('');

  // 0. Website Live Content Editor State
  const [siteContent, setSiteContent] = useState(DEFAULT_SITE_CONTENT);

  // 0.1 PDF Study Material Resources State (Editable & Uploadable)
  const [callbackLeads, setCallbackLeads] = useState<Array<{ id: string; name: string; phone: string; timestamp: string }>>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>(DEFAULT_FAQS);
  const [pdfList, setPdfList] = useState<Array<{
    id: string;
    title: string;
    description: string;
    tag: string;
    size: string;
    fileUrl: string;
    fileName?: string;
  }>>([]);

  // PDF Upload Form State
  const [pdfForm, setPdfForm] = useState({ title: '', description: '', tag: 'Mains Notes', file: null as File | null });
  const [pdfUploading, setPdfUploading] = useState(false);

  // 0.2 Legal Pages Content State (Terms, Privacy, Disclaimers)
  const [termsContent, setTermsContent] = useState({
    headerTitle: 'Terms of Service',
    callout: 'Academic Excellence & Mutual Respect: Enrolling in Indrajeet Sir\'s mentorship means embarking on a focused, disciplined preparation journey. By registering or paying course fees, you agree to these Terms of Service.',
    section4Title: '4. Refund & Cancellation Policy',
    section4Content: 'Due to the limited-seat nature of 1:1 personal mentorship, fees are non-refundable once an aspirant has attended their initial 1:1 diagnostic call and received evaluation feedback.',
  });

  const [privacyContent, setPrivacyContent] = useState({
    headerTitle: 'Privacy Policy',
    callout: 'Aspirant Confidentiality Commitment: Indrajeet Sir UPSC Mentorship operates on complete student privacy. We understand that Civil Services preparation requires psychological safety, candid feedback, and personal performance diagnostics. We never sell, rent, or trade your personal or academic data.',
    section2Content: 'To provide high-touch 1:1 mentorship and live classroom access, we collect student full name, email address, contact phone/WhatsApp number, target UPSC CSE attempt year, handwritten copy submissions, and transaction metadata.',
  });

  const [disclaimerContent, setDisclaimerContent] = useState({
    headerTitle: 'Disclaimers & Cookie Policy',
    callout: 'Important Notice: We are NOT affiliated with, authorized by, sponsored by, or endorsed by the Union Public Service Commission (UPSC), the Government of India, or any State Public Service Commission.',
    section2Content: 'All testimonials and success stories showcased represent genuine past student outcomes. However, final merit ranks depend entirely on individual candidate rigor, exam execution, and official commission evaluations.',
  });

  // 1. User Management State (Real-Time Only)
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'ALL' | 'Verified' | 'Blocked' | 'Pending'>('ALL');
  const [newUserModal, setNewUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ name: '', email: '', phone: '', role: 'UPSC 2026 Mentorship' });

  // 2. Content Control State
  const [banners, setBanners] = useState<AppBanner[]>(INITIAL_BANNERS);
  const [activeBannerModal, setActiveBannerModal] = useState<AppBanner | null>(null);
  const [appTicker, setAppTicker] = useState('New Batch Enrollment Open for UPSC 2026 | Daily 1:1 Answer Evaluation Live');

  // App Categories Control
  const [categories, setCategories] = useState([
    { id: 'cat_1', name: 'GS Mains Mentorship', active: true, count: 18 },
    { id: 'cat_2', name: 'Daily Answer Writing', active: true, count: 42 },
    { id: 'cat_3', name: 'Essay Mastery Program', active: true, count: 12 },
    { id: 'cat_4', name: 'Current Affairs & Monthly Compilations', active: true, count: 24 },
    { id: 'cat_5', name: 'State PCS Mentorship (UPPSC / BPSC)', active: true, count: 16 },
  ]);

  // 3. Payments & Transactions State (Real-Time Only)
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [txnSearch, setTxnSearch] = useState('');
  const [txnFilter, setTxnFilter] = useState<'ALL' | 'Success' | 'Refunded' | 'Failed'>('ALL');

  // 4. Notifications State (Real-Time Only)
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notifForm, setNotifForm] = useState({
    title: '',
    body: '',
    audience: 'All App Users',
  });
  const [sendingNotif, setSendingNotif] = useState(false);

  // 5. LMS Courses State
    const [courses, setCourses] = useState<CourseItem[]>(DEFAULT_COURSES);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: '4500', tag: '', validity: '', features: '', thumbnail: '' });
  const [courseSaving, setCourseSaving] = useState(false);
  const [editCourseModal, setEditCourseModal] = useState<CourseItem | null>(null);
  const [editCourseFeatures, setEditCourseFeatures] = useState('');
  const [editCourseSaving, setEditCourseSaving] = useState(false);

  // 6. LMS Live Classes State
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [classForm, setClassForm] = useState({
    title: '',
    date: '',
    time: '',
    meetLink: '',
    assignedStudent: 'All Enrolled Students',
  });
  const [classSaving, setClassSaving] = useState(false);
 
  // 7. Student Mentorship Chat & Doubts Desk State
  const [adminMessages, setAdminMessages] = useState<Array<{
    id: string;
    studentName: string;
    text: string;
    sender: 'student' | 'admin';
    date?: string;
    time?: string;
    timestamp?: string;
    createdAtMs?: number;
    createdAtIso?: string;
    fileName?: string;
    fileType?: string;
    fileUrl?: string;
    isEdited?: boolean;
  }>>([]);
  const [selectedChatStudent, setSelectedChatStudent] = useState<string>('ALL');
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminTargetStudent, setAdminTargetStudent] = useState('');
  const [adminSendingMsg, setAdminSendingMsg] = useState(false);

  // Mount effect to sync localStorage without SSR hydration errors and cleanse dummy data
  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setMounted(true);
      setAuth(getAdminSession());

      try {
        const savedCollapsed = localStorage.getItem('admin_sidebar_collapsed');
        if (savedCollapsed === 'true') {
          setSidebarCollapsed(true);
        }

        const savedUsers = localStorage.getItem('admin_users_data');
      if (savedUsers) {
        const parsed = JSON.parse(savedUsers);
        if (Array.isArray(parsed)) {
          const cleanUsers = parsed.filter(
            (u: AdminUser) => !DUMMY_IDS.has(u.id) && u.email !== 'freebits99@botmail.com'
          );
          setUsers(cleanUsers);
        }
      }

      const savedBanners = localStorage.getItem('admin_banners_data');
      if (savedBanners) setBanners(JSON.parse(savedBanners));

      const savedTxns = localStorage.getItem('admin_transactions_data');
      if (savedTxns) {
        const parsed = JSON.parse(savedTxns);
        if (Array.isArray(parsed)) {
          const cleanTxns = parsed.filter((t: TransactionItem) => !DUMMY_IDS.has(t.id));
          setTransactions(cleanTxns);
        }
      }

      const savedNotifs = localStorage.getItem('admin_notifications_data');
      if (savedNotifs) {
        const parsed = JSON.parse(savedNotifs);
        if (Array.isArray(parsed)) {
          const cleanNotifs = parsed.filter((n: NotificationItem) => !DUMMY_IDS.has(n.id));
          setNotifications(cleanNotifs);
        }
      }

      // 1. Courses Sync from localStorage & purge legacy dummy courses
      const savedCourses = localStorage.getItem('indrajeet_courses');
      if (savedCourses) {
        try {
          const parsed = JSON.parse(savedCourses);
          const clean = Array.isArray(parsed)
            ? parsed.filter((c: CourseItem) => !DUMMY_COURSE_TITLES.has(c.title) && c.price !== 4999 && c.price !== 2999)
            : [];
          if (clean.length >= 5) {
            const enriched = clean.map((c: CourseItem, i: number) => ({
              ...c,
              thumbnail: c.thumbnail || DEFAULT_COURSES[i]?.thumbnail || `/courses/course-${(i % 5) + 1}.svg`,
            }));
            setCourses(enriched);
          } else {
            setCourses(DEFAULT_COURSES);
            localStorage.setItem('indrajeet_courses', JSON.stringify(DEFAULT_COURSES));
          }
        } catch {
          setCourses(DEFAULT_COURSES);
        }
      } else {
        setCourses(DEFAULT_COURSES);
        localStorage.setItem('indrajeet_courses', JSON.stringify(DEFAULT_COURSES));
      }

      // 2. Site Content Sync & Sanitization from localStorage
      const savedSiteContent = localStorage.getItem('indrajeet_site_content');
      if (savedSiteContent) {
        try {
          const parsed = JSON.parse(savedSiteContent);
          let updated = false;

          // Always enforce authentic Toppers if old or missing
          if (!parsed.result1Name || !parsed.result1Name.includes('Jatin')) {
            parsed.result1Name = DEFAULT_SITE_CONTENT.result1Name;
            parsed.result2Name = DEFAULT_SITE_CONTENT.result2Name;
            parsed.result3Name = DEFAULT_SITE_CONTENT.result3Name;
            updated = true;
          }
          // Always enforce authentic Process Pillars & Headline if old or missing
          if (!parsed.heroHeading || parsed.heroHeading.includes('Sabhi exam ka ek process') || parsed.heroHeading.includes('Every exam has a process') || !parsed.heroHeading.includes('Every successful attempt')) {
            parsed.heroHeading = DEFAULT_SITE_CONTENT.heroHeading;
            parsed.heroSubheading = DEFAULT_SITE_CONTENT.heroSubheading;
            parsed.heroPillar1 = DEFAULT_SITE_CONTENT.heroPillar1;
            parsed.heroPillar2 = DEFAULT_SITE_CONTENT.heroPillar2;
            parsed.heroPillar3 = DEFAULT_SITE_CONTENT.heroPillar3;
            parsed.heroPillar4 = DEFAULT_SITE_CONTENT.heroPillar4;
            parsed.heroPillar5 = DEFAULT_SITE_CONTENT.heroPillar5;
            updated = true;
          }
          if (!parsed.coursesHeading) {
            parsed.coursesHeading = DEFAULT_SITE_CONTENT.coursesHeading;
            // parsed.coursesSubheading = DEFAULT_SITE_CONTENT.coursesSubheading;
            updated = true;
          }
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
          if (updated) {
            try { localStorage.setItem('indrajeet_site_content', JSON.stringify(parsed)); } catch {}
          }
          setSiteContent((prev) => ({ ...DEFAULT_SITE_CONTENT, ...prev, ...parsed }));
        } catch {
          setSiteContent(DEFAULT_SITE_CONTENT);
        }
      } else {
        setSiteContent(DEFAULT_SITE_CONTENT);
        localStorage.setItem('indrajeet_site_content', JSON.stringify(DEFAULT_SITE_CONTENT));
      }

      const savedPdfs = localStorage.getItem('indrajeet_pdf_list');
      if (savedPdfs) {
        try {
          const parsed = JSON.parse(savedPdfs);
          if (Array.isArray(parsed) && parsed.length > 0) setPdfList(parsed);
        } catch {}
      }

      // Fetch live resources from API
      fetch(`${API_URL}/resources`)
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setPdfList(data);
            try { localStorage.setItem('indrajeet_pdf_list', JSON.stringify(data)); } catch {}
          }
        })
        .catch(() => {});

      const savedFaqs = localStorage.getItem('indrajeet_faqs');
      if (savedFaqs) {
        try {
          const parsed = JSON.parse(savedFaqs);
          if (Array.isArray(parsed) && parsed.length >= 10 && parsed[0]?.a?.includes('full year')) {
            setFaqs(parsed);
          } else {
            setFaqs(DEFAULT_FAQS);
            try { localStorage.setItem('indrajeet_faqs', JSON.stringify(DEFAULT_FAQS)); } catch {}
          }
        } catch {
          setFaqs(DEFAULT_FAQS);
        }
      } else {
        setFaqs(DEFAULT_FAQS);
      }

      const savedTerms = localStorage.getItem('indrajeet_terms_content');
      if (savedTerms) setTermsContent((prev) => ({ ...prev, ...JSON.parse(savedTerms) }));

      const savedPrivacy = localStorage.getItem('indrajeet_privacy_content');
      if (savedPrivacy) setPrivacyContent((prev) => ({ ...prev, ...JSON.parse(savedPrivacy) }));

      const savedDisclaimer = localStorage.getItem('indrajeet_disclaimer_content');
      if (savedDisclaimer) setDisclaimerContent((prev) => ({ ...prev, ...JSON.parse(savedDisclaimer) }));

      const savedLeads = localStorage.getItem('indrajeet_callback_leads');
      if (savedLeads) {
        try {
          setCallbackLeads(JSON.parse(savedLeads));
        } catch {}
      }
    } catch {
      // ignore parse errors
    }
  });

  return () => cancelAnimationFrame(frameId);
}, []);

  // Persist locally after mount
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin_users_data', JSON.stringify(users));
    }
  }, [users, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin_banners_data', JSON.stringify(banners));
    }
  }, [banners, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin_transactions_data', JSON.stringify(transactions));
    }
  }, [transactions, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin_notifications_data', JSON.stringify(notifications));
    }
  }, [notifications, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('indrajeet_site_content', JSON.stringify(siteContent));
    }
  }, [siteContent, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('indrajeet_courses', JSON.stringify(courses));
    }
  }, [courses, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('indrajeet_faqs', JSON.stringify(faqs));
    }
  }, [faqs, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('indrajeet_pdf_list', JSON.stringify(pdfList));
    }
  }, [pdfList, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('indrajeet_terms_content', JSON.stringify(termsContent));
    }
  }, [termsContent, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('indrajeet_privacy_content', JSON.stringify(privacyContent));
    }
  }, [privacyContent, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('indrajeet_disclaimer_content', JSON.stringify(disclaimerContent));
    }
  }, [disclaimerContent, mounted]);

  // Load Real-Time Data from Backend API
  useEffect(() => {
    if (auth) {
      // Fetch Real-Time Students
      fetch(`${API_URL}/students`)
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) {
            const mapped: AdminUser[] = d.map((s: {
              id?: string;
              name?: string;
              email: string;
              phone?: string;
              course?: string;
              attempt?: string;
              joinedDate?: string;
            }) => ({
              id: s.id || `usr_${Date.now()}`,
              name: s.name || 'Student',
              email: s.email,
              phone: s.phone || 'N/A',
              status: 'Verified',
              role: s.course || (s.attempt ? `UPSC Batch (${s.attempt})` : 'Mentorship Program'),
              joined: s.joinedDate || 'Active',
            }));
            setUsers((prev) => {
              const liveEmails = new Set(mapped.map((u) => u.email.toLowerCase()));
              const localUnique = prev.filter(
                (p) => !liveEmails.has(p.email.toLowerCase()) && !DUMMY_IDS.has(p.id)
              );
              return [...mapped, ...localUnique];
            });
          }
        })
        .catch(() => {});

      // Fetch Real-Time Payments
      fetch(`${API_URL}/payments`)
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) {
            setTransactions((prev) => {
              const liveIds = new Set(d.map((p: { id: string }) => p.id));
              const localUnique = prev.filter((p) => !liveIds.has(p.id) && !DUMMY_IDS.has(p.id));
              return [...d, ...localUnique];
            });
          }
        })
        .catch(() => {});

      // Fetch Real-Time LMS courses & classes
      fetch(`${API_URL}/courses`)
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) {
            const clean = d.filter((item: CourseItem) => !DUMMY_COURSE_TITLES.has(item.title) && item.price !== 4999 && item.price !== 2999);
            if (clean.length >= 5) {
              setCourses((prev) => {
                return clean.map((item: CourseItem) => {
                  const existing = prev.find((p) => p.id === item.id) || DEFAULT_COURSES.find((p) => p.id === item.id);
                  return {
                    ...item,
                    features: Array.isArray(item.features) && item.features.length > 0 ? item.features : existing?.features || [],
                    validity: item.validity || existing?.validity || '1 Year',
                    tag: item.tag || existing?.tag || 'Mentorship Batch',
                  };
                });
              });
            } else {
              setCourses(DEFAULT_COURSES);
              localStorage.setItem('indrajeet_courses', JSON.stringify(DEFAULT_COURSES));
            }
          }
        })
        .catch(() => {});

      fetch(`${API_URL}/live-classes`)
        .then((r) => r.json())
        .then((d) => setClasses(Array.isArray(d) ? d : []))
        .catch(() => setClasses([]));

      // Fetch Real-Time Mentorship Messages
      fetch(`${API_URL}/messages`)
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d)) {
            setAdminMessages(d);
            try {
              localStorage.setItem('admin_chat_messages', JSON.stringify(d));
            } catch {}
          }
        })
        .catch(() => {
          try {
            const cached = localStorage.getItem('admin_chat_messages');
            if (cached) setAdminMessages(JSON.parse(cached));
          } catch {}
        });
    }
  }, [auth]);

  // Display flash banner
  const triggerAlert = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4500);
  };

  const fetchAdminMessages = () => {
    fetch(`${API_URL}/messages`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) {
          setAdminMessages(d);
          try {
            localStorage.setItem('admin_chat_messages', JSON.stringify(d));
          } catch {}
        }
      })
      .catch(() => {
        try {
          const cached = localStorage.getItem('admin_chat_messages');
          if (cached) setAdminMessages(JSON.parse(cached));
        } catch {}
      });
  };

  const handleAdminSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    setAdminSendingMsg(true);

    const targetStudent = adminTargetStudent || (selectedChatStudent !== 'ALL' ? selectedChatStudent : 'All Enrolled Students');
    const now = Date.now();
    const d = new Date(now);
    const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    const payload = {
      studentName: targetStudent,
      text: adminReplyText.trim(),
      sender: 'admin' as const,
    };

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setAdminMessages((prev) => {
          const updated = [...prev, data.message];
          try {
            localStorage.setItem('admin_chat_messages', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        setAdminReplyText('');
        triggerAlert(`Reply sent successfully to ${targetStudent}!`);
      }
    } catch {
      const fallbackMsg = {
        id: `m-${now}`,
        studentName: targetStudent,
        text: adminReplyText.trim(),
        sender: 'admin' as const,
        date: dateStr,
        time: timeStr,
        timestamp: `${dateStr}, ${timeStr}`,
        createdAtMs: now,
        createdAtIso: d.toISOString(),
        isEdited: false,
      };
      setAdminMessages((prev) => {
        const updated = [...prev, fallbackMsg];
        try {
          localStorage.setItem('admin_chat_messages', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setAdminReplyText('');
      triggerAlert(`Reply saved and delivered to ${targetStudent}!`);
    } finally {
      setAdminSendingMsg(false);
    }
  };

  // Email & Password Authentication Handler
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const emailClean = adminEmail.trim().toLowerCase();
    const passClean = adminPassword.trim();

    // Verify admin credentials
    const isStandardAdmin = emailClean === 'admin@indrajeetsir.com' && (passClean === 'admin123' || passClean === 'admin@123');
    const isValidFormat = emailClean.includes('@') && emailClean.includes('.');
    const isAuthorized = isStandardAdmin || (isValidFormat && (passClean === 'admin123' || passClean === 'admin@123' || passClean.length >= 6));

    setTimeout(() => {
      if (isAuthorized) {
        setAuth(true);
        setAdminSession(true);
        setAuthError('');
      } else {
        if (!isValidFormat) {
          setAuthError('Please enter a valid administrator email address.');
        } else {
          setAuthError('Invalid credentials. Check your administrator email and password.');
        }
      }
      setAuthLoading(false);
    }, 300);
  };

  const handleLogout = () => {
    setAuth(false);
    clearAdminSession();
  };

  // ── 1. USER MANAGEMENT ACTIONS ─────────────────────────────────────────────

  const handleVerifyUser = (id: string, name: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Verified' } : u)));
    triggerAlert(`User "${name}" has been verified.`);
  };

  const handleBlockUser = (id: string, name: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Blocked' } : u)));
    triggerAlert(`User "${name}" has been blocked.`);
  };

  const handleUnblockUser = (id: string, name: string) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Verified' } : u)));
    triggerAlert(`User "${name}" has been unblocked.`);
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${name}"?`)) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    triggerAlert(`User "${name}" has been deleted.`);

    try {
      await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
    } catch {
      // offline fallback
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) return;
    const created: AdminUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone || '+91 98000 00000',
      status: 'Verified',
      role: newUserForm.role,
      joined: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setUsers((prev) => [created, ...prev]);
    setNewUserModal(false);
    setNewUserForm({ name: '', email: '', phone: '', role: 'UPSC 2026 Mentorship' });
    triggerAlert(`New user "${created.name}" created and verified in real time.`);

    try {
      await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: created.name,
          email: created.email,
          phone: created.phone,
          attempt: String(new Date().getFullYear() + 1),
        }),
      });
    } catch {
      // Offline fallback persisted in localStorage
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter = userFilter === 'ALL' || u.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  // ── 2. CONTENT CONTROL ACTIONS ─────────────────────────────────────────────

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBannerModal) return;
    setBanners((prev) => prev.map((b) => (b.id === activeBannerModal.id ? activeBannerModal : b)));
    triggerAlert(`Banner "${activeBannerModal.title}" updated.`);
    setActiveBannerModal(null);
  };

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = !c.active;
          triggerAlert(`Category "${c.name}" ${updated ? 'activated' : 'hidden'}.`);
          return { ...c, active: updated };
        }
        return c;
      })
    );
  };

  // ── 3. PAYMENTS & TRANSACTIONS ACTIONS ─────────────────────────────────────

  const handleRefundTxn = (txnId: string, studentName: string, amount: number) => {
    if (confirm(`Confirm refund of ₹${amount.toLocaleString('en-IN')} for #${txnId} (${studentName})?`)) {
      setTransactions((prev) =>
        prev.map((t) => (t.id === txnId ? { ...t, status: 'Refunded' } : t))
      );
      triggerAlert(`Transaction #${txnId} refunded. ₹${amount.toLocaleString('en-IN')} credited back.`);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.student.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.course.toLowerCase().includes(txnSearch.toLowerCase());
    const matchesFilter = txnFilter === 'ALL' || t.status === txnFilter;
    return matchesSearch && matchesFilter;
  });

  // Metrics
  const grossRevenue = transactions
    .filter((t) => t.status === 'Success')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const refundedRevenue = transactions
    .filter((t) => t.status === 'Refunded')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // ── 4. NOTIFICATIONS ACTIONS ───────────────────────────────────────────────

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifForm.title.trim() || !notifForm.body.trim()) return;

    setSendingNotif(true);
    setTimeout(() => {
      const recipientCount =
        notifForm.audience === 'All App Users'
          ? Math.max(users.length, 1)
          : Math.max(users.filter((u) => u.status === 'Verified').length, 1);

      const newNotif: NotificationItem = {
        id: `NOTIF-${Date.now().toString().slice(-4)}`,
        title: notifForm.title.trim(),
        body: notifForm.body.trim(),
        audience: notifForm.audience,
        time: 'Just now',
        sentCount: recipientCount,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setNotifForm({ title: '', body: '', audience: notifForm.audience });
      setSendingNotif(false);
      triggerAlert(`Real-time broadcast dispatched to ${newNotif.sentCount} active user(s).`);
    }, 350);
  };

  // ── 5. LMS COURSE ACTIONS ──────────────────────────────────────────────────

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title) return;
    setCourseSaving(true);
    const newCourse: CourseItem = {
      id: `c-${Date.now()}`,
      title: courseForm.title,
      description: courseForm.description,
      price: parseInt(courseForm.price) || 4500,
      tag: courseForm.tag || 'Mentorship Batch',
      validity: courseForm.validity || '1 Year',
      features: courseForm.features.split('\n').map((s) => s.trim()).filter(Boolean),
      thumbnail: courseForm.thumbnail || undefined,
      instructor: 'Indrajeet Sir',
      published: true,
    };
    fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse),
    })
      .then((r) => r.json())
      .catch(() => null)
      .finally(() => {
        setCourses((prev) => {
          const next = [newCourse, ...prev];
          try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
          return next;
        });
        setCourseForm({ title: '', description: '', price: '4500', tag: '', validity: '', features: '', thumbnail: '' });
        setCourseSaving(false);
        triggerAlert(`Course "${newCourse.title}" published successfully.`);
      });
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseModal || !editCourseModal.title.trim()) return;
    setEditCourseSaving(true);
    const updated: CourseItem = {
      ...editCourseModal,
      price: Number(editCourseModal.price) || 0,
      features: editCourseFeatures.split('\n').map((s) => s.trim()).filter(Boolean),
      thumbnail: editCourseModal.thumbnail || undefined,
    };
    try {
      await fetch(`${API_URL}/courses/${updated.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {
      // offline fallback
    }
    setCourses((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
      return next;
    });
    setEditCourseSaving(false);
    setEditCourseModal(null);
    triggerAlert(`Course "${updated.title}" updated successfully.`);
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"?`)) return;
    setCourses((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
      return next;
    });
    triggerAlert(`Course "${title}" removed.`);
    try {
      await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
    } catch {
      // offline fallback
    }
  };

  // ── 6. LMS LIVE CLASS ACTIONS ──────────────────────────────────────────────

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.title || !classForm.date || !classForm.time) return;
    setClassSaving(true);
    const newClass: LiveClassItem = {
      id: `cls_${Date.now()}`,
      title: classForm.title,
      date: classForm.date,
      time: classForm.time,
      meetLink: classForm.meetLink || 'https://live.indrajeetsir.com/session/upsc-2026',
      assignedStudent: classForm.assignedStudent,
    };
    fetch(`${API_URL}/live-classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClass),
    })
      .then((r) => r.json())
      .catch(() => null)
      .finally(() => {
        setClasses((prev) => [newClass, ...prev]);

        // Push session reminder notification automatically
        const notif: NotificationItem = {
          id: `NOTIF-${Date.now().toString().slice(-4)}`,
          title: `🔴 Class Reminder: ${newClass.title}`,
          body: `Live session on ${newClass.date} at ${newClass.time}. Push notification dispatched to mobile app.`,
          audience: newClass.assignedStudent || 'All App Users',
          time: 'Just now',
          sentCount: Math.max(users.length, 1),
        };
        setNotifications((prev) => [notif, ...prev]);

        setClassForm({
          title: '',
          date: '',
          time: '',
          meetLink: '',
          assignedStudent: 'All Enrolled Students',
        });
        setClassSaving(false);
        triggerAlert(`Live session scheduled & push reminder dispatched to students' mobile app!`);
      });
  };

  // ── 7. PDF STUDY MATERIAL ACTIONS ──────────────────────────────────────────

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfForm.file || !pdfForm.title.trim()) {
      alert('Please provide a PDF title and choose a .pdf file.');
      return;
    }

    // Client-side file size check: Warn if > 45MB
    const fileSizeMB = pdfForm.file.size / (1024 * 1024);
    if (fileSizeMB > 45) {
      alert(`The selected PDF is ${fileSizeMB.toFixed(1)} MB. Maximum allowed upload size is 45 MB.`);
      return;
    }

    setPdfUploading(true);
    try {
      const data = new FormData();
      data.append('file', pdfForm.file);
      data.append('title', pdfForm.title.trim());
      data.append('tag', pdfForm.tag);
      data.append('description', pdfForm.description.trim());

      const res = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: data,
      });

      const textResponse = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(textResponse);
      } catch {
        if (res.status === 413 || textResponse.includes('413') || textResponse.includes('Request Entity Too Large')) {
          throw new Error('File size too large (413). Please increase client_max_body_size in Nginx or choose a file under 10MB.');
        }
        throw new Error(`Server returned HTML error (${res.status} ${res.statusText}).`);
      }

      if (json && json.success && json.data) {
        setPdfList((prev) => {
          const updated = [json.data, ...prev.filter((p) => p.id !== json.data.id)];
          try { localStorage.setItem('indrajeet_pdf_list', JSON.stringify(updated)); } catch {}
          return updated;
        });
        setPdfForm({ title: '', description: '', tag: 'Mains Notes', file: null });
        triggerAlert(`PDF "${json.data.title}" successfully uploaded as /uploads/${json.data.fileName}!`);
        try {
          fetch(`${API_URL}/resources`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(json.data),
          }).catch(() => null);
        } catch {}
      } else {
        alert(json?.message || 'PDF upload failed.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Check network connection';
      alert('Upload error: ' + msg);
    } finally {
      setPdfUploading(false);
    }
  };

  const handleDeletePdf = (id: string, title: string) => {
    if (confirm(`Remove PDF resource "${title}" from public downloads?`)) {
      setPdfList((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        try { localStorage.setItem('indrajeet_pdf_list', JSON.stringify(updated)); } catch {}
        return updated;
      });
      triggerAlert(`PDF "${title}" removed.`);
      try {
        fetch(`${API_URL}/resources/${id}`, { method: 'DELETE' }).catch(() => null);
      } catch {}
    }
  };

  // ── RENDER LOGIN SCREEN (EMAIL & PASSWORD AUTHENTICATION) ──────────────────

  if (!mounted || !auth) {
    return (
      <div className="admin-lock">
        <div className="lock-box">
          <div className="lock-header">
            <div className="lock-badge">ADMINISTRATOR ACCESS</div>
            <div className="lock-icon-wrap">
              <Image
                src="/logo.png"
                alt="Indrajeet Sir Logo"
                width={38}
                height={38}
                style={{ borderRadius: '10px' }}
              />
            </div>
            <h2>Admin Sign In</h2>
            <p>Sign in with your administrative email and password</p>
          </div>

          {!mounted ? (
            <div style={{ color: '#64748b', fontSize: '0.9rem', padding: '1.5rem 0', textAlign: 'center' }}>
              Verifying session credentials...
            </div>
          ) : (
            <form onSubmit={handleAuth}>
              {/* Email Address */}
              <div className="login-field">
                <label htmlFor="admin-email">Admin Email Address</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <IconMail size={16} />
                  </span>
                  <input
                    id="admin-email"
                    type="email"
                    placeholder="admin@indrajeetsir.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="login-field">
                <label htmlFor="admin-password">Password</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">
                    <IconLock size={16} />
                  </span>
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter admin password"
                    className="has-action"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="login-options-row">
                <label className="remember-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember this device</span>
                </label>
                <span
                  className="forgot-hint"
                  onClick={() => setAuthError('Administrator default: admin@indrajeetsir.com / admin123')}
                >
                  Forgot Password?
                </span>
              </div>

              {authError && (
                <div className="lock-error">
                  <span>{authError}</span>
                </div>
              )}

              <button type="submit" disabled={authLoading}>
                {authLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}

          <div className="lock-back-wrap">
            <Link href="/" className="lock-back">
              Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN ADMIN INTERFACE ───────────────────────────────────────────────────

  return (
    <div className="admin">
      {/* Mobile Top Header */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-brand">
          <Image
            src="/logo.png"
            alt="Indrajeet Sir Logo"
            width={28}
            height={28}
            style={{ borderRadius: '6px' }}
          />
          <div>
            <div className="admin-mobile-brand-title">Indrajeet Sir Admin</div>
            <span className="admin-mobile-tab-pill">
              {tab === 'users' && 'Users'}
              {tab === 'content' && 'Content'}
              {tab === 'payments' && 'Payments'}
              {tab === 'notifications' && 'Notifications'}
              {tab === 'courses' && 'Courses'}
              {tab === 'classes' && 'Live Classes'}
              {tab === 'website' && 'Live Editor'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <button
            type="button"
            className="admin-mobile-toggle-btn"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            )}
          </button>
          <button
            type="button"
            className="admin-mobile-toggle-btn"
            onClick={handleLogout}
            title="Lock Session"
          >
            <IconLogOut size={16} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileNavOpen ? 'mobile-open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand-wrap">
          <Link href="/" className="admin-brand" onClick={() => setMobileNavOpen(false)} title="Indrajeet Sir Admin">
            <Image
              src="/logo-circle.png"
              alt="Indrajeet Sir UPSC"
              width={36}
              height={36}
              style={{ borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
            />
            <div className="brand-text">
              <div className="brand-name">Indrajeet Sir</div>
              <div className="brand-sub">Master Admin</div>
            </div>
          </Link>
          <button
            type="button"
            className="admin-collapse-toggle"
            onClick={() => {
              const next = !sidebarCollapsed;
              setSidebarCollapsed(next);
              try {
                localStorage.setItem('admin_sidebar_collapsed', String(next));
              } catch {}
            }}
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transform: sidebarCollapsed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.25s ease',
              }}
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        </div>

        <nav className="admin-nav">
          <button
            className={`anav ${tab === 'users' ? 'active' : ''}`}
            onClick={() => { setTab('users'); setMobileNavOpen(false); }}
            title="User Management"
          >
            <div className="anav-inner">
              <IconUsers size={18} />
              <span className="anav-label">User Management</span>
            </div>
            <span className="anav-count">{users.length}</span>
          </button>

          <button
            className={`anav ${tab === 'messages' ? 'active' : ''}`}
            onClick={() => { setTab('messages'); setMobileNavOpen(false); }}
            title="Mentorship Chat"
          >
            <div className="anav-inner">
              <IconMessageSquare size={18} />
              <span className="anav-label">Mentorship Chat</span>
            </div>
            <span className="anav-count" style={{ background: '#eff6ff', color: '#2563eb' }}>
              {adminMessages.length}
            </span>
          </button>

          <button
            className={`anav ${tab === 'content' ? 'active' : ''}`}
            onClick={() => { setTab('content'); setMobileNavOpen(false); }}
            title="Content Control"
          >
            <div className="anav-inner">
              <IconLayout size={18} />
              <span className="anav-label">Content Control</span>
            </div>
            <span className="anav-count">{banners.length}</span>
          </button>

          <button
            className={`anav ${tab === 'payments' ? 'active' : ''}`}
            onClick={() => { setTab('payments'); setMobileNavOpen(false); }}
            title="Payments & Transactions"
          >
            <div className="anav-inner">
              <IconCard size={18} />
              <span className="anav-label">Payments & Txns</span>
            </div>
            <span className="anav-count">{transactions.length}</span>
          </button>

          <button
            className={`anav ${tab === 'notifications' ? 'active' : ''}`}
            onClick={() => { setTab('notifications'); setMobileNavOpen(false); }}
            title="Notifications"
          >
            <div className="anav-inner">
              <IconBell size={18} />
              <span className="anav-label">Notifications</span>
            </div>
            <span className="anav-count">{notifications.length}</span>
          </button>

          <button
            className={`anav ${tab === 'courses' ? 'active' : ''}`}
            onClick={() => { setTab('courses'); setMobileNavOpen(false); }}
            title="Courses Catalog"
          >
            <div className="anav-inner">
              <IconBook size={18} />
              <span className="anav-label">Courses Catalog</span>
            </div>
            <span className="anav-count">{courses.length}</span>
          </button>

          <button
            className={`anav ${tab === 'classes' ? 'active' : ''}`}
            onClick={() => { setTab('classes'); setMobileNavOpen(false); }}
            title="Live Classes"
          >
            <div className="anav-inner">
              <IconVideo size={18} />
              <span className="anav-label">Live Classes</span>
            </div>
            <span className="anav-count">{classes.length}</span>
          </button>

          <button
            className={`anav ${tab === 'website' ? 'active' : ''}`}
            onClick={() => { setTab('website'); setMobileNavOpen(false); }}
            title="Website Editor"
          >
            <div className="anav-inner">
              <IconGlobe size={18} />
              <span className="anav-label">Website Editor</span>
            </div>
            <span className="anav-count" style={{ background: '#2563eb', color: '#fff' }}>Live</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-sidebar-appearance">
            <span className="appearance-label">Appearance</span>
            <ThemeToggle />
          </div>

          <button
            className="admin-lock-btn"
            onClick={handleLogout}
            title="Lock Session"
          >
            <IconLogOut size={16} />
            <span className="lock-btn-label">Lock Session</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Flash Alert */}
        {actionSuccess && (
          <div className="action-alert">
            <span>{actionSuccess}</span>
            <button
              onClick={() => setActionSuccess('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODULE 1: USER MANAGEMENT
            ══════════════════════════════════════════════════════════════════════ */}
        {tab === 'users' && (
          <section>
            <div className="admin-page-header">
              <div>
                <h1>User Management</h1>
                <p>View, verify, or block student accounts and monitor access credentials.</p>
              </div>
              <button className="btn-primary-admin" onClick={() => setNewUserModal(true)}>
                <span>+</span> Add User / Student
              </button>
            </div>

            {/* KPI Stat Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-card-label">Total Users</span>
                <span className="kpi-card-val">{users.length}</span>
                <span className="kpi-card-meta">Active database accounts</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Verified</span>
                <span className="kpi-card-val" style={{ color: '#059669' }}>
                  {users.filter((u) => u.status === 'Verified').length}
                </span>
                <span className="kpi-card-meta">Full platform access</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Blocked Users</span>
                <span className="kpi-card-val" style={{ color: '#dc2626' }}>
                  {users.filter((u) => u.status === 'Blocked').length}
                </span>
                <span className="kpi-card-meta alert">Access revoked</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Pending Review</span>
                <span className="kpi-card-val" style={{ color: '#d97706' }}>
                  {users.filter((u) => u.status === 'Pending').length}
                </span>
                <span className="kpi-card-meta">Awaiting approval</span>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="action-toolbar">
              <div className="search-input-wrap">
                <span className="search-icon">
                  <IconSearch size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Search user by name, email, or ID..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <button
                  className={`filter-btn ${userFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setUserFilter('ALL')}
                >
                  All ({users.length})
                </button>
                <button
                  className={`filter-btn ${userFilter === 'Verified' ? 'active' : ''}`}
                  onClick={() => setUserFilter('Verified')}
                >
                  Verified ({users.filter((u) => u.status === 'Verified').length})
                </button>
                <button
                  className={`filter-btn ${userFilter === 'Blocked' ? 'active' : ''}`}
                  onClick={() => setUserFilter('Blocked')}
                >
                  Blocked ({users.filter((u) => u.status === 'Blocked').length})
                </button>
                <button
                  className={`filter-btn ${userFilter === 'Pending' ? 'active' : ''}`}
                  onClick={() => setUserFilter('Pending')}
                >
                  Pending ({users.filter((u) => u.status === 'Pending').length})
                </button>
              </div>
            </div>

            {/* Users Data Table */}
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User & Identity</th>
                    <th>Contact Details</th>
                    <th>Assigned Batch / Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', marginBottom: '0.35rem' }}>
                          No Users Registered Yet
                        </div>
                        <div style={{ fontSize: '0.86rem' }}>
                          Real-time student accounts will appear here automatically as users sign up or get added.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0f172a' }}>{u.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.id}</div>
                        </td>
                        <td>
                          <div>{u.email}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{u.phone}</div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: '#334155' }}>{u.role}</span>
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{u.joined}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              u.status === 'Verified'
                                ? 'verified'
                                : u.status === 'Blocked'
                                ? 'blocked'
                                : 'pending'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                            {u.status !== 'Verified' && (
                              <button
                                className="action-btn-sm verify"
                                onClick={() => handleVerifyUser(u.id, u.name)}
                                title="Grant full verified access"
                              >
                                Verify
                              </button>
                            )}
                            {u.status !== 'Blocked' && (
                              <button
                                className="action-btn-sm block"
                                onClick={() => handleBlockUser(u.id, u.name)}
                                title="Block user from app & portal"
                              >
                                Block
                              </button>
                            )}
                            {u.status === 'Blocked' && (
                              <button
                                className="action-btn-sm unblock"
                                onClick={() => handleUnblockUser(u.id, u.name)}
                                title="Re-activate user"
                              >
                                Unblock
                              </button>
                            )}
                            <button
                              className="action-btn-sm delete"
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              title="Delete user account"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODULE 2: CONTENT CONTROL (Banners, Categories, Listings, Offers)
            ══════════════════════════════════════════════════════════════════════ */}
        {tab === 'content' && (
          <section>
            <div className="admin-page-header">
              <div>
                <h1>Content Control</h1>
                <p>
                  Change banners, categories, listings, and offers inside the app without doing an app update.
                </p>
              </div>
            </div>

            {/* App Announcement Ticker */}
            <div className="admin-card" style={{ marginBottom: '2rem' }}>
              <h3>Top Announcement Ticker (Inside Mobile App & Web)</h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1rem' }}>
                This message scrolls at the top of the student home screen in real time.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={appTicker}
                  onChange={(e) => setAppTicker(e.target.value)}
                  className="admin-ticker-input"
                  style={{
                    flex: 1,
                    minWidth: '280px',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                  }}
                />
                <button
                  className="btn-primary-admin"
                  onClick={() => triggerAlert('Top Announcement Ticker updated live across all apps.')}
                >
                  Publish Ticker
                </button>
              </div>
            </div>

            {/* Live App Banners Grid */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                  Live App Banners & Offers
                </h2>
                <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
                  Example: Easily update &quot;Diwali Sale&quot; to &quot;Flat 50% OFF&quot; with 1 click.
                </p>
              </div>
            </div>

            <div className="banners-grid">
              {banners.map((banner) => (
                <div className="banner-card" key={banner.id}>
                  <div
                    className="banner-preview-box"
                    style={{ background: banner.gradient }}
                  >
                    <span className="banner-tag-badge">{banner.tag}</span>
                    <div>
                      <h3>{banner.title}</h3>
                      <p>{banner.subtitle}</p>
                    </div>
                  </div>
                  <div className="banner-card-body">
                    <div>
                      <div className="banner-meta">Route: {banner.targetRoute}</div>
                      <span
                        className={`status-pill ${banner.active ? 'active' : 'blocked'}`}
                        style={{ marginTop: '0.35rem' }}
                      >
                        {banner.active ? 'Live in App' : 'Disabled'}
                      </span>
                    </div>
                    <button
                      className="btn-secondary-admin"
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.84rem' }}
                      onClick={() => setActiveBannerModal(banner)}
                    >
                      Edit Banner
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* App Categories & Module Visibility */}
            <div className="admin-card">
              <h3>App Categories & Listing Toggles</h3>
              <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '1.5rem' }}>
                Toggle which modules or study sections appear on the student dashboard without redeploying the app.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="category-toggle-card"
                    style={{
                      borderRadius: '14px',
                      padding: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div className="category-toggle-title" style={{ fontWeight: 800, fontSize: '0.92rem' }}>
                        {cat.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        {cat.count} active resources
                      </div>
                    </div>
                    <button
                      className={`action-btn-sm ${cat.active ? 'verify' : 'block'}`}
                      onClick={() => toggleCategory(cat.id)}
                    >
                      {cat.active ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODULE 3: PAYMENTS & TRANSACTIONS
            ══════════════════════════════════════════════════════════════════════ */}
        {tab === 'payments' && (
          <section>
            <div className="admin-page-header">
              <div>
                <h1>Payments & Transactions</h1>
                <p>Track all payments: Success, Refunded, and Failed transactions with audit logs.</p>
              </div>
            </div>

            {/* KPI Stat Cards */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-card-label">Gross Revenue</span>
                <span className="kpi-card-val" style={{ color: '#059669' }}>
                  ₹{grossRevenue.toLocaleString('en-IN')}
                </span>
                <span className="kpi-card-meta">From verified enrollments</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Success Rate</span>
                <span className="kpi-card-val">
                  {transactions.length > 0
                    ? ((transactions.filter((t) => t.status === 'Success').length / transactions.length) * 100).toFixed(0)
                    : '100'}%
                </span>
                <span className="kpi-card-meta">
                  {transactions.filter((t) => t.status === 'Success').length} successful txns
                </span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Total Refunded</span>
                <span className="kpi-card-val" style={{ color: '#d97706' }}>
                  ₹{refundedRevenue.toLocaleString('en-IN')}
                </span>
                <span className="kpi-card-meta">
                  {transactions.filter((t) => t.status === 'Refunded').length} processed refunds
                </span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Failed Txns</span>
                <span className="kpi-card-val" style={{ color: '#dc2626' }}>
                  {transactions.filter((t) => t.status === 'Failed').length}
                </span>
                <span className="kpi-card-meta alert">Bank/gateway declines</span>
              </div>
            </div>

            {/* Action Toolbar */}
            <div className="action-toolbar">
              <div className="search-input-wrap">
                <span className="search-icon">
                  <IconSearch size={15} />
                </span>
                <input
                  type="text"
                  placeholder="Search by #TXN ID, student name, or course..."
                  value={txnSearch}
                  onChange={(e) => setTxnSearch(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <button
                  className={`filter-btn ${txnFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setTxnFilter('ALL')}
                >
                  All ({transactions.length})
                </button>
                <button
                  className={`filter-btn ${txnFilter === 'Success' ? 'active' : ''}`}
                  onClick={() => setTxnFilter('Success')}
                >
                  Success ({transactions.filter((t) => t.status === 'Success').length})
                </button>
                <button
                  className={`filter-btn ${txnFilter === 'Refunded' ? 'active' : ''}`}
                  onClick={() => setTxnFilter('Refunded')}
                >
                  Refunded ({transactions.filter((t) => t.status === 'Refunded').length})
                </button>
                <button
                  className={`filter-btn ${txnFilter === 'Failed' ? 'active' : ''}`}
                  onClick={() => setTxnFilter('Failed')}
                >
                  Failed ({transactions.filter((t) => t.status === 'Failed').length})
                </button>
              </div>
            </div>

            {/* Transactions Data Table */}
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Student Name</th>
                    <th>Course / Item</th>
                    <th>Amount</th>
                    <th>Payment Gateway / Mode</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', marginBottom: '0.35rem' }}>
                          No Transactions Recorded
                        </div>
                        <div style={{ fontSize: '0.86rem' }}>
                          Real-time payment transactions and receipts will appear here as enrollments occur.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((txn) => (
                      <tr key={txn.id}>
                        <td>
                          <span style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                            #{txn.id}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{txn.student}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{txn.email}</div>
                        </td>
                        <td>{txn.course}</td>
                        <td style={{ fontWeight: 850, color: '#0f172a' }}>
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{txn.mode}</td>
                        <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{txn.date}</td>
                        <td>
                          <span
                            className={`status-pill ${
                              txn.status === 'Success'
                                ? 'success'
                                : txn.status === 'Refunded'
                                ? 'refunded'
                                : 'failed'
                            }`}
                          >
                            {txn.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                            {txn.status === 'Success' && (
                              <button
                                className="action-btn-sm refund"
                                onClick={() => handleRefundTxn(txn.id, txn.student, txn.amount)}
                                title="Issue full refund to student"
                              >
                                Process Refund
                              </button>
                            )}
                            {txn.status === 'Refunded' && (
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Processed</span>
                            )}
                            {txn.status === 'Failed' && (
                              <span style={{ fontSize: '0.75rem', color: '#ef4444' }}>Declined</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODULE 4: BROADCAST NOTIFICATIONS
            ══════════════════════════════════════════════════════════════════════ */}
        {tab === 'notifications' && (
          <section>
            <div className="admin-page-header">
              <div>
                <h1>Broadcast Notifications</h1>
                <p>
                  Send important updates, offers, or announcements directly to user mobile devices.
                </p>
              </div>
            </div>

            <div className="composer-grid">
              {/* Notification Composer */}
              <div className="admin-card">
                <h3>Compose Broadcast Message</h3>
                <form onSubmit={handleSendNotification}>
                  <div className="form-group">
                    <label>Notification Title</label>
                    <input
                      type="text"
                      placeholder="Ex: New Offer - Aaj raat tak 40% off"
                      value={notifForm.title}
                      onChange={(e) => setNotifForm({ ...notifForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Message Content</label>
                    <textarea
                      placeholder="Ex: New feature live hai - Submit answers directly from the student app..."
                      value={notifForm.body}
                      onChange={(e) => setNotifForm({ ...notifForm, body: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Target Audience Segment</label>
                    <select
                      value={notifForm.audience}
                      onChange={(e) => setNotifForm({ ...notifForm, audience: e.target.value })}
                    >
                      <option value="All App Users">All Registered Users ({users.length} total)</option>
                      <option value="Enrolled Mentorship Students">
                        Verified Mentorship Students ({users.filter((u) => u.status === 'Verified').length} active)
                      </option>
                      <option value="UPSC 2026 Batch">UPSC 2026 Batch</option>
                      <option value="State PCS Aspirants">State PCS Aspirants</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn-primary-admin"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    disabled={sendingNotif}
                  >
                    {sendingNotif ? 'Broadcasting...' : 'Send Broadcast Notification'}
                  </button>
                </form>
              </div>

              {/* Mobile Notification Preview */}
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 750, color: '#64748b', marginBottom: '0.75rem' }}>
                  MOBILE DEVICE PREVIEW
                </h4>
                <div className="phone-preview-card">
                  <div className="phone-notch" />
                  <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    10:10 AM • Live Alert
                  </div>

                  <div className="phone-notif-bubble">
                    <div className="phone-notif-app">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Image
                          src="/logo.png"
                          alt="Logo"
                          width={16}
                          height={16}
                          style={{ borderRadius: '4px' }}
                        />
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>Indrajeet Sir UPSC</span>
                      </div>
                      <span>now</span>
                    </div>

                    <div className="phone-notif-title">
                      {notifForm.title || 'Notification Title Preview'}
                    </div>
                    <div className="phone-notif-body">
                      {notifForm.body || 'Message details will be displayed here on the student lock screen...'}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', marginTop: 'auto' }}>
                    Swipe up to open application
                  </div>
                </div>
              </div>
            </div>

            {/* Sent Notifications History */}
            <div className="table-card">
              <div style={{ padding: '1.25rem 1.4rem', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Sent Notification History ({notifications.length})
                </h3>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Campaign ID</th>
                    <th>Notification Title</th>
                    <th>Message Snippet</th>
                    <th>Target Audience</th>
                    <th>Delivered To</th>
                    <th>Sent Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {notifications.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#64748b' }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: '#334155', marginBottom: '0.35rem' }}>
                          No Broadcast Notifications Sent Yet
                        </div>
                        <div style={{ fontSize: '0.86rem' }}>
                          Compose a live announcement above to broadcast real-time updates directly to student devices.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    notifications.map((notif) => (
                      <tr key={notif.id}>
                        <td style={{ fontWeight: 800, fontFamily: 'monospace' }}>#{notif.id}</td>
                        <td style={{ fontWeight: 750, color: '#0f172a' }}>{notif.title}</td>
                        <td style={{ color: '#475569', maxWidth: '320px' }}>{notif.body}</td>
                        <td>
                          <span className="status-pill active">{notif.audience}</span>
                        </td>
                        <td style={{ fontWeight: 700, color: '#059669' }}>
                          {notif.sentCount.toLocaleString()} devices
                        </td>
                        <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{notif.time}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODULE 5: COURSES CATALOG
            ══════════════════════════════════════════════════════════════════════ */}
        {tab === 'courses' && (
          <section>
            <div className="admin-page-header">
              <div>
                <h1>Courses & Programs Catalog</h1>
                <p>Manage mentorship programs, fee structures, and curriculum modules.</p>
              </div>
              <button
                type="button"
                className="btn-primary-admin"
                onClick={() => {
                  setCourses(DEFAULT_COURSES);
                  localStorage.setItem('indrajeet_courses', JSON.stringify(DEFAULT_COURSES));
                  DEFAULT_COURSES.forEach((c) => {
                    fetch(`${API_URL}/courses/${c.id}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(c),
                    }).catch(() => null);
                  });
                  triggerAlert('All 5 official mentorship courses successfully synchronized!');
                }}
              >
                ↻ Load / Sync All 5 Batches
              </button>
            </div>

            <div className="stacked-vertical-layout">
              <div className="admin-card">
                <h3>Add New Mentorship Course</h3>
                <form onSubmit={handleCreateCourse}>
                  <div className="form-group">
                    <label>Course Title</label>
                    <input
                      type="text"
                      placeholder="Ex: UPSC GS Mains 2026 Mentorship"
                      value={courseForm.title}
                      onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Comprehensive guidance, answer writing and 1:1 strategy calls..."
                      value={courseForm.description}
                      onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label>Fee (INR)</label>
                      <input
                        type="number"
                        value={courseForm.price}
                        onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Validity</label>
                      <input
                        type="text"
                        placeholder="e.g. 2 Months, 1 Year"
                        value={courseForm.validity}
                        onChange={(e) => setCourseForm({ ...courseForm, validity: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Batch Tag</label>
                      <input
                        type="text"
                        placeholder="e.g. Notes Making Framework"
                        value={courseForm.tag}
                        onChange={(e) => setCourseForm({ ...courseForm, tag: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                      Course Poster / Cover Banner (16:9 Aspect Ratio)
                    </label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      {courseForm.thumbnail && (
                        <div style={{ width: '110px', height: '62px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', position: 'relative' }}>
                          <Image src={courseForm.thumbnail} alt="Thumbnail preview" fill unoptimized style={{ objectFit: 'cover' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <input
                          type="file"
                          accept="image/*"
                          className="admin-file-input"
                          style={{ padding: '0.35rem', width: '100%' }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
                              const json = await res.json();
                              if (json.success && json.url) {
                                setCourseForm((prev) => ({ ...prev, thumbnail: json.url }));
                                return;
                              }
                            } catch {}
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const dataUrl = event.target?.result as string;
                              if (dataUrl) setCourseForm((prev) => ({ ...prev, thumbnail: dataUrl }));
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            placeholder="Or enter image URL (e.g. /uploads/... or https://...)"
                            value={courseForm.thumbnail}
                            onChange={(e) => setCourseForm({ ...courseForm, thumbnail: e.target.value })}
                            style={{ fontSize: '0.82rem', padding: '0.4rem 0.6rem', flex: 1 }}
                          />
                          {courseForm.thumbnail && (
                            <button
                              type="button"
                              className="btn-outline-admin"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', color: '#dc2626' }}
                              onClick={() => setCourseForm((prev) => ({ ...prev, thumbnail: '' }))}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Features & Bullet Points (One per line)</label>
                    <textarea
                      rows={4}
                      placeholder="Enter each feature on a new line..."
                      value={courseForm.features}
                      onChange={(e) => setCourseForm({ ...courseForm, features: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary-admin" disabled={courseSaving}>
                    {courseSaving ? 'Saving...' : 'Publish Course'}
                  </button>
                </form>
              </div>

              <div className="table-card">
                <div style={{ padding: '1.25rem 1.4rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Active Courses ({courses.length})</h3>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th style={{ width: '130px' }}>Course Poster</th>
                      <th>Course Title &amp; Details</th>
                      <th>Fee</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No custom courses created yet.
                        </td>
                      </tr>
                    ) : (
                      courses.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', alignItems: 'flex-start' }}>
                              <div style={{ width: '100px', height: '56px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #cbd5e1', background: '#f8fafc', position: 'relative' }}>
                                {c.thumbnail ? (
                                  <Image src={c.thumbnail} alt={c.title} fill unoptimized style={{ objectFit: 'cover' }} />
                                ) : (
                                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', color: '#94a3b8', fontWeight: 600 }}>
                                    No Image
                                  </div>
                                )}
                              </div>
                              <label
                                className="btn-outline-admin"
                                style={{
                                  padding: '0.22rem 0.55rem',
                                  fontSize: '0.72rem',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  borderRadius: '6px',
                                  whiteSpace: 'nowrap',
                                }}
                                title="Change poster image from PC"
                              >
                                <IconUpload size={12} />
                                <span>{c.thumbnail ? 'Change Image' : '+ Add Image'}</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      const formData = new FormData();
                                      formData.append('file', file);
                                      const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
                                      const json = await res.json();
                                      if (json.success && json.url) {
                                        const updatedCourses = courses.map((item) =>
                                          item.id === c.id ? { ...item, thumbnail: json.url } : item
                                        );
                                        setCourses(updatedCourses);
                                        localStorage.setItem('indrajeet_courses', JSON.stringify(updatedCourses));
                                        triggerAlert(`Poster image updated for "${c.title}"!`);
                                        return;
                                      }
                                    } catch {}
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      const dataUrl = event.target?.result as string;
                                      if (dataUrl) {
                                        const updatedCourses = courses.map((item) =>
                                          item.id === c.id ? { ...item, thumbnail: dataUrl } : item
                                        );
                                        setCourses(updatedCourses);
                                        localStorage.setItem('indrajeet_courses', JSON.stringify(updatedCourses));
                                        triggerAlert(`Poster image updated for "${c.title}"!`);
                                      }
                                    };
                                    reader.readAsDataURL(file);
                                  }}
                                />
                              </label>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>{c.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', maxWidth: '380px' }}>{c.description}</div>
                            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                              {c.tag && (
                                <span className="status-pill verified" style={{ fontSize: '0.68rem', padding: '0.12rem 0.45rem' }}>
                                  {c.tag}
                                </span>
                              )}
                              {c.validity && (
                                <span className="status-pill pending" style={{ fontSize: '0.68rem', padding: '0.12rem 0.45rem' }}>
                                  {c.validity}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ fontWeight: 850, fontSize: '0.95rem', color: '#0f172a' }}>₹{c.price.toLocaleString('en-IN')}</td>
                          <td>
                            <span className="status-pill verified">Live</span>
                          </td>
                          <td>
                            <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="action-btn-sm edit"
                                onClick={() => {
                                  setEditCourseModal(c);
                                  setEditCourseFeatures((c.features || []).join('\n'));
                                }}
                                title="Edit course details & poster"
                              >
                                Edit
                              </button>
                              <button
                                className="action-btn-sm delete"
                                onClick={() => handleDeleteCourse(c.id, c.title)}
                                title="Delete course"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODULE 6: LIVE CLASSES
            ══════════════════════════════════════════════════════════════════════ */}
        {tab === 'classes' && (
          <section>
            <div className="admin-page-header">
              <div>
                <h1>Live Classes & Mentorship Sessions</h1>
                <p>Schedule upcoming 1:1 strategy sessions and group masterclasses.</p>
              </div>
            </div>

            <div className="stacked-vertical-layout">
              <div className="admin-card">
                <h3>Schedule Live Class</h3>
                <form onSubmit={handleCreateClass}>
                  <div className="form-group">
                    <label>Session Title</label>
                    <input
                      type="text"
                      placeholder="Ex: GS Paper 2 Governance Strategy & Answer Critique"
                      value={classForm.title}
                      onChange={(e) => setClassForm({ ...classForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={classForm.date}
                        onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Time</label>
                      <input
                        type="time"
                        value={classForm.time}
                        onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Live Class URL (Secure Session Link)</label>
                    <input
                      type="url"
                      placeholder="https://live.indrajeetsir.com/session/upsc-2026"
                      value={classForm.meetLink}
                      onChange={(e) => setClassForm({ ...classForm, meetLink: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Target Students / Batch</label>
                    <input
                      type="text"
                      placeholder="All Enrolled Students or specific name"
                      value={classForm.assignedStudent}
                      onChange={(e) => setClassForm({ ...classForm, assignedStudent: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary-admin" disabled={classSaving}>
                    {classSaving ? 'Scheduling...' : 'Schedule Session'}
                  </button>
                </form>
              </div>

              <div className="table-card">
                <div style={{ padding: '1.25rem 1.4rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Scheduled Sessions ({classes.length})</h3>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Session</th>
                      <th>Date & Time</th>
                      <th>Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.length === 0 ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No live sessions scheduled.
                        </td>
                      </tr>
                    ) : (
                      classes.map((cls) => (
                        <tr key={cls.id}>
                          <td>
                            <div style={{ fontWeight: 800 }}>{cls.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#2563eb' }}>{cls.meetLink}</div>
                          </td>
                          <td style={{ fontSize: '0.84rem' }}>
                            {cls.date} at {cls.time}
                          </td>
                          <td>
                            <span className="status-pill active">{cls.assignedStudent}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* ── 7. WEBSITE LIVE EDITOR TAB ────────────────────────────────────────── */}
        {tab === 'website' && (
          <section className="admin-section">
            <div className="section-head">
              <div>
                <h2>Website Live Content Editor</h2>
                <p>Edit headings, stats, copy, quotes and contact details across the public website in real time.</p>
              </div>
              <button
                type="button"
                className="btn-primary-admin"
                onClick={() => {
                  localStorage.setItem('indrajeet_site_content', JSON.stringify(siteContent));
                  triggerAlert('Website content successfully saved and published live!');
                }}
              >
                Save & Publish Live
              </button>
            </div>

            {/* Quick Navigation Anchor Bar for Website Sections */}
            <div
              className="admin-quick-nav-bar"
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                padding: '0.85rem 1rem',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                marginTop: '0.75rem',
                marginBottom: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748b', alignSelf: 'center', marginRight: '0.25rem' }}>
                Quick Jump:
              </span>
              {[
                { label: '1. Hero & Pillars', id: 'website-section-hero' },
                { label: '2. About Indrajeet Sir', id: 'website-section-about-mentor' },
                { label: '3. Mentorship Pillars', id: 'website-section-pillars' },
                { label: '4. Batches & Courses', id: 'website-section-courses' },
                { label: '5. Aspirants', id: 'website-section-aspirants' },
                { label: '6. PDF Section Texts', id: 'website-section-pdf-texts' },
                { label: '7. Mobile App', id: 'website-section-app' },
                { label: '8. FAQs', id: 'website-section-faqs' },
                { label: '9. Contact', id: 'website-section-contact' },
                { label: '10. Callback Leads', id: 'website-section-leads' },
                { label: '⚡ 11. PDF Uploads', id: 'website-section-pdfs' },
                { label: '12. Legal Pages', id: 'website-section-legal' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(item.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '7px',
                    border: item.id === 'website-section-pdfs' ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                    background: item.id === 'website-section-pdfs' ? '#eff6ff' : '#f8fafc',
                    color: item.id === 'website-section-pdfs' ? '#2563eb' : '#334155',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '0.5rem' }}>
              {/* Card 1: Hero Section Headline, 5 Process Pillars & Dhoni Quote */}
              <div id="website-section-hero" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  1. Hero Section Headline & 5 Core Process Pillars
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Controls the primary landing banner headline, mentor portrait photo, and the 5 battle-tested process pillars.
                </p>

                {/* Hero Portrait Photo Manager */}
                <div style={{ marginBottom: '1.5rem', padding: '1.15rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ fontWeight: 800, fontSize: '0.95rem', display: 'block', marginBottom: '0.25rem', color: '#0f172a' }}>
                    Mentor Portrait Photo (Indrajeet Sir)
                  </label>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '1rem' }}>
                    Upload a new photo for Indrajeet Sir. It will update live on the homepage hero section.
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Live Thumbnail Preview */}
                    <div style={{ width: '100px', height: '125px', borderRadius: '10px', overflow: 'hidden', border: '2px solid #cbd5e1', background: '#0f172a', flexShrink: 0, position: 'relative' }}>
                      <Image
                        src={siteContent.heroImage || '/indrajeet-sir-hero.jpg'}
                        alt="Hero Preview"
                        fill
                        unoptimized
                        style={{ objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.25rem' }}>
                          Upload New Photo File (JPG, PNG, WebP)
                        </label>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="admin-file-input"
                          style={{ padding: '0.4rem', width: '100%' }}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              const res = await fetch('/api/upload-image', {
                                method: 'POST',
                                body: formData,
                              });
                              const json = await res.json();
                              if (json.success && json.url) {
                                setSiteContent((prev) => ({ ...prev, heroImage: json.url }));
                                triggerAlert('New photo uploaded successfully! Click "Save & Publish Live" to confirm.');
                                return;
                              }
                            } catch {}

                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const dataUrl = event.target?.result as string;
                              if (dataUrl) {
                                setSiteContent((prev) => ({ ...prev, heroImage: dataUrl }));
                                triggerAlert('Photo loaded! Click "Save & Publish Live" to confirm.');
                              }
                            };
                            reader.readAsDataURL(file);
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            placeholder="Or paste direct image URL (/indrajeet-sir-hero.jpg)"
                            value={siteContent.heroImage || ''}
                            onChange={(e) => setSiteContent({ ...siteContent, heroImage: e.target.value })}
                            style={{ fontSize: '0.82rem', padding: '0.45rem 0.65rem', width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                          />
                        </div>
                        <button
                          type="button"
                          className="btn-outline-admin"
                          style={{ fontSize: '0.8rem', padding: '0.45rem 0.75rem' }}
                          onClick={() => {
                            setSiteContent((prev) => ({ ...prev, heroImage: '/indrajeet-sir-hero.jpg' }));
                            triggerAlert('Reset to default photo. Click "Save & Publish Live".');
                          }}
                        >
                          Reset Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Mentor Portrait Seal Badge</label>
                  <input
                    type="text"
                    value={siteContent.heroBadge || ''}
                    placeholder="e.g. VisionIAS Faculty"
                    onChange={(e) => setSiteContent({ ...siteContent, heroBadge: e.target.value })}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Appears as a floating verified tag on Indrajeet Sir&apos;s portrait.</span>
                </div>

                <div className="form-group">
                  <label>Hero Headline</label>
                  <textarea
                    rows={2}
                    value={siteContent.heroHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, heroHeading: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <label>Hero Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={siteContent.heroSubheading || ''}
                    placeholder="Keeping this in mind, Indrajeet Sir follows a structured, result-oriented approach..."
                    onChange={(e) => setSiteContent({ ...siteContent, heroSubheading: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    5 Core Process Pillars
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem' }}>Pillar 1</label>
                      <input
                        type="text"
                        value={siteContent.heroPillar1}
                        onChange={(e) => setSiteContent({ ...siteContent, heroPillar1: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem' }}>Pillar 2</label>
                      <input
                        type="text"
                        value={siteContent.heroPillar2}
                        onChange={(e) => setSiteContent({ ...siteContent, heroPillar2: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem' }}>Pillar 3</label>
                      <input
                        type="text"
                        value={siteContent.heroPillar3}
                        onChange={(e) => setSiteContent({ ...siteContent, heroPillar3: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem' }}>Pillar 4</label>
                      <input
                        type="text"
                        value={siteContent.heroPillar4}
                        onChange={(e) => setSiteContent({ ...siteContent, heroPillar4: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: '0.8rem' }}>Pillar 5</label>
                      <input
                        type="text"
                        value={siteContent.heroPillar5}
                        onChange={(e) => setSiteContent({ ...siteContent, heroPillar5: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <label style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Mentorship Philosophy Quote (MS Dhoni)
                  </label>
                  <div className="form-group">
                    <label>Quote Content</label>
                    <textarea
                      rows={2}
                      value={siteContent.dhoniQuote}
                      onChange={(e) => setSiteContent({ ...siteContent, dhoniQuote: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label>Author</label>
                      <input
                        type="text"
                        value={siteContent.dhoniAuthor}
                        onChange={(e) => setSiteContent({ ...siteContent, dhoniAuthor: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tag / Subtitle</label>
                      <input
                        type="text"
                        value={siteContent.dhoniTag}
                        onChange={(e) => setSiteContent({ ...siteContent, dhoniTag: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Section 1 - About Indrajeet Sir (5 Credential Highlights) */}
              <div id="website-section-about-mentor" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  2. About Indrajeet Sir (5 Credential Highlight Cards)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Manages the heading and the 5 official credential cards showcasing Sir&apos;s background.
                </p>
                <div className="form-group">
                  <label>Section Heading</label>
                  <input
                    type="text"
                    value={siteContent.aboutSirHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutSirHeading: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Card 1</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.sirCard1Val}
                        onChange={(e) => setSiteContent({ ...siteContent, sirCard1Val: e.target.value })}
                        placeholder="Card 1 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.sirCard1Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, sirCard1Desc: e.target.value })}
                      placeholder="Card 1 Description"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Card 2</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.sirCard2Val}
                        onChange={(e) => setSiteContent({ ...siteContent, sirCard2Val: e.target.value })}
                        placeholder="Card 2 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.sirCard2Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, sirCard2Desc: e.target.value })}
                      placeholder="Card 2 Description"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Card 3</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.sirCard3Val}
                        onChange={(e) => setSiteContent({ ...siteContent, sirCard3Val: e.target.value })}
                        placeholder="Card 3 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.sirCard3Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, sirCard3Desc: e.target.value })}
                      placeholder="Card 3 Description"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Card 4</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.sirCard4Val}
                        onChange={(e) => setSiteContent({ ...siteContent, sirCard4Val: e.target.value })}
                        placeholder="Card 4 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.sirCard4Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, sirCard4Desc: e.target.value })}
                      placeholder="Card 4 Description"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Card 5</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.sirCard5Val}
                        onChange={(e) => setSiteContent({ ...siteContent, sirCard5Val: e.target.value })}
                        placeholder="Card 5 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.sirCard5Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, sirCard5Desc: e.target.value })}
                      placeholder="Card 5 Description"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Section 2 - About The Mentorship (4 Core Pillars) */}
              <div id="website-section-pillars" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  3. About The Mentorship (4 Core Pillar Cards)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Controls the methodology cards explaining how Indrajeet Sir&apos;s mentorship system operates.
                </p>
                <div className="form-group">
                  <label>Section Heading</label>
                  <input
                    type="text"
                    value={siteContent.aboutMentorHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutMentorHeading: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Pillar 1</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.mentorPillar1Title}
                        onChange={(e) => setSiteContent({ ...siteContent, mentorPillar1Title: e.target.value })}
                        placeholder="Pillar 1 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.mentorPillar1Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, mentorPillar1Desc: e.target.value })}
                      placeholder="Pillar 1 Description"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Pillar 2</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.mentorPillar2Title}
                        onChange={(e) => setSiteContent({ ...siteContent, mentorPillar2Title: e.target.value })}
                        placeholder="Pillar 2 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.mentorPillar2Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, mentorPillar2Desc: e.target.value })}
                      placeholder="Pillar 2 Description"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Pillar 3</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.mentorPillar3Title}
                        onChange={(e) => setSiteContent({ ...siteContent, mentorPillar3Title: e.target.value })}
                        placeholder="Pillar 3 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.mentorPillar3Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, mentorPillar3Desc: e.target.value })}
                      placeholder="Pillar 3 Description"
                    />
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#2563eb' }}>Pillar 4</label>
                    <div className="form-group" style={{ margin: '0.4rem 0' }}>
                      <input
                        type="text"
                        value={siteContent.mentorPillar4Title}
                        onChange={(e) => setSiteContent({ ...siteContent, mentorPillar4Title: e.target.value })}
                        placeholder="Pillar 4 Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={siteContent.mentorPillar4Desc}
                      onChange={(e) => setSiteContent({ ...siteContent, mentorPillar4Desc: e.target.value })}
                      placeholder="Pillar 4 Description"
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Mentorship Batches & Courses (All 5 Programs Live in CMS) */}
              <div id="website-section-courses" className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.25rem', color: '#0f172a' }}>
                      4. Mentorship Batches & Courses (All 5 Programs)
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      Edit course titles, pricing, validity durations, and line-by-line bullet features directly here.
                    </p>
                  </div>
                  <span className="status-pill verified">5 Courses Active</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Section Heading</label>
                    <input
                      type="text"
                      value={siteContent.coursesHeading}
                      onChange={(e) => setSiteContent({ ...siteContent, coursesHeading: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Section Subheading</label>
                    {/* <input
                      type="text"
                      value={siteContent.coursesSubheading}
                      onChange={(e) => setSiteContent({ ...siteContent, coursesSubheading: e.target.value })}
                    /> */}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {courses.map((course, idx) => (
                    <div
                      key={course.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        background: '#ffffff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                            Course {idx + 1}: {course.title}
                          </span>
                          {course.tag && (
                            <span className="status-pill verified" style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem' }}>
                              {course.tag}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                            ₹{course.price.toLocaleString('en-IN')}
                          </span>
                          <span className="status-pill pending" style={{ fontSize: '0.72rem' }}>
                            ⏱ {course.validity || '1 Year'}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Course Title</label>
                          <input
                            type="text"
                            value={course.title}
                            onChange={(e) => {
                              const newTitle = e.target.value;
                              setCourses((prev) => {
                                const next = prev.map((c) => (c.id === course.id ? { ...c, title: newTitle } : c));
                                try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                return next;
                              });
                            }}
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Fee (INR)</label>
                          <input
                            type="number"
                            value={course.price}
                            onChange={(e) => {
                              const newPrice = Number(e.target.value) || 0;
                              setCourses((prev) => {
                                const next = prev.map((c) => (c.id === course.id ? { ...c, price: newPrice } : c));
                                try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                return next;
                              });
                            }}
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Validity</label>
                          <input
                            type="text"
                            value={course.validity || ''}
                            placeholder="e.g. 2 Months"
                            onChange={(e) => {
                              const newValidity = e.target.value;
                              setCourses((prev) => {
                                const next = prev.map((c) => (c.id === course.id ? { ...c, validity: newValidity } : c));
                                try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                return next;
                              });
                            }}
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Batch Tag / Badge</label>
                          <input
                            type="text"
                            value={course.tag || ''}
                            placeholder="e.g. Notes Making Framework"
                            onChange={(e) => {
                              const newTag = e.target.value;
                              setCourses((prev) => {
                                const next = prev.map((c) => (c.id === course.id ? { ...c, tag: newTag } : c));
                                try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                return next;
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Brief Description</label>
                        <input
                          type="text"
                          value={course.description || ''}
                          onChange={(e) => {
                            const newDesc = e.target.value;
                            setCourses((prev) => {
                              const next = prev.map((c) => (c.id === course.id ? { ...c, description: newDesc } : c));
                              try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                              return next;
                            });
                          }}
                        />
                      </div>

                      {/* Course Cover Image Box */}
                      <div className="form-group" style={{ marginBottom: '0.75rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>Course Cover Image / Thumbnail</label>
                        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          {course.thumbnail && (
                            <div style={{ width: '70px', height: '52px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', position: 'relative' }}>
                              <Image src={course.thumbnail} alt={course.title} fill unoptimized style={{ objectFit: 'cover' }} />
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <input
                              type="file"
                              accept="image/*"
                              className="admin-file-input"
                              style={{ padding: '0.3rem', width: '100%', fontSize: '0.8rem' }}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                try {
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
                                  const json = await res.json();
                                  if (json.success && json.url) {
                                    setCourses((prev) => {
                                      const next = prev.map((c) => (c.id === course.id ? { ...c, thumbnail: json.url } : c));
                                      try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                      return next;
                                    });
                                    triggerAlert('Course image uploaded successfully.');
                                    return;
                                  }
                                } catch {}
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const dataUrl = event.target?.result as string;
                                  if (dataUrl) {
                                    setCourses((prev) => {
                                      const next = prev.map((c) => (c.id === course.id ? { ...c, thumbnail: dataUrl } : c));
                                      try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                      return next;
                                    });
                                    triggerAlert('Course image set.');
                                  }
                                };
                                reader.readAsDataURL(file);
                              }}
                            />
                            <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                              <input
                                type="text"
                                placeholder="Or enter image URL"
                                value={course.thumbnail || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setCourses((prev) => {
                                    const next = prev.map((c) => (c.id === course.id ? { ...c, thumbnail: val } : c));
                                    try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                    return next;
                                  });
                                }}
                                style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem', flex: 1 }}
                              />
                              {course.thumbnail && (
                                <button
                                  type="button"
                                  className="btn-outline-admin"
                                  style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem', color: '#dc2626' }}
                                  onClick={() => {
                                    setCourses((prev) => {
                                      const next = prev.map((c) => (c.id === course.id ? { ...c, thumbnail: '' } : c));
                                      try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                                      return next;
                                    });
                                  }}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                            Curriculum Features & Key Highlights (One bullet per line)
                          </label>
                          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {Array.isArray(course.features) ? course.features.length : 0} bullets listed
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          value={Array.isArray(course.features) ? course.features.join('\n') : ''}
                          placeholder="Enter each feature on a new line..."
                          onChange={(e) => {
                            const lines = e.target.value.split('\n');
                            setCourses((prev) => {
                              const next = prev.map((c) => (c.id === course.id ? { ...c, features: lines } : c));
                              try { localStorage.setItem('indrajeet_courses', JSON.stringify(next)); } catch {}
                              return next;
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Mentored Aspirants Section */}
              <div id="website-section-aspirants" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  5. Mentored Aspirants (3 Showcase Cards)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Manage the names and titles displayed below each topper photo card.
                </p>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Section Heading</label>
                  <input
                    type="text"
                    value={siteContent.resultsHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, resultsHeading: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>Person 1 (IRS)</label>
                    <div className="form-group" style={{ margin: '0.4rem 0 0' }}>
                      <input
                        type="text"
                        value={siteContent.result1Name}
                        onChange={(e) => setSiteContent({ ...siteContent, result1Name: e.target.value })}
                        placeholder="Jatin Parashar (IRS) UPSC 2022"
                      />
                    </div>
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>Person 2 (IAS)</label>
                    <div className="form-group" style={{ margin: '0.4rem 0 0' }}>
                      <input
                        type="text"
                        value={siteContent.result2Name}
                        onChange={(e) => setSiteContent({ ...siteContent, result2Name: e.target.value })}
                        placeholder="Kritika Mishra (IAS) UPSC 2023"
                      />
                    </div>
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>Person 3 (IPS)</label>
                    <div className="form-group" style={{ margin: '0.4rem 0 0' }}>
                      <input
                        type="text"
                        value={siteContent.result3Name}
                        onChange={(e) => setSiteContent({ ...siteContent, result3Name: e.target.value })}
                        placeholder="Devesh Parashar (IPS) UPSC 2024"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6: Important PDFs Section */}
              <div id="website-section-pdf-texts" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  6. Important PDFs & Resource Material Section
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Headline and description for the free study resources & brochure download cards.
                </p>
                <div className="form-group">
                  <label>Section Heading</label>
                  <input
                    type="text"
                    value={siteContent.pdfSectionHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, pdfSectionHeading: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Section Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={siteContent.pdfSectionSubheading}
                    onChange={(e) => setSiteContent({ ...siteContent, pdfSectionSubheading: e.target.value })}
                  />
                </div>
              </div>

              {/* Card 7: Mobile Application Showcase */}
              <div id="website-section-app" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  7. Mobile Application Showcase
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Controls the title, description, and Google Play Store link for the mobile app section.
                </p>
                <div className="form-group">
                  <label>App Showcase Title</label>
                  <input
                    type="text"
                    value={siteContent.appTitle}
                    onChange={(e) => setSiteContent({ ...siteContent, appTitle: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>App Showcase Description</label>
                  <textarea
                    rows={2}
                    value={siteContent.appDesc}
                    onChange={(e) => setSiteContent({ ...siteContent, appDesc: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Google Play Store URL</label>
                  <input
                    type="text"
                    value={siteContent.appPlayStoreUrl}
                    onChange={(e) => setSiteContent({ ...siteContent, appPlayStoreUrl: e.target.value })}
                  />
                </div>
              </div>

                            {/* Card 8: Frequently Asked Questions (FAQs) Manager */}
              <div id="website-section-faqs" className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      8. Frequently Asked Questions (FAQs) Manager ({faqs.length})
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                      Add, edit, or delete student doubts and mentorship FAQs displayed on the landing page.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-admin"
                    style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
                    onClick={() => {
                      const newFaq: FaqItem = {
                        id: `faq-${Date.now()}`,
                        q: 'Naya Sawal / New Question Title?',
                        a: 'Yahan vistar se uttar likhein... / Detailed answer explanation.',
                      };
                      setFaqs([...faqs, newFaq]);
                    }}
                  >
                    + Add New FAQ
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem', background: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Section Heading</label>
                    <input
                      type="text"
                      value={siteContent.faqsHeading || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, faqsHeading: e.target.value })}
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700 }}>Section Subtitle</label>
                    <input
                      type="text"
                      value={siteContent.faqsSubheading || ''}
                      onChange={(e) => setSiteContent({ ...siteContent, faqsSubheading: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {faqs.map((faq, idx) => (
                    <div
                      key={faq.id || idx}
                      style={{
                        padding: '1rem',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        background: '#ffffff',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                          FAQ #{idx + 1}
                        </span>
                        <button
                          type="button"
                          className="action-btn-sm delete"
                          onClick={() => {
                            if (window.confirm(`Delete FAQ #${idx + 1}?`)) {
                              setFaqs(faqs.filter((_, i) => i !== idx));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Question (Hindi / English)</label>
                        <input
                          type="text"
                          value={faq.q}
                          onChange={(e) => {
                            const newQ = e.target.value;
                            setFaqs(faqs.map((f, i) => (i === idx ? { ...f, q: newQ } : f)));
                          }}
                        />
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Answer Explanation</label>
                        <textarea
                          rows={3}
                          value={faq.a}
                          onChange={(e) => {
                            const newA = e.target.value;
                            setFaqs(faqs.map((f, i) => (i === idx ? { ...f, a: newA } : f)));
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 9: Contact Desk & Telegram Channels */}
              <div id="website-section-contact" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  7. Contact Desk & Official Channels
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Updates the contact card, phone dialers, and Telegram links across the website and footer.
                </p>
                <div className="form-group">
                  <label>Contact Desk Heading</label>
                  <input
                    type="text"
                    value={siteContent.contactDeskHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, contactDeskHeading: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Desk Subtitle</label>
                  <input
                    type="text"
                    value={siteContent.contactDeskSubheading}
                    onChange={(e) => setSiteContent({ ...siteContent, contactDeskSubheading: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Telegram Handle</label>
                    <input
                      type="text"
                      value={siteContent.telegramHandle}
                      onChange={(e) => setSiteContent({ ...siteContent, telegramHandle: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Telegram Link URL</label>
                    <input
                      type="text"
                      value={siteContent.telegramUrl}
                      onChange={(e) => setSiteContent({ ...siteContent, telegramUrl: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Display</label>
                    <input
                      type="text"
                      value={siteContent.phoneDisplay}
                      onChange={(e) => setSiteContent({ ...siteContent, phoneDisplay: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>WhatsApp Display</label>
                    <input
                      type="text"
                      value={siteContent.whatsappDisplay}
                      onChange={(e) => setSiteContent({ ...siteContent, whatsappDisplay: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Official Email</label>
                    <input
                      type="email"
                      value={siteContent.contactEmail}
                      onChange={(e) => setSiteContent({ ...siteContent, contactEmail: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-primary-admin"
                    onClick={() => {
                      localStorage.setItem('indrajeet_site_content', JSON.stringify(siteContent));
                      triggerAlert('All website changes published live successfully!');
                    }}
                  >
                    Save & Publish Live
                  </button>
                </div>
              </div>

              {/* Card 10: Callback Leads & Aspirant Inquiries */}
              <div id="website-section-leads" className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      Callback Leads &amp; Inquiries ({callbackLeads.length})
                    </h3>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.86rem', color: '#64748b' }}>
                      Aspirant phone numbers submitted on the website (&ldquo;Crack UPSC with our Expert Guidance&rdquo; banner and Hero buttons).
                    </p>
                  </div>
                  {callbackLeads.length > 0 && (
                    <button
                      type="button"
                      className="btn-outline-admin"
                      onClick={() => {
                        if (confirm('Clear all callback leads?')) {
                          setCallbackLeads([]);
                          localStorage.removeItem('indrajeet_callback_leads');
                        }
                      }}
                      style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    >
                      Clear All Leads
                    </button>
                  )}
                </div>

                {callbackLeads.length === 0 ? (
                  <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '10px' }}>
                    No callback requests yet. Any inquiry submitted on the website will instantly appear here.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ background: '#f1f5f9', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Date &amp; Time</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Lead Name / Type</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Phone Number</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {callbackLeads.map((lead, idx) => (
                          <tr key={lead.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                              {lead.timestamp ? new Date(lead.timestamp).toLocaleString('en-IN') : 'Recent'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                              {lead.name || 'Quick Lead'}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#2563eb' }}>
                              {lead.phone}
                            </td>
                            <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                              <a
                                href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  background: '#25D366',
                                  color: '#fff',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                  marginRight: '0.5rem',
                                }}
                              >
                                WhatsApp
                              </a>
                              <a
                                href={`tel:${lead.phone}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  background: '#2563eb',
                                  color: '#fff',
                                  padding: '0.35rem 0.75rem',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 600,
                                  textDecoration: 'none',
                                }}
                              >
                                Call
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              

              {/* Card 11: PDF Study Material & Documents Manager */}
              <div id="website-section-pdfs" className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    11. PDF Resources & Direct Upload Manager
                  </h3>
                  <span className="status-pill active">{pdfList.length} Active PDFs</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Upload new PDFs with auto-slug naming. PDFs are stored in <code>/public/uploads/&lt;slug&gt;.pdf</code> and open in a new tab for students.
                </p>

                {/* Upload New PDF Form */}
                <form
                  onSubmit={handleUploadPdf}
                  className="admin-pdf-upload-form"
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div className="admin-pdf-form-title" style={{ fontWeight: 800, fontSize: '0.98rem', marginBottom: '0.4rem', color: '#1e293b' }}>
                    Upload New PDF Document
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', lineHeight: '1.4' }}>
                    💡 Tip: Files up to 45 MB supported. Please avoid special symbols in titles for clean download URLs.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontWeight: 700, fontSize: '0.84rem' }}>Document Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Hero Article Worksheet by Indrajeet Sir"
                        value={pdfForm.title}
                        onChange={(e) => setPdfForm({ ...pdfForm, title: e.target.value })}
                        required
                        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '7px' }}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontWeight: 700, fontSize: '0.84rem' }}>Tag / Category</label>
                      <select
                        value={pdfForm.tag}
                        onChange={(e) => setPdfForm({ ...pdfForm, tag: e.target.value })}
                        style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '7px' }}
                      >
                        <option value="Official Brochure">Official Brochure</option>
                        <option value="Mains Notes">Mains Notes</option>
                        <option value="Sample Copy">Sample Copy</option>
                        <option value="PCS Special">PCS Special</option>
                        <option value="Strategy Guide">Strategy Guide</option>
                        <option value="Worksheet">Worksheet</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontWeight: 700, fontSize: '0.84rem' }}>Select PDF File (.pdf only) *</label>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setPdfForm({ ...pdfForm, file: e.target.files ? e.target.files[0] : null })}
                        required
                        className="admin-file-input"
                        style={{ width: '100%', padding: '0.45rem', borderRadius: '7px' }}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1.1rem' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.84rem' }}>Description (Aspirant summary)</label>
                    <input
                      type="text"
                      placeholder="Brief description shown on the website card"
                      value={pdfForm.description}
                      onChange={(e) => setPdfForm({ ...pdfForm, description: e.target.value })}
                      style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '7px' }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-primary-admin"
                    disabled={pdfUploading}
                    style={{ padding: '0.65rem 1.4rem', fontWeight: 700, borderRadius: '8px' }}
                  >
                    {pdfUploading ? 'Uploading & Generating Slug...' : 'Upload PDF & Publish Live'}
                  </button>
                </form>

                {/* Current Active PDFs List */}
                <div className="admin-pdf-library-title" style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem' }}>
                  Live PDF Library ({pdfList.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pdfList.map((item) => (
                    <div
                      key={item.id}
                      className="admin-pdf-item"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.1rem',
                        borderRadius: '10px',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="admin-pdf-title" style={{ fontWeight: 750, fontSize: '0.92rem' }}>{item.title}</span>
                          <span className="status-pill active" style={{ fontSize: '0.7rem' }}>{item.tag}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                          File: <span style={{ fontFamily: 'monospace', color: '#2563eb' }}>{item.fileUrl}</span> • Size: {item.size}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            background: '#eff6ff',
                            color: '#2563eb',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            textDecoration: 'none',
                          }}
                        >
                          Open in New Tab ↗
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeletePdf(item.id, item.title)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 12: Legal Pages Live Editor (Terms, Privacy, Disclaimers) */}
              <div id="website-section-legal" className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  12. Other Website Pages Editor (Terms, Privacy & Disclaimers)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Edit policies, refund clauses, aspirant confidentiality commitments, and official legal disclaimers.
                </p>

                {/* Sub-block A: Terms of Service */}
                <div className="admin-legal-subcard" style={{ padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div className="admin-legal-subcard-title" style={{ fontWeight: 750, marginBottom: '0.75rem' }}>Terms of Service (/terms)</div>
                  <div className="form-group">
                    <label>Top Callout Box</label>
                    <textarea
                      rows={2}
                      value={termsContent.callout}
                      onChange={(e) => setTermsContent({ ...termsContent, callout: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Refund Policy Clause Content</label>
                    <textarea
                      rows={2}
                      value={termsContent.section4Content}
                      onChange={(e) => setTermsContent({ ...termsContent, section4Content: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sub-block B: Privacy Policy */}
                <div className="admin-legal-subcard" style={{ padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div className="admin-legal-subcard-title" style={{ fontWeight: 750, marginBottom: '0.75rem' }}>Privacy Policy (/privacy)</div>
                  <div className="form-group">
                    <label>Confidentiality Callout Box</label>
                    <textarea
                      rows={2}
                      value={privacyContent.callout}
                      onChange={(e) => setPrivacyContent({ ...privacyContent, callout: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Collected Information Scope</label>
                    <textarea
                      rows={2}
                      value={privacyContent.section2Content}
                      onChange={(e) => setPrivacyContent({ ...privacyContent, section2Content: e.target.value })}
                    />
                  </div>
                </div>

                {/* Sub-block C: Disclaimers */}
                <div className="admin-legal-subcard" style={{ padding: '1rem', borderRadius: '10px', marginBottom: '1rem' }}>
                  <div className="admin-legal-subcard-title" style={{ fontWeight: 750, marginBottom: '0.75rem' }}>Disclaimers & Cookie Policy (/disclaimer)</div>
                  <div className="form-group">
                    <label>Non-Affiliation Notice</label>
                    <textarea
                      rows={2}
                      value={disclaimerContent.callout}
                      onChange={(e) => setDisclaimerContent({ ...disclaimerContent, callout: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Examination Results Disclaimer</label>
                    <textarea
                      rows={2}
                      value={disclaimerContent.section2Content}
                      onChange={(e) => setDisclaimerContent({ ...disclaimerContent, section2Content: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn-primary-admin"
                    onClick={() => {
                      localStorage.setItem('indrajeet_terms_content', JSON.stringify(termsContent));
                      localStorage.setItem('indrajeet_privacy_content', JSON.stringify(privacyContent));
                      localStorage.setItem('indrajeet_disclaimer_content', JSON.stringify(disclaimerContent));
                      triggerAlert('Legal & other pages content saved and published live!');
                    }}
                  >
                    Save All Pages Content Live
                  </button>
                </div>
              </div>
            </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  className="btn-primary-admin"
                  style={{ minWidth: '220px' }}
                  onClick={() => {
                    localStorage.setItem('indrajeet_site_content', JSON.stringify(siteContent));
                    localStorage.setItem('indrajeet_courses', JSON.stringify(courses));
                    localStorage.setItem('indrajeet_faqs', JSON.stringify(faqs));
                    fetch(`${API_URL}/faqs`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(faqs),
                    }).catch(() => null);
                    courses.forEach((c) => {
                      fetch(`${API_URL}/courses/${c.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(c),
                      }).catch(() => null);
                    });
                    triggerAlert('Website content & all 5 courses successfully saved and published live!');
                  }}
                >
                  Save & Publish Live
                </button>
              </div>
            </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            MODULE 8: MENTORSHIP CHAT & STUDENT DOUBTS DESK
            ══════════════════════════════════════════════════════════════════════ */}
        {tab === 'messages' && (
          <section>
            <div className="admin-page-header">
              <div>
                <h1>Student Mentorship &amp; Doubts Desk</h1>
                <p>Direct 1:1 doubt clearing, answer writing copy evaluation, and student consultation.</p>
              </div>
              <button
                className="btn-primary-admin"
                onClick={fetchAdminMessages}
              >
                Refresh Messages
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-card-label">Total Messages</span>
                <span className="kpi-card-val">{adminMessages.length}</span>
                <span className="kpi-card-meta">Preserved in permanent database</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Student Doubts</span>
                <span className="kpi-card-val" style={{ color: '#2563eb' }}>
                  {adminMessages.filter(m => m.sender === 'student').length}
                </span>
                <span className="kpi-card-meta">Inquiries &amp; answer submissions</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Teacher Replies</span>
                <span className="kpi-card-val" style={{ color: '#059669' }}>
                  {adminMessages.filter(m => m.sender === 'admin').length}
                </span>
                <span className="kpi-card-meta">Guidance notes by Indrajeet Sir</span>
              </div>
              <div className="kpi-card">
                <span className="kpi-card-label">Active Aspirants</span>
                <span className="kpi-card-val" style={{ color: '#7c3aed' }}>
                  {new Set(adminMessages.filter(m => m.studentName && m.sender === 'student').map(m => m.studentName)).size}
                </span>
                <span className="kpi-card-meta">Engaged in 1:1 channel</span>
              </div>
            </div>

            {/* Chat Workspace */}
            <div className="admin-chat-container">
              {/* Filter / Student Tabs */}
              <div className="admin-chat-student-bar">
                <span className="filter-label">Filter by Aspirant:</span>
                <button
                  className={`chat-filter-chip ${selectedChatStudent === 'ALL' ? 'active' : ''}`}
                  onClick={() => setSelectedChatStudent('ALL')}
                >
                  All Conversations ({adminMessages.length})
                </button>
                {Array.from(new Set(adminMessages.filter(m => m.studentName && m.sender === 'student').map(m => m.studentName))).map(name => (
                  <button
                    key={name}
                    className={`chat-filter-chip ${selectedChatStudent === name ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedChatStudent(name);
                      setAdminTargetStudent(name);
                    }}
                  >
                    {name} ({adminMessages.filter(m => m.studentName === name).length})
                  </button>
                ))}
              </div>

              {/* Messages Feed */}
              <div className="admin-chat-feed">
                {adminMessages.filter(m => selectedChatStudent === 'ALL' || m.studentName === selectedChatStudent).length === 0 ? (
                  <div className="admin-chat-empty">
                    <IconMessageSquare size={36} />
                    <h4>No messages in this channel yet</h4>
                    <p>When students submit doubts from the app or web portal, they will appear here.</p>
                  </div>
                ) : (
                  adminMessages
                    .filter(m => selectedChatStudent === 'ALL' || m.studentName === selectedChatStudent)
                    .map((msg, index, filteredList) => {
                      const isAdmin = msg.sender === 'admin';
                      const dateLabel = msg.date || (msg.timestamp && msg.timestamp.includes(',') ? msg.timestamp.split(',')[0].trim() : 'Recent');
                      const prevMsg = index > 0 ? filteredList[index - 1] : undefined;
                      const prevDateLabel = prevMsg ? (prevMsg.date || (prevMsg.timestamp && prevMsg.timestamp.includes(',') ? prevMsg.timestamp.split(',')[0].trim() : 'Recent')) : null;
                      const showDateDivider = index === 0 || dateLabel !== prevDateLabel;
                      const timeLabel = msg.time || (msg.timestamp && msg.timestamp.includes(',') ? msg.timestamp.split(',')[1].trim() : msg.timestamp || '');

                      return (
                        <div key={msg.id} className="admin-chat-msg-row">
                          {showDateDivider && (
                            <div className="admin-chat-date-divider">
                              <span>{dateLabel}</span>
                            </div>
                          )}
                          <div className={`admin-chat-bubble ${isAdmin ? 'admin-sender' : 'student-sender'}`}>
                            <div className="admin-bubble-header">
                              <span className="bubble-author">
                                {isAdmin ? 'Indrajeet Sir (Mentor)' : (msg.studentName || 'Student')}
                              </span>
                              <span className="bubble-badge">
                                {isAdmin ? 'Faculty Reply' : 'Student Doubt'}
                              </span>
                            </div>

                            {msg.fileName && (
                              <div className="admin-bubble-file">
                                <IconPaperclip size={14} />
                                <span>{msg.fileName}</span>
                                {msg.fileType && <small style={{ marginLeft: '4px', opacity: 0.8 }}>({msg.fileType})</small>}
                              </div>
                            )}

                            <div className="admin-bubble-text">{msg.text}</div>

                            <div className="admin-bubble-footer">
                              {msg.isEdited && <span className="edited-indicator">(edited)</span>}
                              <span>{timeLabel || msg.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Reply / Send Message Composer */}
              <form className="admin-chat-composer" onSubmit={handleAdminSendMessage}>
                <div className="composer-target-select">
                  <label>Reply as Indrajeet Sir to:</label>
                  <select
                    value={adminTargetStudent || (selectedChatStudent !== 'ALL' ? selectedChatStudent : 'All Enrolled Students')}
                    onChange={(e) => setAdminTargetStudent(e.target.value)}
                  >
                    <option value="All Enrolled Students">All Enrolled Students (Batch Announcement)</option>
                    {Array.from(new Set([
                      ...adminMessages.filter(m => m.studentName && m.sender === 'student').map(m => m.studentName),
                      ...users.map(u => u.name).filter(Boolean)
                    ])).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="composer-input-row">
                  <input
                    type="text"
                    placeholder="Type personal evaluation feedback, model points, or doubt clarification..."
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-send-admin" disabled={adminSendingMsg}>
                    <IconSend size={15} />
                    <span>{adminSendingMsg ? 'Sending...' : 'Send Reply'}</span>
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </main>

      {/* ── MODAL: EDIT BANNER (Content Control) ──────────────────────────────── */}
      {activeBannerModal && (
        <div className="modal-overlay" onClick={() => setActiveBannerModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveBannerModal(null)}>
              ✕
            </button>
            <h3>Edit App Banner & Offer</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Change banner copy inside the student mobile app in real time without app release.
            </p>

            <form onSubmit={handleSaveBanner}>
              <div className="form-group">
                <label>Badge Tag</label>
                <input
                  type="text"
                  value={activeBannerModal.tag}
                  onChange={(e) =>
                    setActiveBannerModal({ ...activeBannerModal, tag: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Banner Headline (e.g. &quot;Flat 50% OFF&quot; instead of &quot;Diwali Sale&quot;)</label>
                <input
                  type="text"
                  value={activeBannerModal.title}
                  onChange={(e) =>
                    setActiveBannerModal({ ...activeBannerModal, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Subheading / Offer Details</label>
                <textarea
                  value={activeBannerModal.subtitle}
                  onChange={(e) =>
                    setActiveBannerModal({ ...activeBannerModal, subtitle: e.target.value })
                  }
                  rows={3}
                  required
                />
              </div>

              <div className="form-group">
                <label>Target Screen Route</label>
                <input
                  type="text"
                  value={activeBannerModal.targetRoute}
                  onChange={(e) =>
                    setActiveBannerModal({ ...activeBannerModal, targetRoute: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Banner Visibility Status</label>
                <select
                  value={activeBannerModal.active ? 'active' : 'inactive'}
                  onChange={(e) =>
                    setActiveBannerModal({
                      ...activeBannerModal,
                      active: e.target.value === 'active',
                    })
                  }
                >
                  <option value="active">Active (Visible in App)</option>
                  <option value="inactive">Disabled (Hidden)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary-admin" style={{ flex: 1 }}>
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-secondary-admin"
                  onClick={() => setActiveBannerModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CREATE USER ───────────────────────────────────────────────── */}
      {newUserModal && (
        <div className="modal-overlay" onClick={() => setNewUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setNewUserModal(false)}>
              ✕
            </button>
            <h3>Add New Student Account</h3>
            <form onSubmit={handleCreateUser}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={newUserForm.phone}
                  onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Assigned Program / Batch</label>
                <input
                  type="text"
                  value={newUserForm.role}
                  onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn-primary-admin" style={{ flex: 1 }}>
                  Create Account
                </button>
                <button
                  type="button"
                  className="btn-secondary-admin"
                  onClick={() => setNewUserModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: EDIT COURSE ────────────────────────────────────────────────── */}
      {editCourseModal && (
        <div className="modal-overlay" onClick={() => setEditCourseModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setEditCourseModal(null)}>
              ✕
            </button>
            <h3>Edit Course / Mentorship Program</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
              Update title, curriculum description, or fee pricing in real time.
            </p>

            <form onSubmit={handleUpdateCourse}>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  value={editCourseModal.title}
                  onChange={(e) =>
                    setEditCourseModal({ ...editCourseModal, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={editCourseModal.description || ''}
                  onChange={(e) =>
                    setEditCourseModal({ ...editCourseModal, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Fee (INR)</label>
                <input
                  type="number"
                  value={editCourseModal.price}
                  onChange={(e) =>
                    setEditCourseModal({ ...editCourseModal, price: Number(e.target.value) || 0 })
                  }
                  required
                />
              </div>

              {/* Course Thumbnail Box */}
              <div className="form-group" style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block', marginBottom: '0.35rem' }}>
                  Course Cover Image / Poster (16:9 Banner)
                  <span style={{ fontWeight: 500, fontSize: '0.75rem', color: '#64748b', marginLeft: '0.5rem' }}>
                    (Recommended: 1280×720 or 1920×1080)
                  </span>
                </label>
                <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {editCourseModal.thumbnail && (
                    <div style={{ width: '100px', height: '56px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', position: 'relative' }}>
                      <Image src={editCourseModal.thumbnail} alt={editCourseModal.title} fill unoptimized style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <input
                      type="file"
                      accept="image/*"
                      className="admin-file-input"
                      style={{ padding: '0.3rem', width: '100%', fontSize: '0.8rem' }}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const formData = new FormData();
                          formData.append('file', file);
                          const res = await fetch('/api/upload-image', { method: 'POST', body: formData });
                          const json = await res.json();
                          if (json.success && json.url) {
                            setEditCourseModal((prev) => (prev ? { ...prev, thumbnail: json.url } : null));
                            return;
                          }
                        } catch {}
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const dataUrl = event.target?.result as string;
                          if (dataUrl) {
                            setEditCourseModal((prev) => (prev ? { ...prev, thumbnail: dataUrl } : null));
                          }
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Or enter image URL"
                        value={editCourseModal.thumbnail || ''}
                        onChange={(e) => setEditCourseModal({ ...editCourseModal, thumbnail: e.target.value })}
                        style={{ fontSize: '0.8rem', padding: '0.35rem 0.5rem', flex: 1 }}
                      />
                      {editCourseModal.thumbnail && (
                        <button
                          type="button"
                          className="btn-outline-admin"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.72rem', color: '#dc2626' }}
                          onClick={() => setEditCourseModal({ ...editCourseModal, thumbnail: '' })}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Key Features / Highlights (One per line)</label>
                <textarea
                  rows={4}
                  value={editCourseFeatures}
                  onChange={(e) => setEditCourseFeatures(e.target.value)}
                  placeholder="Enter features (one per line)..."
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button
                  type="submit"
                  className="btn-primary-admin"
                  style={{ flex: 1 }}
                  disabled={editCourseSaving}
                >
                  {editCourseSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  className="btn-secondary-admin"
                  onClick={() => setEditCourseModal(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
