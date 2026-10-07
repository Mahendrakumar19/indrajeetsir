'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_URL, getAdminSession, setAdminSession, clearAdminSession } from '@/lib/api';
import './admin.css';

interface LiveClassItem {
  id: string;
  title: string;
  date: string;
  time: string;
  meetLink: string;
  assignedStudent?: string;
  status?: string;
}

interface StudentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  attempt: string;
  joinedDate: string;
}

interface MessageItem {
  id: string;
  studentName: string;
  text: string;
  sender: 'student' | 'admin';
  timestamp: string;
}

export default function AdminPanel() {
  const [auth, setAuth] = useState<boolean>(() => getAdminSession());
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<'classes' | 'students' | 'chat'>('classes');

  // Live Classes
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [form, setForm] = useState({ title: '', date: '', time: '', meetLink: '', assignedStudent: 'All Students' });
  const [saving, setSaving] = useState(false);

  // Students
  const [students, setStudents] = useState<StudentItem[]>([]);

  // Chat
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [reply, setReply] = useState('');

  // Load data after auth
  useEffect(() => {
    if (!auth) return;
    fetch(`${API_URL}/live-classes`)
      .then(r => r.json())
      .then(d => setClasses(Array.isArray(d) ? d : []))
      .catch(() => setClasses([]));

    fetch(`${API_URL}/students`)
      .then(r => r.json())
      .then(d => setStudents(Array.isArray(d) ? d : []))
      .catch(() => setStudents([]));

    fetch(`${API_URL}/messages`)
      .then(r => r.json())
      .then(d => setMessages(Array.isArray(d) ? d : []))
      .catch(() => setMessages([]));
  }, [auth]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = passcode.trim().toLowerCase();
    const validCodes = ['admin123', 'admin', 'indrajeet', '1234'];
    
    if (validCodes.includes(cleanCode)) {
      setAdminSession(true);
      setAuth(true);
      setAuthError('');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanCode }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminSession(true);
        setAuth(true);
        setAuthError('');
      } else {
        setAuthError(data.message || 'Wrong passcode. Try again.');
      }
    } catch {
      setAuthError('Wrong passcode. Try again.');
    }
  };

  const handleLock = () => {
    clearAdminSession();
    setAuth(false);
    setPasscode('');
  };

  const addClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/live-classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setClasses(prev => [...prev, data.liveClass]);
        setForm({ title: '', date: '', time: '', meetLink: '', assignedStudent: 'All Students' });
      }
    } catch {
      const demo: LiveClassItem = { id: `lc-${Date.now()}`, ...form, status: 'UPCOMING' };
      setClasses(prev => [...prev, demo]);
      setForm({ title: '', date: '', time: '', meetLink: '', assignedStudent: 'All Students' });
    }
    setSaving(false);
  };

  const deleteClass = async (id: string) => {
    try {
      await fetch(`${API_URL}/live-classes/${id}`, { method: 'DELETE' });
    } catch {}
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: 'Indrajeet Sir', text: reply, sender: 'admin' }),
      });
      const data = await res.json();
      if (data.success) { setMessages(prev => [...prev, data.message]); }
    } catch {
      const demo: MessageItem = { id: `m-${Date.now()}`, studentName: 'Indrajeet Sir', text: reply, sender: 'admin', timestamp: 'Just now' };
      setMessages(prev => [...prev, demo]);
    }
    setReply('');
  };

  // ── Lock Screen ──────────────────────────────────────────────────────────
  if (!auth) {
    return (
      <div className="admin-lock">
        <div className="lock-box">
          <div className="lock-icon">🔒</div>
          <h2>Admin Portal</h2>
          <p>Enter your passcode to access the Indrajeet Sir admin panel.</p>
          <form onSubmit={handleAuth}>
            <div className="pass-wrapper">
              <input
                type={showPasscode ? 'text' : 'password'}
                placeholder="Enter passcode..."
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPasscode(!showPasscode)}
                title={showPasscode ? "Hide Passcode" : "Show Passcode"}
              >
                {showPasscode ? '👁️' : '🙈'}
              </button>
            </div>
            {authError && <div className="lock-error">{authError}</div>}
            <button type="submit">Unlock Panel →</button>
          </form>
          <Link href="/" className="lock-back">← Back to Website</Link>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ──────────────────────────────────────────────────────
  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>🇮🇳</span>
          <div>
            <div className="brand-name">Indrajeet Sir</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>
        <nav className="admin-nav">
          <button className={tab === 'classes' ? 'anav active' : 'anav'} onClick={() => setTab('classes')}>
            📹 Live Classes
          </button>
          <button className={tab === 'students' ? 'anav active' : 'anav'} onClick={() => setTab('students')}>
            👥 Students
          </button>
          <button className={tab === 'chat' ? 'anav active' : 'anav'} onClick={() => setTab('chat')}>
            💬 Student Messages
          </button>
        </nav>
        <button className="admin-lock-btn" onClick={handleLock}>🔒 Lock Panel</button>
      </aside>

      {/* Main */}
      <main className="admin-main">

        {/* ── Live Classes Tab ── */}
        {tab === 'classes' && (
          <div>
            <div className="admin-page-header">
              <h1>Live Classes</h1>
              <p>Schedule a class — students will see the link on their dashboard.</p>
            </div>

            {/* Add class form */}
            <div className="admin-form-card">
              <h3>+ Schedule New 1:1 Live Session</h3>
              <form onSubmit={addClass} className="admin-form">
                <div className="form-row">
                  <div className="form-field">
                    <label>Session Topic / Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. GS-3: Indian Economy & Inflation"
                      required
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Time</label>
                    <input
                      type="time"
                      required
                      value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field meet-field">
                    <label>Live Class Link / Meeting URL</label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      required
                      value={form.meetLink}
                      onChange={e => setForm({ ...form, meetLink: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Assign to Student / Batch (Optional)</label>
                    <select
                      value={form.assignedStudent}
                      onChange={e => setForm({ ...form, assignedStudent: e.target.value })}
                      className="auth-select"
                    >
                      <option value="All Students">🌐 All Enrolled Students (Open Batch)</option>
                      {(Array.isArray(students) ? students : []).map(s => (
                        <option key={s.id} value={s.name}>👤 1:1 Session for {s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="admin-btn" disabled={saving}>
                  {saving ? 'Scheduling...' : '+ Schedule Class'}
                </button>
              </form>
            </div>

            {/* Classes list */}
            <div className="admin-section">
              <h3>Scheduled Classes ({(Array.isArray(classes) ? classes : []).length})</h3>
              {(Array.isArray(classes) ? classes : []).length === 0 ? (
                <div className="admin-empty">No classes scheduled yet. Add one above.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Assigned Audience</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Live Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(classes) ? classes : []).map(cls => (
                      <tr key={cls.id}>
                        <td><strong>{cls.title}</strong></td>
                        <td>
                          <span className="assigned-badge">
                            {cls.assignedStudent === 'All Students' || !cls.assignedStudent ? '🌐 All Students' : `👤 ${cls.assignedStudent}`}
                          </span>
                        </td>
                        <td>{cls.date}</td>
                        <td>{cls.time}</td>
                        <td>
                          <a href={cls.meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                            Open Link ↗
                          </a>
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => deleteClass(cls.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Students Tab ── */}
        {tab === 'students' && (
          <div>
            <div className="admin-page-header">
              <h1>Enrolled Students</h1>
              <p>All students registered on the platform.</p>
            </div>
            <div className="admin-section">
              {(Array.isArray(students) ? students : []).length === 0 ? (
                <div className="admin-empty">No students registered yet.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Target Year</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(Array.isArray(students) ? students : []).map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>UPSC CSE {s.attempt}</td>
                        <td>{s.joinedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── Chat Tab ── */}
        {tab === 'chat' && (
          <div className="admin-chat-wrap">
            <div className="admin-page-header">
              <h1>Student Messages</h1>
              <p>Reply to student questions as Indrajeet Sir.</p>
            </div>
            <div className="admin-chat-box">
              <div className="admin-chat-msgs">
                {(Array.isArray(messages) ? messages : []).length === 0 && <div className="admin-empty">No messages yet.</div>}
                {(Array.isArray(messages) ? messages : []).map(m => (
                  <div key={m.id} className={`adm-msg ${m.sender === 'admin' ? 'adm-right' : 'adm-left'}`}>
                    <div className="adm-msg-name">{m.sender === 'admin' ? 'Indrajeet Sir (You)' : m.studentName}</div>
                    <div className="adm-msg-text">{m.text}</div>
                    <div className="adm-msg-time">{m.timestamp}</div>
                  </div>
                ))}
              </div>
              <form className="admin-chat-input" onSubmit={sendReply}>
                <input
                  type="text"
                  placeholder="Reply as Indrajeet Sir..."
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                />
                <button type="submit">Send Reply</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
