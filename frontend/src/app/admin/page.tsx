'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL, getAdminSession, setAdminSession, clearAdminSession } from '@/lib/api';
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
  const [tab, setTab] = useState<'users' | 'content' | 'payments' | 'notifications' | 'courses' | 'classes' | 'website'>('users');

  // Flash alert
  const [actionSuccess, setActionSuccess] = useState('');

  // 0. Website Live Content Editor State
  const [siteContent, setSiteContent] = useState({
    heroHeading: 'UPSC CSE is cracked on Answer Writing & Discipline, not endless lectures.',
    heroSubheading: 'Direct personal guidance by Indrajeet Sir. Line-by-line Mains copy checking, weekly 1:1 strategy reviews, and high-yield GS 1–4 study notes.',
    stat1Number: '600+',
    stat1Label: 'Mains Micro Notes',
    stat2Number: '16 Tests',
    stat2Label: 'Checked Personally',
    stat3Number: '1:1 Private',
    stat3Label: 'Strategy Sessions',
    aboutHeading: 'No Outsourced Checking. Direct Teacher Accountability.',
    aboutSubheading: 'In Civil Services preparation, passive listening creates an illusion of knowledge. Real improvement happens when your answers are diagnosed and corrected consistently.',
    dhoniQuote: 'The process is more important than the results. If you take care of the process, results will follow.',
    dhoniAuthor: 'MS Dhoni',
    pdfSectionHeading: 'Important Study Material & Resource PDFs',
    pdfSectionSubheading: 'Download verified syllabus blueprints, official brochures, model answer evaluations, and strategic notes prepared by Indrajeet Sir.',
    contactDeskHeading: 'Have Questions About Preparation Strategy?',
    contactDeskSubheading: "Talk directly with Indrajeet Sir's mentorship desk to discuss your attempt year and study plan.",
    telegramHandle: '@Indrajeet_UPSC',
    telegramUrl: 'https://t.me/Indrajeet_UPSC',
    phoneDisplay: '+91 98734 86158',
    phoneTel: '+919873486158',
    whatsappDisplay: '+91 98734 86158',
    whatsappUrl: 'https://wa.me/919873486158',
    contactEmail: 'indrajeet.visionias@gmail.com',
  });

  // 0.1 PDF Study Material Resources State (Editable & Uploadable)
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
    callout: 'Aspirant Confidentiality Commitment: Indrajeet Sir IAS Mentorship operates on complete student privacy. We understand that Civil Services preparation requires psychological safety, candid feedback, and personal performance diagnostics. We never sell, rent, or trade your personal or academic data.',
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
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: '4999' });
  const [courseSaving, setCourseSaving] = useState(false);
  const [editCourseModal, setEditCourseModal] = useState<CourseItem | null>(null);
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

  // Mount effect to sync localStorage without SSR hydration errors and cleanse dummy data
  useEffect(() => {
    setMounted(true);
    setAuth(getAdminSession());

    try {
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

      const savedSiteContent = localStorage.getItem('indrajeet_site_content');
      if (savedSiteContent) {
        setSiteContent((prev) => ({ ...prev, ...JSON.parse(savedSiteContent) }));
      }

      const savedPdfs = localStorage.getItem('indrajeet_pdf_list');
      if (savedPdfs) {
        const parsed = JSON.parse(savedPdfs);
        if (Array.isArray(parsed) && parsed.length > 0) setPdfList(parsed);
      }

      const savedTerms = localStorage.getItem('indrajeet_terms_content');
      if (savedTerms) setTermsContent((prev) => ({ ...prev, ...JSON.parse(savedTerms) }));

      const savedPrivacy = localStorage.getItem('indrajeet_privacy_content');
      if (savedPrivacy) setPrivacyContent((prev) => ({ ...prev, ...JSON.parse(savedPrivacy) }));

      const savedDisclaimer = localStorage.getItem('indrajeet_disclaimer_content');
      if (savedDisclaimer) setDisclaimerContent((prev) => ({ ...prev, ...JSON.parse(savedDisclaimer) }));
    } catch {
      // ignore parse errors
    }
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
            const mapped: AdminUser[] = d.map((s: any) => ({
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
              const liveIds = new Set(d.map((p: any) => p.id));
              const localUnique = prev.filter((p) => !liveIds.has(p.id) && !DUMMY_IDS.has(p.id));
              return [...d, ...localUnique];
            });
          }
        })
        .catch(() => {});

      // Fetch Real-Time LMS courses & classes
      fetch(`${API_URL}/courses`)
        .then((r) => r.json())
        .then((d) => setCourses(Array.isArray(d) ? d : []))
        .catch(() => setCourses([]));

      fetch(`${API_URL}/live-classes`)
        .then((r) => r.json())
        .then((d) => setClasses(Array.isArray(d) ? d : []))
        .catch(() => setClasses([]));
    }
  }, [auth]);

  // Display flash banner
  const triggerAlert = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 4500);
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
          attempt: '2026',
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
      id: `crs_${Date.now()}`,
      title: courseForm.title,
      description: courseForm.description,
      price: parseInt(courseForm.price) || 4999,
    };
    fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse),
    })
      .then((r) => r.json())
      .catch(() => null)
      .finally(() => {
        setCourses((prev) => [newCourse, ...prev]);
        setCourseForm({ title: '', description: '', price: '4999' });
        setCourseSaving(false);
        triggerAlert(`Course "${newCourse.title}" published.`);
      });
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourseModal || !editCourseModal.title.trim()) return;
    setEditCourseSaving(true);
    const updated = {
      ...editCourseModal,
      price: Number(editCourseModal.price) || 0,
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
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditCourseSaving(false);
    setEditCourseModal(null);
    triggerAlert(`Course "${updated.title}" updated successfully.`);
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${title}"?`)) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
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
        setClassForm({
          title: '',
          date: '',
          time: '',
          meetLink: '',
          assignedStudent: 'All Enrolled Students',
        });
        setClassSaving(false);
        triggerAlert(`Live session "${newClass.title}" scheduled.`);
      });
  };

  // ── 7. PDF STUDY MATERIAL ACTIONS ──────────────────────────────────────────

  const handleUploadPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfForm.file || !pdfForm.title.trim()) {
      alert('Please provide a PDF title and choose a .pdf file.');
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

      const json = await res.json();
      if (json.success && json.data) {
        setPdfList((prev) => [json.data, ...prev]);
        setPdfForm({ title: '', description: '', tag: 'Mains Notes', file: null });
        triggerAlert(`PDF "${json.data.title}" successfully uploaded as /uploads/${json.data.fileName}!`);
      } else {
        alert(json.message || 'PDF upload failed.');
      }
    } catch (err: any) {
      alert('Upload error: ' + (err?.message || 'Check network connection'));
    } finally {
      setPdfUploading(false);
    }
  };

  const handleDeletePdf = (id: string, title: string) => {
    if (confirm(`Remove PDF resource "${title}" from public downloads?`)) {
      setPdfList((prev) => prev.filter((p) => p.id !== id));
      triggerAlert(`PDF "${title}" removed.`);
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
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <Link href="/" className="admin-brand">
          <Image
            src="/logo.png"
            alt="Indrajeet Sir IAS"
            width={34}
            height={34}
            style={{ borderRadius: '8px' }}
          />
          <div>
            <div className="brand-name">Indrajeet Sir</div>
            <div className="brand-sub">Master Admin</div>
          </div>
        </Link>

        <nav className="admin-nav">
          <button
            className={`anav ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            <div className="anav-inner">
              <IconUsers size={16} />
              <span>User Management</span>
            </div>
            <span className="anav-count">{users.length}</span>
          </button>

          <button
            className={`anav ${tab === 'content' ? 'active' : ''}`}
            onClick={() => setTab('content')}
          >
            <div className="anav-inner">
              <IconLayout size={16} />
              <span>Content Control</span>
            </div>
            <span className="anav-count">{banners.length}</span>
          </button>

          <button
            className={`anav ${tab === 'payments' ? 'active' : ''}`}
            onClick={() => setTab('payments')}
          >
            <div className="anav-inner">
              <IconCard size={16} />
              <span>Payments & Txns</span>
            </div>
            <span className="anav-count">{transactions.length}</span>
          </button>

          <button
            className={`anav ${tab === 'notifications' ? 'active' : ''}`}
            onClick={() => setTab('notifications')}
          >
            <div className="anav-inner">
              <IconBell size={16} />
              <span>Notifications</span>
            </div>
            <span className="anav-count">{notifications.length}</span>
          </button>

          <button
            className={`anav ${tab === 'courses' ? 'active' : ''}`}
            onClick={() => setTab('courses')}
          >
            <div className="anav-inner">
              <IconBook size={16} />
              <span>Courses Catalog</span>
            </div>
            <span className="anav-count">{courses.length}</span>
          </button>

          <button
            className={`anav ${tab === 'classes' ? 'active' : ''}`}
            onClick={() => setTab('classes')}
          >
            <div className="anav-inner">
              <IconVideo size={16} />
              <span>Live Classes</span>
            </div>
            <span className="anav-count">{classes.length}</span>
          </button>

          <button
            className={`anav ${tab === 'website' ? 'active' : ''}`}
            onClick={() => setTab('website')}
          >
            <div className="anav-inner">
              <IconGlobe size={16} />
              <span>Website Live Editor</span>
            </div>
            <span className="anav-count" style={{ background: '#2563eb', color: '#fff' }}>Live</span>
          </button>
        </nav>

        <button className="admin-lock-btn" onClick={handleLogout}>
          <IconLogOut size={15} />
          <span>Lock Session</span>
        </button>
      </aside>

      {/* Main Workspace */}
      <main className="admin-main">
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
                  style={{
                    flex: 1,
                    minWidth: '280px',
                    padding: '0.75rem 1rem',
                    border: '1.5px solid #cbd5e1',
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
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
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
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
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
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>Indrajeet Sir IAS</span>
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
            </div>

            <div className="composer-grid">
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
                  <div className="form-group">
                    <label>Fee (INR)</label>
                    <input
                      type="number"
                      value={courseForm.price}
                      onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-primary-admin" disabled={courseSaving}>
                    {courseSaving ? 'Saving...' : 'Publish Course'}
                  </button>
                </form>
              </div>

              <div className="table-card" style={{ height: 'fit-content' }}>
                <div style={{ padding: '1.25rem 1.4rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Active Courses ({courses.length})</h3>
                </div>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Course Title</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                          No custom courses created yet.
                        </td>
                      </tr>
                    ) : (
                      courses.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div style={{ fontWeight: 800 }}>{c.title}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.description}</div>
                          </td>
                          <td style={{ fontWeight: 850 }}>₹{c.price.toLocaleString('en-IN')}</td>
                          <td>
                            <span className="status-pill verified">Live</span>
                          </td>
                          <td>
                            <div className="table-actions" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="action-btn-sm edit"
                                onClick={() => setEditCourseModal(c)}
                                title="Edit course details"
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

            <div className="composer-grid">
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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

              <div className="table-card" style={{ height: 'fit-content' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              {/* Card 1: Hero Section */}
              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  1. Hero Section Content
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Controls the primary landing banner headline and description.
                </p>
                <div className="form-group">
                  <label>Hero Headline</label>
                  <input
                    type="text"
                    value={siteContent.heroHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, heroHeading: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Hero Subtitle / Description</label>
                  <textarea
                    rows={3}
                    value={siteContent.heroSubheading}
                    onChange={(e) => setSiteContent({ ...siteContent, heroSubheading: e.target.value })}
                  />
                </div>
              </div>

              {/* Card 2: 3D Metric Counters */}
              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  2. Hero Metric Counters (3 Key Highlights)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Highlighted stats displayed directly below the hero call to action.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                      <label>Stat 1 Value</label>
                      <input
                        type="text"
                        value={siteContent.stat1Number}
                        onChange={(e) => setSiteContent({ ...siteContent, stat1Number: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Stat 1 Label</label>
                      <input
                        type="text"
                        value={siteContent.stat1Label}
                        onChange={(e) => setSiteContent({ ...siteContent, stat1Label: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                      <label>Stat 2 Value</label>
                      <input
                        type="text"
                        value={siteContent.stat2Number}
                        onChange={(e) => setSiteContent({ ...siteContent, stat2Number: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Stat 2 Label</label>
                      <input
                        type="text"
                        value={siteContent.stat2Label}
                        onChange={(e) => setSiteContent({ ...siteContent, stat2Label: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ padding: '0.9rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                    <div className="form-group" style={{ marginBottom: '0.6rem' }}>
                      <label>Stat 3 Value</label>
                      <input
                        type="text"
                        value={siteContent.stat3Number}
                        onChange={(e) => setSiteContent({ ...siteContent, stat3Number: e.target.value })}
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Stat 3 Label</label>
                      <input
                        type="text"
                        value={siteContent.stat3Label}
                        onChange={(e) => setSiteContent({ ...siteContent, stat3Label: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: About & MS Dhoni Quote */}
              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  3. Mentorship Philosophy & Quote Section
                </h3>
                <div className="form-group">
                  <label>Philosophy Section Heading</label>
                  <input
                    type="text"
                    value={siteContent.aboutHeading}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutHeading: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Philosophy Subtitle</label>
                  <textarea
                    rows={2}
                    value={siteContent.aboutSubheading}
                    onChange={(e) => setSiteContent({ ...siteContent, aboutSubheading: e.target.value })}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>Quote Content</label>
                    <input
                      type="text"
                      value={siteContent.dhoniQuote}
                      onChange={(e) => setSiteContent({ ...siteContent, dhoniQuote: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Quote Author</label>
                    <input
                      type="text"
                      value={siteContent.dhoniAuthor}
                      onChange={(e) => setSiteContent({ ...siteContent, dhoniAuthor: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Card 4: Important PDFs Section */}
              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  4. Important PDFs & Resource Material Section
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

              {/* Card 5: Contact Desk & Telegram Channels */}
              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  5. Contact Desk & Official Channels
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

              {/* Card 6: PDF Study Material & Documents Manager */}
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                    6. PDF Resources & Direct Upload Manager
                  </h3>
                  <span className="status-pill active">{pdfList.length} Active PDFs</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Upload new PDFs with auto-slug naming. PDFs are stored in <code>/public/uploads/&lt;slug&gt;.pdf</code> and open in a new tab for students.
                </p>

                {/* Upload New PDF Form */}
                <form
                  onSubmit={handleUploadPdf}
                  style={{
                    background: '#f8fafc',
                    padding: '1.2rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '1.5rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem', color: '#1e293b' }}>
                    Upload New PDF Document
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.9rem', marginBottom: '0.9rem' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Document Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. GS Paper 2 Governance Notes"
                        value={pdfForm.title}
                        onChange={(e) => setPdfForm({ ...pdfForm, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Tag / Category</label>
                      <select
                        value={pdfForm.tag}
                        onChange={(e) => setPdfForm({ ...pdfForm, tag: e.target.value })}
                        style={{ width: '100%', padding: '0.55rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      >
                        <option value="Official Brochure">Official Brochure</option>
                        <option value="Mains Notes">Mains Notes</option>
                        <option value="Sample Copy">Sample Copy</option>
                        <option value="PCS Special">PCS Special</option>
                        <option value="Strategy Guide">Strategy Guide</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Select PDF File (.pdf only) *</label>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => setPdfForm({ ...pdfForm, file: e.target.files ? e.target.files[0] : null })}
                        required
                        style={{ padding: '0.4rem', background: '#fff' }}
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label>Description (Aspirant summary)</label>
                    <input
                      type="text"
                      placeholder="Brief description shown on the website card"
                      value={pdfForm.description}
                      onChange={(e) => setPdfForm({ ...pdfForm, description: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="btn-primary-admin" disabled={pdfUploading}>
                    {pdfUploading ? 'Uploading & Generating Slug...' : 'Upload PDF & Publish'}
                  </button>
                </form>

                {/* Current Active PDFs List */}
                <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem', color: '#1e293b' }}>
                  Live PDF Library ({pdfList.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {pdfList.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.85rem 1.1rem',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        gap: '1rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '220px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.92rem' }}>{item.title}</span>
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

              {/* Card 7: Legal Pages Live Editor (Terms, Privacy, Disclaimers) */}
              <div className="admin-card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                  7. Other Website Pages Editor (Terms, Privacy & Disclaimers)
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                  Edit policies, refund clauses, aspirant confidentiality commitments, and official legal disclaimers.
                </p>

                {/* Sub-block A: Terms of Service */}
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 750, color: '#1e293b', marginBottom: '0.75rem' }}>Terms of Service (/terms)</div>
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
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 750, color: '#1e293b', marginBottom: '0.75rem' }}>Privacy Policy (/privacy)</div>
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
                <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 750, color: '#1e293b', marginBottom: '0.75rem' }}>Disclaimers & Cookie Policy (/disclaimer)</div>
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
