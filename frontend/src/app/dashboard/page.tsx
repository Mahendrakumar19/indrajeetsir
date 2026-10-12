'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  API_URL,
  getStudentSession,
  setStudentSession,
  clearStudentSession,
  touchStudentActivity,
  StudentUser,
} from '@/lib/api';
import './dashboard.css';

// ── Minimalist SVG Vector Icons (Zero Emojis) ───────────────────────────────

function IconHome({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconVideo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
}

function IconMessageSquare({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconUser({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconLogOut({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}

function IconBookOpen({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function IconCalendar({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function IconClock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconUsers({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconHeadphones({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>
  );
}

function IconWifi({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h.01" />
      <path d="M2 8.82a15 15 0 0 1 20 0" />
      <path d="M5 12.859a10 10 0 0 1 14 0" />
      <path d="M8.5 16.429a5 5 0 0 1 7 0" />
    </svg>
  );
}

function IconFileText({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function IconPaperclip({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function IconRefresh({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function IconArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconShieldCheck({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

interface LiveClassItem {
  id: string;
  title: string;
  date: string;
  time: string;
  meetLink: string;
  assignedStudent?: string;
  status?: string;
}

interface MessageItem {
  id: string;
  studentName: string;
  text: string;
  sender: 'student' | 'admin';
  timestamp?: string;
  date?: string;
  time?: string;
  createdAtIso?: string;
  createdAtMs?: number;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  isEdited?: boolean;
}

function formatChatDate(msg: MessageItem): string {
  if (msg.date) return msg.date;
  const ms = msg.createdAtMs || (msg.createdAtIso ? new Date(msg.createdAtIso).getTime() : null);
  if (ms) {
    const d = new Date(ms);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today';
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  if (msg.timestamp && msg.timestamp.includes(',')) {
    return msg.timestamp.split(',')[0].trim();
  }
  return 'Previous Discussion';
}

function formatChatTime(msg: MessageItem): string {
  if (msg.time) return msg.time;
  const ms = msg.createdAtMs || (msg.createdAtIso ? new Date(msg.createdAtIso).getTime() : null);
  if (ms) {
    return new Date(ms).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  if (msg.timestamp) {
    if (msg.timestamp.includes(',')) {
      return msg.timestamp.split(',')[1].trim();
    }
    return msg.timestamp;
  }
  return '';
}

function formatDisplayName(name?: string, email?: string): string {
  if (name && name.trim()) {
    // If name contains dot like "rahul.kumar", format as "Rahul Kumar"
    if (name.includes('.')) {
      return name
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ');
    }
    return name;
  }
  if (email && email.trim()) {
    const prefix = email.split('@')[0];
    return prefix
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
  return 'Aspirant';
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [msgText, setMsgText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [tab, setTab] = useState<'overview' | 'classes' | 'chat' | 'profile'>('overview');
  const [loading, setLoading] = useState(true);
  const [classFilter, setClassFilter] = useState<'all' | 'personal' | 'batch'>('all');

  // Edit Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    attempt: '2027',
    optionalSubject: '',
    bio: '',
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Settings toggles
  const [alert10mEnabled, setAlert10mEnabled] = useState(true);
  const [pushAlertsEnabled, setPushAlertsEnabled] = useState(true);

  // Throttled activity tracker for 7-day inactivity sliding session
  const lastTouchRef = useRef<number>(Date.now());

  useEffect(() => {
    // 1. Initial 7-day inactivity check on page mount
    const session = getStudentSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setStudent(session);
    setProfileForm({
      name: session.name || '',
      email: session.email || '',
      phone: session.phone || '',
      attempt: session.attempt || '2027',
      optionalSubject: session.optionalSubject || '',
      bio: session.bio || '',
    });

    // 2. Attach user interaction listeners to maintain active session
    const handleUserActivity = () => {
      const now = Date.now();
      if (now - lastTouchRef.current > 30000) {
        lastTouchRef.current = now;
        touchStudentActivity();
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [router]);

  useEffect(() => {
    try {
      const cached = localStorage.getItem('indrajeet_student_chat_history');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {}

    fetchClasses();
    fetchMessages();
  }, []);

  const fetchClasses = () => {
    setLoading(true);
    fetch(`${API_URL}/live-classes`)
      .then(r => r.json())
      .then(d => {
        setClasses(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchMessages = () => {
    fetch(`${API_URL}/messages`)
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) {
          setMessages(d);
          try {
            localStorage.setItem('indrajeet_student_chat_history', JSON.stringify(d));
          } catch {}
        }
      })
      .catch(() => {});
  };

  const handleLogout = () => {
    clearStudentSession();
    router.push('/login');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() && !selectedFileName) return;
    const now = Date.now();
    const d = new Date(now);
    const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const displayName = formatDisplayName(student?.name, student?.email);
    const payload = {
      studentName: displayName,
      text: msgText,
      sender: 'student' as const,
      fileName: selectedFileName || undefined,
      fileType: selectedFileName ? 'Uploaded Document' : undefined,
    };

    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.message) {
        setMessages(prev => {
          const updated = [...prev, data.message];
          try {
            localStorage.setItem('indrajeet_student_chat_history', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        setMsgText('');
        setSelectedFileName('');
      }
    } catch {
      const fallbackMsg: MessageItem = {
        id: `m-${now}`,
        studentName: displayName,
        text: msgText,
        sender: 'student',
        date: dateStr,
        time: timeStr,
        timestamp: `${dateStr}, ${timeStr}`,
        createdAtMs: now,
        createdAtIso: d.toISOString(),
        fileName: selectedFileName || undefined,
        fileType: selectedFileName ? 'Uploaded Document' : undefined,
        isEdited: false,
      };
      setMessages(prev => {
        const updated = [...prev, fallbackMsg];
        try {
          localStorage.setItem('indrajeet_student_chat_history', JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setMsgText('');
      setSelectedFileName('');
    }
  };

  const handleStartEdit = (msg: MessageItem) => {
    const elapsedSec = Math.floor((Date.now() - (msg.createdAtMs || Date.now())) / 1000);
    if (elapsedSec > 120) {
      alert('The 2-minute edit window for this message has expired.');
      return;
    }
    setEditingMsgId(msg.id);
    setEditText(msg.text);
  };

  const handleSaveEdit = async (msgId: string) => {
    try {
      await fetch(`${API_URL}/messages/${msgId}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });
    } catch {}

    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, text: editText, isEdited: true } : m))
    );
    setEditingMsgId(null);
    setEditText('');
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student) return;

    const updatedStudent: StudentUser = {
      ...student,
      name: profileForm.name.trim() || student.name,
      email: profileForm.email.trim() || student.email,
      phone: profileForm.phone.trim(),
      attempt: profileForm.attempt,
      optionalSubject: profileForm.optionalSubject.trim(),
      bio: profileForm.bio.trim(),
    };

    setStudent(updatedStudent);
    setStudentSession(updatedStudent);

    try {
      await fetch(`${API_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedStudent),
      });
    } catch {}

    setProfileSaveSuccess(true);
    setIsEditingProfile(false);
    setTimeout(() => setProfileSaveSuccess(false), 3500);
  };

  const rawStudentName = (student?.name || '').toLowerCase();
  const displayName = formatDisplayName(student?.name, student?.email);
  const initials = getInitials(displayName);

  const filteredClasses = (Array.isArray(classes) ? classes : []).filter(cls => {
    const isMine =
      !cls.assignedStudent ||
      cls.assignedStudent === 'All Students' ||
      cls.assignedStudent === 'All Enrolled Students' ||
      (rawStudentName && cls.assignedStudent.toLowerCase().includes(rawStudentName));

    if (!isMine) return false;

    if (classFilter === 'personal') {
      return cls.assignedStudent && !cls.assignedStudent.toLowerCase().includes('all');
    }
    if (classFilter === 'batch') {
      return !cls.assignedStudent || cls.assignedStudent.toLowerCase().includes('all');
    }
    return true;
  });

  const nextUpcomingClass = filteredClasses.length > 0 ? filteredClasses[0] : null;

  return (
    <div className="dash">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="dash-sidebar">
        <Link href="/" className="dash-logo">
          <Image
            src="/logo-circle.png"
            alt="Indrajeet Sir Official Logo"
            width={38}
            height={38}
            className="dash-logo-img"
            priority
          />
          <div>
            <div className="dash-app-name">Indrajeet Sir</div>
            <div className="dash-app-sub">Student Portal</div>
          </div>
        </Link>

        <nav className="dash-nav">
          <button
            className={tab === 'overview' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('overview')}
          >
            <span className="nav-btn-icon"><IconHome /></span>
            <span>Overview</span>
          </button>
          <button
            className={tab === 'classes' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('classes')}
          >
            <span className="nav-btn-icon"><IconVideo /></span>
            <span>Live Classes</span>
          </button>
          <button
            className={tab === 'chat' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('chat')}
          >
            <span className="nav-btn-icon"><IconMessageSquare /></span>
            <span>Mentor Chat</span>
          </button>
          <button
            className={tab === 'profile' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('profile')}
          >
            <span className="nav-btn-icon"><IconUser /></span>
            <span>Profile &amp; Settings</span>
          </button>
        </nav>

        {/* User Snapshot in Sidebar */}
        <div className="dash-user">
          <div className="dash-user-row">
            <div className="dash-user-avatar-initials">{initials}</div>
            <div className="dash-user-details">
              <div className="dash-user-name">{displayName}</div>
              <div className="dash-user-info">UPSC CSE {student?.attempt || '2027'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="dash-logout-btn">
            <IconLogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <main className="dash-main">
        {/* Top Header Bar */}
        <header className="dash-top-bar">
          <div>
            <div className="dash-sub-title">UPSC CSE {student?.attempt?.toUpperCase() || '2027'} ASPIRANT</div>
            <h1 className="dash-main-title">
              {tab === 'overview' && `Welcome, ${displayName}`}
              {tab === 'classes' && 'Live Classes & Classroom Schedule'}
              {tab === 'chat' && 'Direct Mentorship Chat with Indrajeet Sir'}
              {tab === 'profile' && 'Student Profile & Preferences'}
            </h1>
          </div>
          <div className="dash-top-actions">
            <button
              onClick={() => setTab('profile')}
              className="dash-avatar-btn"
              title="View Student Profile"
            >
              <span className="avatar-circle-top">{initials}</span>
              <span className="avatar-label-desktop">{displayName}</span>
            </button>
          </div>
        </header>

        {profileSaveSuccess && (
          <div className="dash-alert-toast">
            <IconCheck size={16} />
            <span>Profile details saved successfully!</span>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 1: OVERVIEW (CLEAN EXECUTIVE REDESIGN)
            ══════════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className="tab-pane">
            {/* Enrolled Course Status Banner */}
            <div className="course-banner-card">
              <div className="course-banner-icon">
                <IconBookOpen size={22} />
              </div>
              <div className="course-banner-text">
                <div className="course-banner-badge-row">
                  <span className="status-tag-green">ENROLLED COURSE</span>
                  <span className="status-tag-info">
                    {alert10mEnabled ? '• 10m Pre-Class Alerts Active' : '• Alerts Muted'}
                  </span>
                </div>
                <div className="course-banner-title">
                  {student?.enrolledCourse || '1:1 Comprehensive UPSC Mentorship 2026-27'}
                </div>
              </div>
            </div>

            {/* Upcoming Live Session Hero Card */}
            <div className="hero-session-card">
              <div className="hero-session-header">
                <div className="hero-live-badge">
                  <span className="pulse-dot"></span>
                  <span>{nextUpcomingClass ? 'UPCOMING LIVE SESSION' : 'LIVE CLASSROOM STATUS'}</span>
                </div>
                <div className="hero-session-time">
                  {nextUpcomingClass
                    ? `${nextUpcomingClass.date ? new Date(nextUpcomingClass.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Today'} • ${nextUpcomingClass.time}`
                    : 'Awaiting Next Schedule'}
                </div>
              </div>

              <h2 className="hero-session-title">
                {nextUpcomingClass
                  ? nextUpcomingClass.title
                  : 'No Live Sessions Scheduled Right Now'}
              </h2>
              <p className="hero-session-desc">
                {nextUpcomingClass
                  ? (nextUpcomingClass.assignedStudent && !nextUpcomingClass.assignedStudent.toLowerCase().includes('all')
                      ? 'Personal 1:1 Strategy & Evaluation Call with Indrajeet Sir'
                      : 'Batch Live Strategy & Answer Writing Session with Indrajeet Sir')
                  : 'Your mentorship sessions are scheduled directly by Indrajeet Sir. You will receive an alert before the class starts.'}
              </p>

              <div className="hero-session-actions">
                {nextUpcomingClass ? (
                  <a
                    href={nextUpcomingClass.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-join-hero"
                  >
                    <IconVideo size={16} />
                    <span>Join Live Classroom</span>
                  </a>
                ) : (
                  <button onClick={() => setTab('classes')} className="btn-join-hero">
                    <IconCalendar size={16} />
                    <span>View Classroom Schedule</span>
                  </button>
                )}
                <button onClick={() => setTab('chat')} className="btn-secondary-hero">
                  <IconMessageSquare size={16} />
                  <span>Ask Sir a Question</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="metrics-grid">
              <div className="metric-tile">
                <div className="metric-icon blue">
                  <IconClock size={20} />
                </div>
                <div className="metric-content">
                  <div className="metric-label">NEXT LIVE CLASS</div>
                  <div className="metric-value">{nextUpcomingClass ? nextUpcomingClass.time : 'Scheduled Soon'}</div>
                  <div className="metric-sub">{nextUpcomingClass ? 'With Indrajeet Sir' : 'Check notifications tab'}</div>
                </div>
              </div>

              <div className="metric-tile">
                <div className="metric-icon orange">
                  <IconUsers size={20} />
                </div>
                <div className="metric-content">
                  <div className="metric-label">SESSION FORMAT</div>
                  <div className="metric-value">1:1 Ready</div>
                  <div className="metric-sub">Personal Allotted Mentee</div>
                </div>
              </div>
            </div>

            {/* Today's Live Classroom Schedule */}
            <div className="dash-section">
              <div className="dash-section-header">
                <h3>TODAY&apos;S CLASSROOM SCHEDULE</h3>
                <button onClick={() => setTab('classes')} className="dash-link-action">
                  <span>View All</span>
                  <IconArrowRight size={14} />
                </button>
              </div>

              {filteredClasses.length === 0 ? (
                <div className="schedule-empty-card">
                  <div className="empty-vector-wrap">
                    <IconCalendar size={28} />
                  </div>
                  <h4>No Sessions Scheduled for Today</h4>
                  <p>You will receive an alert before your allotted live class begins.</p>
                </div>
              ) : (
                <div className="schedule-list">
                  {filteredClasses.slice(0, 3).map(cls => (
                    <div key={cls.id} className="schedule-row-card">
                      <div className="schedule-left">
                        <div className="schedule-time">{cls.time}</div>
                        <div>
                          <div className="schedule-title">{cls.title}</div>
                          <div className="schedule-meta-tag">
                            {cls.assignedStudent && !cls.assignedStudent.toLowerCase().includes('all')
                              ? '1:1 PERSONAL SESSION'
                              : 'BATCH MASTERCLASS'}
                          </div>
                        </div>
                      </div>
                      <a
                        href={cls.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-join-small"
                      >
                        Join Class
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Class Readiness Guidelines */}
            <div className="dash-section">
              <div className="dash-section-header">
                <h3>LIVE CLASS PREPARATION GUIDELINES</h3>
              </div>
              <div className="guidelines-card">
                <div className="guideline-item">
                  <div className="guideline-icon blue">
                    <IconHeadphones size={18} />
                  </div>
                  <div>
                    <div className="guideline-title">Audio &amp; Microphone Check</div>
                    <div className="guideline-desc">
                      Connect headphones with microphone for crisp, two-way interactive feedback with Indrajeet Sir.
                    </div>
                  </div>
                </div>
                <div className="guideline-item">
                  <div className="guideline-icon green">
                    <IconWifi size={18} />
                  </div>
                  <div>
                    <div className="guideline-title">Reliable Connection</div>
                    <div className="guideline-desc">
                      Ensure stable Wi-Fi or high-speed mobile internet for high-definition video evaluation.
                    </div>
                  </div>
                </div>
                <div className="guideline-item">
                  <div className="guideline-icon orange">
                    <IconFileText size={18} />
                  </div>
                  <div>
                    <div className="guideline-title">Notebooks &amp; Drafts Ready</div>
                    <div className="guideline-desc">
                      Keep your Mains syllabus notes and query points handy for direct diagnosis during the session.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2: LIVE CLASSES & SCHEDULE
            ══════════════════════════════════════════════════════ */}
        {tab === 'classes' && (
          <div className="tab-pane">
            <div className="classes-toolbar">
              <div className="filter-pills">
                <button
                  className={classFilter === 'all' ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setClassFilter('all')}
                >
                  All Scheduled Sessions
                </button>
                <button
                  className={classFilter === 'personal' ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setClassFilter('personal')}
                >
                  1:1 Personal Calls
                </button>
                <button
                  className={classFilter === 'batch' ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setClassFilter('batch')}
                >
                  Batch Masterclasses
                </button>
              </div>
              <button onClick={fetchClasses} className="btn-refresh" title="Refresh Schedule">
                <IconRefresh size={14} />
                <span>Refresh</span>
              </button>
            </div>

            {loading ? (
              <div className="dash-empty">Loading classroom schedule...</div>
            ) : filteredClasses.length === 0 ? (
              <div className="dash-empty">
                <div className="empty-vector-wrap">
                  <IconCalendar size={32} />
                </div>
                <h3>No classes scheduled right now</h3>
                <p>Indrajeet Sir will allocate your upcoming session timing shortly.</p>
              </div>
            ) : (
              <div className="class-cards-stack">
                {filteredClasses.map(cls => (
                  <div key={cls.id} className="class-card">
                    <div className="class-card-left">
                      <div className="class-title">{cls.title}</div>
                      <div className="class-meta">
                        <span>{cls.date ? new Date(cls.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Today'}</span>
                        <span>•</span>
                        <span>{cls.time}</span>
                        <span>•</span>
                        <span>{cls.assignedStudent && !cls.assignedStudent.toLowerCase().includes('all') ? '1:1 Personal Session' : 'Batch Session'}</span>
                      </div>
                    </div>
                    <a
                      href={cls.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`join-btn ${cls.status === 'LIVE' ? 'join-live' : ''}`}
                    >
                      {cls.status === 'LIVE' ? 'Join Live Now' : 'Join Classroom'}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3: 1:1 MENTORSHIP CHAT
            ══════════════════════════════════════════════════════ */}
        {tab === 'chat' && (
          <div className="tab-pane chat-wrap">
            <div className="chat-box">
              {/* Chat Sub-header */}
              <div className="chat-header-bar">
                <div className="chat-teacher-info">
                  <Image
                    src="/logo-circle.png"
                    alt="Indrajeet Sir"
                    width={38}
                    height={38}
                    className="chat-teacher-avatar"
                  />
                  <div>
                    <div className="chat-teacher-name">
                      Indrajeet Sir
                      <span className="verified-pill">
                        <IconCheck size={10} /> Verified Mentor
                      </span>
                    </div>
                    <div className="chat-teacher-status">Personal 1:1 Mentorship Channel</div>
                  </div>
                </div>
                <button onClick={fetchMessages} className="btn-refresh-small" title="Check new messages">
                  <IconRefresh size={15} />
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="dash-empty">
                    <p>No messages yet. Send your preparation doubt or share your answer copy below.</p>
                  </div>
                )}
                {messages.map((m, index) => {
                  const isMe = m.sender === 'student';
                  const elapsedSec = Math.floor((Date.now() - (m.createdAtMs || Date.now())) / 1000);
                  const canEdit = isMe && elapsedSec <= 120;
                  const dateLabel = formatChatDate(m);
                  const prevDateLabel = index > 0 ? formatChatDate(messages[index - 1]) : null;
                  const showDateDivider = index === 0 || dateLabel !== prevDateLabel;
                  const timeDisplay = formatChatTime(m);
                  const fullDateTimeTitle = `${dateLabel} • ${timeDisplay}`;

                  return (
                    <div key={m.id} className="chat-msg-row">
                      {showDateDivider && (
                        <div className="chat-date-divider">
                          <span>{dateLabel}</span>
                        </div>
                      )}
                      <div className={`chat-msg ${isMe ? 'msg-student' : 'msg-admin'}`}>
                        <div className="msg-name">{isMe ? displayName : 'Indrajeet Sir'}</div>

                        {/* File attachment preview */}
                        {m.fileName && (
                          <div className="msg-file-box">
                            <IconPaperclip size={14} />
                            <span>{m.fileName}</span>
                          </div>
                        )}

                        {editingMsgId === m.id ? (
                          <div className="msg-edit-box">
                            <input
                              type="text"
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              className="edit-input"
                            />
                            <button onClick={() => handleSaveEdit(m.id)} className="btn-save-edit">Save</button>
                            <button onClick={() => setEditingMsgId(null)} className="btn-cancel-edit">Cancel</button>
                          </div>
                        ) : (
                          <div className="msg-text">{m.text}</div>
                        )}

                        <div className="msg-time" title={fullDateTimeTitle}>
                          {m.isEdited && <span className="edited-tag">(edited)</span>}
                          <span>{timeDisplay}</span>
                          {canEdit && (
                            <button onClick={() => handleStartEdit(m)} className="btn-edit-link">
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected File Banner */}
              {selectedFileName && (
                <div className="chat-attached-banner">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <IconPaperclip size={14} />
                    <span>Selected Document: <strong>{selectedFileName}</strong></span>
                  </div>
                  <button onClick={() => setSelectedFileName('')} className="btn-remove-attachment">✕</button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form className="chat-input" onSubmit={sendMessage}>
                <label className="chat-attach-btn" title="Attach Answer PDF or Image">
                  <IconPaperclip size={18} />
                  <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
                <input
                  type="text"
                  placeholder="Type your UPSC query or strategy doubt for Indrajeet Sir..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                />
                <button type="submit" className="send-btn">
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 4: STUDENT PROFILE & SETTINGS
            ══════════════════════════════════════════════════════ */}
        {tab === 'profile' && (
          <div className="tab-pane">
            {/* Profile Overview Card */}
            <div className="profile-hero-card">
              <div className="profile-hero-top">
                <div className="profile-initials-badge">{initials}</div>
                <div className="profile-hero-info">
                  <h2>{displayName}</h2>
                  <div className="profile-hero-email">{student?.email}</div>
                  <div className="profile-hero-badges">
                    <span className="profile-badge">Target CSE {student?.attempt || '2027'}</span>
                    {student?.optionalSubject && (
                      <span className="profile-badge-opt">Optional: {student.optionalSubject}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="btn-edit-profile"
                >
                  {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {student?.bio && (
                <div className="profile-bio-box">
                  <strong>Preparation Focus:</strong> {student.bio}
                </div>
              )}
            </div>

            {/* Edit Profile Form */}
            {isEditingProfile && (
              <form className="profile-form-card" onSubmit={handleSaveProfile}>
                <h3>Edit Student Details</h3>
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone / WhatsApp Number</label>
                    <input
                      type="text"
                      placeholder="+91"
                      value={profileForm.phone}
                      onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Target UPSC Attempt Year</label>
                    <select
                      value={profileForm.attempt}
                      onChange={e => setProfileForm({ ...profileForm, attempt: e.target.value })}
                    >
                      <option value="2025">UPSC CSE 2025</option>
                      <option value="2026">UPSC CSE 2026</option>
                      <option value="2027">UPSC CSE 2027</option>
                      <option value="2028">UPSC CSE 2028</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Optional Subject</label>
                    <input
                      type="text"
                      value={profileForm.optionalSubject}
                      onChange={e => setProfileForm({ ...profileForm, optionalSubject: e.target.value })}
                      placeholder="e.g. Public Administration, PSIR, Geography, Sociology"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Personal Directive / Focus</label>
                    <textarea
                      rows={2}
                      value={profileForm.bio}
                      onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="e.g. Targeting Top Rank • Working on Mains GS-2 and GS-3 answer structure"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save-profile">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="btn-cancel-profile"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Notification & Live Alert Settings */}
            <div className="settings-card">
              <h3>Live Classroom Alert Settings</h3>
              <div className="setting-toggle-row">
                <div>
                  <div className="setting-title">10-Minute Pre-Class Alert</div>
                  <div className="setting-desc">
                    Show upcoming classroom countdown and direct link 10 minutes prior to session start.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={alert10mEnabled}
                    onChange={e => setAlert10mEnabled(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-toggle-row">
                <div>
                  <div className="setting-title">Device &amp; Browser Push Notifications</div>
                  <div className="setting-desc">
                    Receive session joining alerts and schedule updates directly on your device.
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={pushAlertsEnabled}
                    onChange={e => {
                      const enabled = e.target.checked;
                      setPushAlertsEnabled(enabled);
                      if (enabled && typeof window !== 'undefined' && 'Notification' in window) {
                        Notification.requestPermission();
                      }
                    }}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Academy Mentor Help Desk Card */}
            <div className="helpdesk-card">
              <h3>Direct Mentorship Desk</h3>
              <p>For urgent scheduling conflicts, 1:1 call rescheduling, or copy submission queries:</p>
              <div className="helpdesk-actions">
                <a
                  href="https://wa.me/919873486158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-help-whatsapp"
                >
                  WhatsApp Mentorship Desk
                </a>
                <a
                  href="mailto:indrajeet.visionias@gmail.com"
                  className="btn-help-email"
                >
                  Email Desk
                </a>
              </div>
            </div>

            {/* Sign Out Card */}
            <div className="signout-card">
              <div>
                <div className="signout-title">Session Security</div>
                <div className="signout-desc">
                  Your device stays authenticated for up to 7 days of active preparation. Inactivity over 7 days triggers automatic logout.
                </div>
              </div>
              <button onClick={handleLogout} className="btn-signout-danger">
                Sign Out from Device
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ── Mobile Dock Navigation Bar ── */}
      <nav className="mobile-dock-nav">
        <button
          className={tab === 'overview' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('overview')}
        >
          <span className="dock-icon"><IconHome size={20} /></span>
          <span className="dock-label">Overview</span>
        </button>
        <button
          className={tab === 'classes' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('classes')}
        >
          <span className="dock-icon"><IconVideo size={20} /></span>
          <span className="dock-label">Courses</span>
        </button>
        <button
          className={tab === 'chat' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('chat')}
        >
          <span className="dock-icon"><IconMessageSquare size={20} /></span>
          <span className="dock-label">Mentorship</span>
        </button>
        <button
          className={tab === 'profile' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('profile')}
        >
          <span className="dock-icon"><IconUser size={20} /></span>
          <span className="dock-label">Settings</span>
        </button>
      </nav>
    </div>
  );
}
