'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  timestamp: string;
  createdAtMs?: number;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
  isEdited?: boolean;
}

const AVATAR_OPTIONS = [
  { key: 'ias_officer', emoji: '👮‍♂️', label: 'IAS Officer' },
  { key: 'aspirant_male', emoji: '👨‍🎓', label: 'Aspirant (M)' },
  { key: 'aspirant_female', emoji: '👩‍🎓', label: 'Aspirant (F)' },
  { key: 'scholar', emoji: '🧑‍🏫', label: 'Scholar' },
  { key: 'bookworm', emoji: '📚', label: 'Bookworm' },
  { key: 'top_ranker', emoji: '🌟', label: 'Top Ranker' },
];

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
    avatarKey: 'ias_officer',
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Settings toggles
  const [alert10mEnabled, setAlert10mEnabled] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

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
      avatarKey: session.avatarKey || 'ias_officer',
    });

    // 2. Attach user interaction listeners to maintain active session
    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle localStorage updates to at most once every 30 seconds
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
      .then(d => setMessages(Array.isArray(d) ? d : []))
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
    const payload = {
      studentName: student?.name || 'Student',
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
        setMessages(prev => [...prev, data.message]);
        setMsgText('');
        setSelectedFileName('');
      }
    } catch {
      const demo: MessageItem = {
        id: `m-${now}`,
        studentName: student?.name || 'Student',
        text: msgText,
        sender: 'student',
        timestamp: new Date(now).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        createdAtMs: now,
        fileName: selectedFileName || undefined,
        fileType: selectedFileName ? 'Uploaded Document' : undefined,
        isEdited: false,
      };
      setMessages(prev => [...prev, demo]);
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
      avatarKey: profileForm.avatarKey,
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

  const studentName = (student?.name || '').toLowerCase();
  const filteredClasses = (Array.isArray(classes) ? classes : []).filter(cls => {
    const isMine =
      !cls.assignedStudent ||
      cls.assignedStudent === 'All Students' ||
      cls.assignedStudent === 'All Enrolled Students' ||
      (studentName && cls.assignedStudent.toLowerCase().includes(studentName));

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

  const currentAvatarEmoji =
    AVATAR_OPTIONS.find(a => a.key === (student?.avatarKey || 'ias_officer'))?.emoji || '👮‍♂️';

  return (
    <div className="dash">
      {/* ── Sidebar (Desktop) ── */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <span className="dash-flag">🇮🇳</span>
          <div>
            <div className="dash-app-name">Indrajeet Sir</div>
            <div className="dash-app-sub">Student Portal</div>
          </div>
        </div>

        <nav className="dash-nav">
          <button
            className={tab === 'overview' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('overview')}
          >
            <span className="nav-btn-icon">🏠</span> Overview
          </button>
          <button
            className={tab === 'classes' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('classes')}
          >
            <span className="nav-btn-icon">📹</span> Live Classes & Schedule
          </button>
          <button
            className={tab === 'chat' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('chat')}
          >
            <span className="nav-btn-icon">💬</span> 1:1 Mentor Chat
          </button>
          <button
            className={tab === 'profile' ? 'dash-nav-btn active' : 'dash-nav-btn'}
            onClick={() => setTab('profile')}
          >
            <span className="nav-btn-icon">👤</span> Profile & Settings
          </button>
        </nav>

        {/* User Snapshot in Sidebar */}
        <div className="dash-user">
          <div className="dash-user-row">
            <span className="dash-user-avatar-mini">{currentAvatarEmoji}</span>
            <div className="dash-user-details">
              <div className="dash-user-name">{student?.name || 'Aspirant'}</div>
              <div className="dash-user-info">UPSC CSE {student?.attempt || '2027'}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="dash-logout-btn">
            🚪 Sign Out
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
              {tab === 'overview' && `Welcome, ${student?.name ? student.name.split(' ')[0] : 'Aspirant'}`}
              {tab === 'classes' && 'Live Classroom & Masterclasses'}
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
              <span className="avatar-emoji">{currentAvatarEmoji}</span>
              <span className="avatar-label-desktop">{student?.name || 'Profile'}</span>
            </button>
          </div>
        </header>

        {profileSaveSuccess && (
          <div className="dash-alert-toast">
            ✅ Profile changes saved successfully to your cloud profile!
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 1: OVERVIEW (MATCHING APPLICATION HOME SCREEN)
            ══════════════════════════════════════════════════════ */}
        {tab === 'overview' && (
          <div className="tab-pane">
            {/* Enrolled Course Status Banner */}
            <div className="course-banner-card">
              <div className="course-banner-icon">📚</div>
              <div className="course-banner-text">
                <div className="course-banner-badge-row">
                  <span className="status-tag-green">ENROLLED COURSE</span>
                  <span className="status-tag-info">
                    {alert10mEnabled ? '• 10m Live Alerts Active' : '• Alerts Muted'}
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
                  <span>{nextUpcomingClass ? 'UPCOMING LIVE SESSION' : 'LIVE STATUS'}</span>
                </div>
                <div className="hero-session-time">
                  {nextUpcomingClass
                    ? `${nextUpcomingClass.date ? new Date(nextUpcomingClass.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'Today'} • ${nextUpcomingClass.time}`
                    : 'Awaiting Schedule'}
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
                      ? '👤 Direct 1:1 Personal Mentorship Session with Indrajeet Sir'
                      : '🌐 Batch Live Strategy & Answer Writing Session with Indrajeet Sir')
                  : 'Indrajeet Sir assigns session schedules here. You will receive an alert 10 minutes prior.'}
              </p>

              <div className="hero-session-actions">
                {nextUpcomingClass ? (
                  <a
                    href={nextUpcomingClass.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-join-hero"
                  >
                    📹 Join Live Classroom
                  </a>
                ) : (
                  <button onClick={() => setTab('classes')} className="btn-join-hero">
                    📅 View Full Classroom Schedule
                  </button>
                )}
                <button onClick={() => setTab('chat')} className="btn-secondary-hero">
                  💬 Ask Sir a Question
                </button>
              </div>
            </div>

            {/* Quick Metrics (2-Card Clean Grid matching Mobile App) */}
            <div className="metrics-grid">
              <div className="metric-tile">
                <div className="metric-icon blue">📹</div>
                <div className="metric-content">
                  <div className="metric-label">NEXT LIVE CLASS</div>
                  <div className="metric-value">{nextUpcomingClass ? nextUpcomingClass.time : 'Scheduled Soon'}</div>
                  <div className="metric-sub">{nextUpcomingClass ? 'With Indrajeet Sir' : 'Check notification tab'}</div>
                </div>
              </div>

              <div className="metric-tile">
                <div className="metric-icon orange">👤</div>
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
                <h3>TODAY&apos;S LIVE CLASSROOM SCHEDULE</h3>
                <button onClick={() => setTab('classes')} className="dash-link-action">
                  View All &rarr;
                </button>
              </div>

              {filteredClasses.length === 0 ? (
                <div className="schedule-empty-card">
                  <div className="empty-calendar-icon">📅</div>
                  <h4>No Sessions Scheduled for Today</h4>
                  <p>You will receive an alert 10 minutes before your allotted session starts.</p>
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
                              ? '1:1 ALLOTTED MENTEE'
                              : 'BATCH LIVE CLASS'}
                          </div>
                        </div>
                      </div>
                      <a
                        href={cls.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-join-small"
                      >
                        Join Class ↗
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Live Class Readiness Guidelines (Matching App) */}
            <div className="dash-section">
              <div className="dash-section-header">
                <h3>LIVE CLASS GUIDELINES</h3>
              </div>
              <div className="guidelines-card">
                <div className="guideline-item">
                  <div className="guideline-icon blue">🎧</div>
                  <div>
                    <div className="guideline-title">Audio &amp; Microphone Ready</div>
                    <div className="guideline-desc">
                      Connect earphones/mic for smooth two-way live interactive discussion with Indrajeet Sir.
                    </div>
                  </div>
                </div>
                <div className="guideline-item">
                  <div className="guideline-icon green">📶</div>
                  <div>
                    <div className="guideline-title">Stable Connection Required</div>
                    <div className="guideline-desc">
                      Ensure Wi-Fi or reliable 4G/5G connectivity for uninterrupted HD video interaction.
                    </div>
                  </div>
                </div>
                <div className="guideline-item">
                  <div className="guideline-icon orange">📝</div>
                  <div>
                    <div className="guideline-title">Keep Notebooks Ready</div>
                    <div className="guideline-desc">
                      Keep your Mains syllabus notes and query points ready for direct feedback during the session.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 2: COURSES & LIVE CLASSES SCHEDULE
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
                  👤 1:1 Personal Calls
                </button>
                <button
                  className={classFilter === 'batch' ? 'filter-pill active' : 'filter-pill'}
                  onClick={() => setClassFilter('batch')}
                >
                  🌐 Batch Masterclasses
                </button>
              </div>
              <button onClick={fetchClasses} className="btn-refresh" title="Refresh Schedule">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="dash-empty">Loading classroom schedule...</div>
            ) : filteredClasses.length === 0 ? (
              <div className="dash-empty">
                <div className="empty-icon">📅</div>
                <h3>No classes scheduled right now</h3>
                <p>Indrajeet Sir will assign your personal session link shortly.</p>
              </div>
            ) : (
              <div className="class-cards-stack">
                {filteredClasses.map(cls => (
                  <div key={cls.id} className="class-card">
                    <div className="class-card-left">
                      <div className="class-title">{cls.title}</div>
                      <div className="class-meta">
                        <span>📅 {cls.date ? new Date(cls.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Today'}</span>
                        <span>🕐 {cls.time}</span>
                        <span>{cls.assignedStudent && !cls.assignedStudent.toLowerCase().includes('all') ? '👤 1:1 Personal Session' : '🌐 Batch Session'}</span>
                      </div>
                    </div>
                    <a
                      href={cls.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`join-btn ${cls.status === 'LIVE' ? 'join-live' : ''}`}
                    >
                      {cls.status === 'LIVE' ? '🔴 Join Live' : 'Join Classroom ↗'}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TAB 3: 1:1 MENTORSHIP CHAT WITH INDRAJEET SIR
            ══════════════════════════════════════════════════════ */}
        {tab === 'chat' && (
          <div className="tab-pane chat-wrap">
            <div className="chat-box">
              {/* Chat Sub-header */}
              <div className="chat-header-bar">
                <div className="chat-teacher-info">
                  <div className="chat-avatar">IS</div>
                  <div>
                    <div className="chat-teacher-name">
                      Indrajeet Sir <span className="verified-check">✓</span>
                    </div>
                    <div className="chat-teacher-status">Personal UPSC Mentor • Active Online</div>
                  </div>
                </div>
                <button onClick={fetchMessages} className="btn-refresh-small" title="Check new messages">
                  🔄
                </button>
              </div>

              {/* Chat Message Stream */}
              <div className="chat-messages">
                {messages.length === 0 && (
                  <div className="dash-empty">
                    No messages yet. Ask your first query or upload an answer sheet below!
                  </div>
                )}
                {messages.map(m => {
                  const isMe = m.sender === 'student';
                  const elapsedSec = Math.floor((Date.now() - (m.createdAtMs || Date.now())) / 1000);
                  const canEdit = isMe && elapsedSec <= 120;

                  return (
                    <div key={m.id} className={`chat-msg ${isMe ? 'msg-student' : 'msg-admin'}`}>
                      <div className="msg-name">{isMe ? (student?.name || 'You') : 'Indrajeet Sir'}</div>

                      {/* File attachment preview */}
                      {m.fileName && (
                        <div className="msg-file-box">
                          <span>📎</span>
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

                      <div className="msg-time">
                        {m.isEdited && <span className="edited-tag">(edited)</span>}
                        <span>{m.timestamp}</span>
                        {canEdit && (
                          <button onClick={() => handleStartEdit(m)} className="btn-edit-link">
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected File Banner */}
              {selectedFileName && (
                <div className="chat-attached-banner">
                  <span>📎 Selected Document: <strong>{selectedFileName}</strong></span>
                  <button onClick={() => setSelectedFileName('')} className="btn-remove-attachment">✕</button>
                </div>
              )}

              {/* Chat Input Bar */}
              <form className="chat-input" onSubmit={sendMessage}>
                <label className="chat-attach-btn" title="Attach Answer PDF or Image">
                  📎
                  <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
                <input
                  type="text"
                  placeholder="Type your UPSC query or doubt for Indrajeet Sir..."
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
            TAB 4: STUDENT PROFILE & SETTINGS (MATCHING MOBILE APP)
            ══════════════════════════════════════════════════════ */}
        {tab === 'profile' && (
          <div className="tab-pane">
            {/* Profile Overview Card */}
            <div className="profile-hero-card">
              <div className="profile-hero-top">
                <div className="profile-large-avatar">{currentAvatarEmoji}</div>
                <div className="profile-hero-info">
                  <h2>{student?.name || 'Aspirant'}</h2>
                  <div className="profile-hero-email">{student?.email}</div>
                  <div className="profile-hero-badges">
                    <span className="profile-badge">Target CSE {student?.attempt || '2027'}</span>
                    <span className="profile-badge-opt">Optional: {student?.optionalSubject || 'Public Administration'}</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="btn-edit-profile"
                >
                  {isEditingProfile ? '✕ Cancel Editing' : '✏️ Edit Profile'}
                </button>
              </div>

              {student?.bio && (
                <div className="profile-bio-box">
                  <strong>Directive:</strong> {student.bio}
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
                    <label>Aspirant Bio / Study Directive</label>
                    <textarea
                      rows={2}
                      value={profileForm.bio}
                      onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="e.g. Targeting Rank in CSE 2027 • Focusing on Mains GS-2 & GS-3 Answer Writing"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Choose Aspirant Avatar</label>
                    <div className="avatar-selector-grid">
                      {AVATAR_OPTIONS.map(opt => (
                        <button
                          key={opt.key}
                          type="button"
                          className={`avatar-option-btn ${profileForm.avatarKey === opt.key ? 'selected' : ''}`}
                          onClick={() => setProfileForm({ ...profileForm, avatarKey: opt.key })}
                        >
                          <span className="avatar-opt-emoji">{opt.emoji}</span>
                          <span className="avatar-opt-label">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save-profile">
                    💾 Save Changes
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
                    Show upcoming classroom countdown and join button 10 minutes prior to session start.
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
                  <div className="setting-title">WhatsApp Session Reminders</div>
                  <div className="setting-desc">
                    Receive session joining links directly on your registered WhatsApp number ({student?.phone || 'Configured'}).
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={e => setWhatsappAlerts(e.target.checked)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>

            {/* Academy Mentor Help Desk Card */}
            <div className="helpdesk-card">
              <h3>Direct Mentorship Desk</h3>
              <p>For urgent scheduling conflicts, 1:1 call rescheduling, or submission assistance:</p>
              <div className="helpdesk-actions">
                <a
                  href="https://wa.me/919873486158"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-help-whatsapp"
                >
                  💬 WhatsApp Indrajeet Sir&apos;s Desk
                </a>
                <a
                  href="mailto:indrajeet.visionias@gmail.com"
                  className="btn-help-email"
                >
                  ✉️ Email Desk
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

      {/* ── Mobile Floating Tab Bar (Matching iOS App Dock) ── */}
      <nav className="mobile-dock-nav">
        <button
          className={tab === 'overview' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('overview')}
        >
          <span className="dock-icon">🏠</span>
          <span className="dock-label">Overview</span>
        </button>
        <button
          className={tab === 'classes' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('classes')}
        >
          <span className="dock-icon">📹</span>
          <span className="dock-label">Courses</span>
        </button>
        <button
          className={tab === 'chat' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('chat')}
        >
          <span className="dock-icon">💬</span>
          <span className="dock-label">Mentorship</span>
        </button>
        <button
          className={tab === 'profile' ? 'mobile-dock-item active' : 'mobile-dock-item'}
          onClick={() => setTab('profile')}
        >
          <span className="dock-icon">👤</span>
          <span className="dock-label">Settings</span>
        </button>
      </nav>
    </div>
  );
}
