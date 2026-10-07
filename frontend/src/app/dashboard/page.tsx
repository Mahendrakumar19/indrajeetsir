'use client';

import { useState, useEffect } from 'react';
import { API_URL, getStudentSession, clearStudentSession, StudentUser } from '@/lib/api';
import './dashboard.css';

export default function StudentDashboard() {
  const [student, setStudent] = useState<StudentUser>({
    id: 'st-1',
    name: 'Rahul Kumar',
    email: 'rahul@gmail.com',
    attempt: '2027',
  });
  const [classes, setClasses] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [msgText, setMsgText] = useState('');
  const [tab, setTab] = useState<'classes' | 'chat'>('classes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStudentSession();
    if (session) {
      setStudent(session);
    }

    fetch(`${API_URL}/live-classes`)
      .then(r => r.json())
      .then(d => {
        setClasses(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch(`${API_URL}/messages`)
      .then(r => r.json())
      .then(d => setMessages(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    clearStudentSession();
    window.location.href = '/login';
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgText.trim()) return;
    try {
      const res = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentName: student.name, text: msgText, sender: 'student' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
        setMsgText('');
      }
    } catch {
      const demo = {
        id: `m-${Date.now()}`,
        studentName: student.name,
        text: msgText,
        sender: 'student',
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, demo]);
      setMsgText('');
    }
  };

  return (
    <div className="dash">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-logo">
          <span className="dash-flag">🇮🇳</span>
          <div>
            <div className="dash-app-name">Indrajeet Sir</div>
            <div className="dash-app-sub">Student Dashboard</div>
          </div>
        </div>

        <nav className="dash-nav">
          <button className={tab === 'classes' ? 'dash-nav-btn active' : 'dash-nav-btn'} onClick={() => setTab('classes')}>
            📹 Live Classes
          </button>
          <button className={tab === 'chat' ? 'dash-nav-btn active' : 'dash-nav-btn'} onClick={() => setTab('chat')}>
            💬 Chat with Mentor
          </button>
        </nav>

        <div className="dash-user">
          <div className="dash-user-name">{student.name}</div>
          <div className="dash-user-info">UPSC CSE {student.attempt || 'Aspirant'}</div>
          <button onClick={handleLogout} className="dash-logout" style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {/* ── Live Classes Tab ── */}
        {tab === 'classes' && (
          <div>
            <div className="dash-header">
              <h1>Your Scheduled Live Classes</h1>
              <p>Click "Join Class" to enter your scheduled 1:1 mentorship session with Indrajeet Sir.</p>
            </div>

            {(() => {
              const filteredClasses = (Array.isArray(classes) ? classes : []).filter(cls =>
                !cls.assignedStudent ||
                cls.assignedStudent === 'All Students' ||
                cls.assignedStudent.toLowerCase() === (student.name || '').toLowerCase()
              );

              if (loading) {
                return <div className="dash-empty">Loading scheduled live classes...</div>;
              }
              if (filteredClasses.length === 0) {
                return (
                  <div className="dash-empty">
                    <div className="empty-icon">📅</div>
                    <p>No classes scheduled right now. Indrajeet Sir will assign your session link shortly.</p>
                  </div>
                );
              }
              return (
                <div className="class-list">
                  {filteredClasses.map(cls => (
                    <div key={cls.id} className="class-card">
                      <div className="class-card-left">
                        <div className="class-title">{cls.title}</div>
                        <div className="class-meta">
                          <span>📅 {cls.date ? new Date(cls.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'Today'}</span>
                          <span>🕐 {cls.time}</span>
                          <span>{cls.assignedStudent && cls.assignedStudent !== 'All Students' ? '👤 1:1 Personal Session' : '🌐 Batch Session'}</span>
                        </div>
                      </div>
                      <a
                        href={cls.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`join-btn ${cls.status === 'LIVE' ? 'join-live' : ''}`}
                      >
                        {cls.status === 'LIVE' ? '🔴 Join Live' : 'Join Class ↗'}
                      </a>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* ── Chat Tab ── */}
        {tab === 'chat' && (
          <div className="chat-wrap">
            <div className="dash-header">
              <h1>Chat with Indrajeet Sir</h1>
              <p>Send your doubts or strategy queries. Indrajeet Sir will reply directly.</p>
            </div>

            <div className="chat-box">
              <div className="chat-messages">
                {(Array.isArray(messages) ? messages : []).length === 0 && (
                  <div className="dash-empty">No messages yet. Ask your first question below!</div>
                )}
                {(Array.isArray(messages) ? messages : []).map(m => (
                  <div key={m.id} className={`chat-msg ${m.sender === 'admin' ? 'msg-admin' : 'msg-student'}`}>
                    <div className="msg-name">{m.sender === 'admin' ? 'Indrajeet Sir' : student.name}</div>
                    <div className="msg-text">{m.text}</div>
                    <div className="msg-time">{m.timestamp}</div>
                  </div>
                ))}
              </div>
              <form className="chat-input" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder="Type your question or doubt..."
                  value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                />
                <button type="submit" className="send-btn">Send Message</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
