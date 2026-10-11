'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL, getStudentSession, clearStudentSession, StudentUser } from '@/lib/api';
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

export default function StudentDashboard() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentUser | null>(null);
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [msgText, setMsgText] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [tab, setTab] = useState<'classes' | 'chat'>('classes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStudentSession();
    if (!session) {
      router.push('/login');
      return;
    }
    setStudent(session);
  }, [router]);

  useEffect(() => {
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
          <div className="dash-user-name">{student?.name || 'Aspirant'}</div>
          <div className="dash-user-info">UPSC CSE {student?.attempt || 'Aspirant'}</div>
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
              <p>Click &quot;Join Class&quot; to enter your scheduled 1:1 mentorship session with Indrajeet Sir.</p>
            </div>

            {(() => {
              const studentName = (student?.name || '').toLowerCase();
              const filteredClasses = (Array.isArray(classes) ? classes : []).filter(cls =>
                !cls.assignedStudent ||
                cls.assignedStudent === 'All Students' ||
                (studentName && cls.assignedStudent.toLowerCase() === studentName)
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
                  <div className="dash-empty">No messages yet. Ask your first question or share answer sheets below!</div>
                )}
                {(Array.isArray(messages) ? messages : []).map(m => {
                  const isMe = m.sender === 'student';
                  const elapsedSec = Math.floor((Date.now() - (m.createdAtMs || Date.now())) / 1000);
                  const canEdit = isMe && elapsedSec <= 120;

                  return (
                    <div key={m.id} className={`chat-msg ${m.sender === 'admin' ? 'msg-admin' : 'msg-student'}`}>
                      <div className="msg-name">{m.sender === 'admin' ? 'Indrajeet Sir' : (student?.name || 'You')}</div>
                      
                      {/* Attached File Preview */}
                      {m.fileName && (
                        <div className="msg-file-box" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: isMe ? 'rgba(0,0,0,0.18)' : '#e2e8f0',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          marginBottom: '4px',
                          fontSize: '0.82rem',
                          fontWeight: 600
                        }}>
                          <span>📎</span>
                          <span>{m.fileName}</span>
                        </div>
                      )}

                      {editingMsgId === m.id ? (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                          <input
                            type="text"
                            value={editText}
                            onChange={e => setEditText(e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.85rem' }}
                          />
                          <button onClick={() => handleSaveEdit(m.id)} style={{ padding: '4px 8px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Save</button>
                          <button onClick={() => setEditingMsgId(null)} style={{ padding: '4px 8px', borderRadius: '6px', background: '#64748b', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>
                        </div>
                      ) : (
                        <div className="msg-text">{m.text}</div>
                      )}

                      <div className="msg-time" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {m.isEdited && <span style={{ fontStyle: 'italic', fontSize: '0.68rem' }}>(edited)</span>}
                        <span>{m.timestamp}</span>
                        {isMe && canEdit && (
                          <button
                            onClick={() => handleStartEdit(m)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#2563eb',
                              cursor: 'pointer',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              textDecoration: 'underline'
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedFileName && (
                <div style={{
                  padding: '6px 12px',
                  background: '#eff6ff',
                  borderTop: '1px solid #dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.82rem',
                  color: '#1d4ed8'
                }}>
                  <span>📎 Attached: <strong>{selectedFileName}</strong></span>
                  <button onClick={() => setSelectedFileName('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
                </div>
              )}

              <form className="chat-input" onSubmit={sendMessage}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 8px', fontSize: '1.2rem' }} title="Attach file">
                  📎
                  <input type="file" onChange={handleFileSelect} style={{ display: 'none' }} />
                </label>
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
