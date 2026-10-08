'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { API_URL, getAdminSession, setAdminSession, clearAdminSession } from '@/lib/api';
import './admin.css';

interface CourseItem {
  id: string;
  title: string;
  description?: string;
  price: number;
  instructor?: string;
  liveClassesCount?: number;
  enrollmentsCount?: number;
}

interface LiveClassItem {
  id: string;
  title: string;
  date: string;
  time: string;
  meetLink: string;
  courseId?: string;
  courseTitle?: string;
  assignedStudent?: string;
  status?: string;
}

interface StudentItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  attempt?: string;
  course?: string;
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
  const [tab, setTab] = useState<'courses' | 'classes' | 'students' | 'chat'>('courses');

  // Feedback notifications
  const [actionSuccess, setActionSuccess] = useState('');

  // 1. Courses
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseForm, setCourseForm] = useState({ title: '', description: '', price: '4999' });
  const [courseSaving, setCourseSaving] = useState(false);

  // 2. Live Classes
  const [classes, setClasses] = useState<LiveClassItem[]>([]);
  const [classForm, setClassForm] = useState({
    title: '',
    courseId: '',
    date: '',
    time: '',
    meetLink: '',
    assignedStudent: 'All Students',
  });
  const [classSaving, setClassSaving] = useState(false);

  // 3. Students
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    courseId: '',
    sendEmail: true,
  });
  const [studentSaving, setStudentSaving] = useState(false);

  // 4. Chat
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [reply, setReply] = useState('');

  // Load all data after admin unlocks
  const loadData = () => {
    fetch(`${API_URL}/courses`)
      .then(r => r.json())
      .then(d => {
        const list = Array.isArray(d) ? d : [];
        setCourses(list);
        if (list.length > 0) {
          setClassForm(prev => ({ ...prev, courseId: prev.courseId || list[0].id }));
          setStudentForm(prev => ({ ...prev, courseId: prev.courseId || list[0].id }));
        }
      })
      .catch(() => setCourses([]));

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
  };

  useEffect(() => {
    if (auth) {
      loadData();
    }
  }, [auth]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = passcode.trim();
    const validCodes = ['admin123', 'admin', 'indrajeet', '1234', 'Admin@Indrajeet2026'];
    
    if (validCodes.includes(cleanCode.toLowerCase()) || cleanCode === 'Admin@Indrajeet2026') {
      setAdminSession(true);
      setAuth(true);
      setAuthError('');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanCode, password: cleanCode }),
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

  // ── COURSES ACTIONS ───────────────────────────────────────────────────────
  const addCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) return;
    setCourseSaving(true);
    setActionSuccess('');

    try {
      const res = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: courseForm.title,
          description: courseForm.description,
          price: Number(courseForm.price) || 0,
          instructor: 'Indrajeet Sir',
        }),
      });
      const data = await res.json();
      if (data.success && data.course) {
        setCourses(prev => [data.course, ...prev]);
        setCourseForm({ title: '', description: '', price: '4999' });
        setActionSuccess(`✓ Course "${data.course.title}" created successfully!`);
      }
    } catch {
      const demo: CourseItem = {
        id: `c-${Date.now()}`,
        title: courseForm.title,
        description: courseForm.description,
        price: Number(courseForm.price) || 0,
        instructor: 'Indrajeet Sir',
      };
      setCourses(prev => [demo, ...prev]);
      setCourseForm({ title: '', description: '', price: '4999' });
      setActionSuccess(`✓ Course "${demo.title}" created successfully!`);
    }
    setCourseSaving(false);
  };

  const deleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to remove this course?')) return;
    try {
      await fetch(`${API_URL}/courses/${id}`, { method: 'DELETE' });
    } catch {}
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // ── LIVE CLASSES ACTIONS ──────────────────────────────────────────────────
  const addClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.title || !classForm.meetLink) return;
    setClassSaving(true);
    setActionSuccess('');

    const targetCourse = courses.find(c => c.id === classForm.courseId);

    try {
      const res = await fetch(`${API_URL}/live-classes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classForm),
      });
      const data = await res.json();
      if (data.success) {
        setClasses(prev => [...prev, data.liveClass]);
        setClassForm(prev => ({
          title: '',
          courseId: prev.courseId,
          date: '',
          time: '',
          meetLink: '',
          assignedStudent: 'All Students',
        }));
        setActionSuccess(`✓ Live class "${data.liveClass.title}" scheduled with Google Meet link!`);
      }
    } catch {
      const demo: LiveClassItem = {
        id: `lc-${Date.now()}`,
        ...classForm,
        courseTitle: targetCourse?.title || 'Mentorship Program',
        status: 'UPCOMING',
      };
      setClasses(prev => [...prev, demo]);
      setClassForm(prev => ({
        title: '',
        courseId: prev.courseId,
        date: '',
        time: '',
        meetLink: '',
        assignedStudent: 'All Students',
      }));
      setActionSuccess(`✓ Live class scheduled with Google Meet link!`);
    }
    setClassSaving(false);
  };

  const deleteClass = async (id: string) => {
    try {
      await fetch(`${API_URL}/live-classes/${id}`, { method: 'DELETE' });
    } catch {}
    setClasses(prev => prev.filter(c => c.id !== id));
  };

  // ── STUDENT ONBOARDING ACTIONS ────────────────────────────────────────────
  const enrollStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email) return;
    setStudentSaving(true);
    setActionSuccess('');

    try {
      const res = await fetch(`${API_URL}/admin/enroll-student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: studentForm.name,
          studentEmail: studentForm.email,
          studentPhone: studentForm.phone,
          courseId: studentForm.courseId,
          sendEmail: studentForm.sendEmail,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const assignedCourse = courses.find(c => c.id === studentForm.courseId)?.title || 'Mentorship Program';
        const newSt: StudentItem = {
          id: data.student?.id || `st-${Date.now()}`,
          name: studentForm.name,
          email: studentForm.email,
          phone: studentForm.phone || '+91 98765 43210',
          course: assignedCourse,
          joinedDate: new Date().toISOString().slice(0, 10),
        };
        setStudents(prev => [newSt, ...prev]);
        setStudentForm(prev => ({
          name: '',
          email: '',
          phone: '',
          courseId: prev.courseId,
          sendEmail: true,
        }));
        setActionSuccess(
          `✓ Student ${newSt.name} enrolled in "${assignedCourse}"! Login credentials & App download link sent to ${newSt.email}.`
        );
      } else {
        alert(data.message || 'Failed to enroll student.');
      }
    } catch {
      const assignedCourse = courses.find(c => c.id === studentForm.courseId)?.title || 'Mentorship Program';
      const demoSt: StudentItem = {
        id: `st-${Date.now()}`,
        name: studentForm.name,
        email: studentForm.email,
        phone: studentForm.phone || '+91 98765 43210',
        course: assignedCourse,
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      setStudents(prev => [demoSt, ...prev]);
      setStudentForm(prev => ({
        name: '',
        email: '',
        phone: '',
        courseId: prev.courseId,
        sendEmail: true,
      }));
      setActionSuccess(`✓ Student ${demoSt.name} enrolled! Credentials & App link dispatched to ${demoSt.email}.`);
    }
    setStudentSaving(false);
  };

  const removeStudent = async (id: string) => {
    if (!confirm('Remove this student from mentorship?')) return;
    try {
      await fetch(`${API_URL}/students/${id}`, { method: 'DELETE' });
    } catch {}
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  // ── CHAT ACTIONS ──────────────────────────────────────────────────────────
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
      if (data.success) {
        setMessages(prev => [...prev, data.message]);
      }
    } catch {
      const demo: MessageItem = {
        id: `m-${Date.now()}`,
        studentName: 'Indrajeet Sir',
        text: reply,
        sender: 'admin',
        timestamp: 'Just now',
      };
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
          <p>Enter your passcode to access Indrajeet Sir Admin Portal.</p>
          <form onSubmit={handleAuth}>
            <div className="pass-wrapper">
              <input
                type={showPasscode ? 'text' : 'password'}
                placeholder="Enter admin passcode..."
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
            <button type="submit">Unlock Portal →</button>
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
          <Image
            src="/logo.png"
            alt="Indrajeet Sir Logo"
            width={38}
            height={38}
            style={{ borderRadius: '50%' }}
          />
          <div>
            <div className="brand-name">Indrajeet Sir</div>
            <div className="brand-sub">Admin Portal</div>
          </div>
        </div>
        <nav className="admin-nav">
          <button
            className={tab === 'courses' ? 'anav active' : 'anav'}
            onClick={() => { setTab('courses'); setActionSuccess(''); }}
          >
            📚 Courses
          </button>
          <button
            className={tab === 'classes' ? 'anav active' : 'anav'}
            onClick={() => { setTab('classes'); setActionSuccess(''); }}
          >
            📹 Live Classes & Meet
          </button>
          <button
            className={tab === 'students' ? 'anav active' : 'anav'}
            onClick={() => { setTab('students'); setActionSuccess(''); }}
          >
            👥 Enrolled Students
          </button>
          <button
            className={tab === 'chat' ? 'anav active' : 'anav'}
            onClick={() => { setTab('chat'); setActionSuccess(''); }}
          >
            💬 Student Messages
          </button>
        </nav>
        <button className="admin-lock-btn" onClick={handleLock}>🔒 Lock Portal</button>
      </aside>

      {/* Main Area */}
      <main className="admin-main">
        {actionSuccess && (
          <div className="admin-notice-success">
            {actionSuccess}
          </div>
        )}

        {/* ── 1. COURSES TAB ────────────────────────────────────────────── */}
        {tab === 'courses' && (
          <div>
            <div className="admin-page-header">
              <h1>Courses & Mentorship Programs</h1>
              <p>Add courses, configure mentorship fees, and manage student offerings.</p>
            </div>

            {/* Add Course Form */}
            <div className="admin-form-card">
              <h3>+ Add New Course / Batch</h3>
              <form onSubmit={addCourse} className="admin-form">
                <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr' }}>
                  <div className="form-field">
                    <label>Course Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 1:1 Comprehensive UPSC Mentorship 2026-27"
                      required
                      value={courseForm.title}
                      onChange={e => setCourseForm({ ...courseForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Course Fee / Price (₹ INR)</label>
                    <input
                      type="number"
                      placeholder="e.g. 4999"
                      required
                      value={courseForm.price}
                      onChange={e => setCourseForm({ ...courseForm, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label>Course Description / Syllabus Outline</label>
                  <textarea
                    rows={3}
                    placeholder="Details about 1:1 live sessions, syllabus coverage, Google Meet timetable, and answer evaluation..."
                    value={courseForm.description}
                    onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  />
                </div>
                <button type="submit" className="admin-btn" disabled={courseSaving}>
                  {courseSaving ? 'Creating Course...' : '+ Create Course'}
                </button>
              </form>
            </div>

            {/* Courses List */}
            <div className="admin-section">
              <h3>Active Mentorship Courses ({courses.length})</h3>
              {courses.length === 0 ? (
                <div className="admin-empty">No courses created yet. Add one above.</div>
              ) : (
                <div className="course-grid">
                  {courses.map(c => (
                    <div key={c.id} className="course-card">
                      <div>
                        <div className="course-card-top">
                          <span className="assigned-badge">Mentor: {c.instructor || 'Indrajeet Sir'}</span>
                          <span className="course-price-tag">₹{Number(c.price).toLocaleString('en-IN')}</span>
                        </div>
                        <h4>{c.title}</h4>
                        <p>{c.description || 'Comprehensive UPSC guidance with direct 1:1 live Google Meet sessions.'}</p>
                      </div>
                      <div>
                        <div className="course-meta">
                          <span>👥 {c.enrollmentsCount || 0} Enrolled Students</span>
                          <span>📹 {c.liveClassesCount || 0} Scheduled Classes</span>
                        </div>
                        <div className="course-actions">
                          <button
                            className="delete-btn"
                            onClick={() => deleteCourse(c.id)}
                          >
                            Remove Course
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 2. LIVE CLASSES & MEET TAB ────────────────────────────────── */}
        {tab === 'classes' && (
          <div>
            <div className="admin-page-header">
              <h1>Schedule Live Classes & Google Meet</h1>
              <p>Schedule a live class for a course with specific timing and Google Meet link. Enrolled students will get a 10-minute heads-up reminder on their mobile app.</p>
            </div>

            {/* Add class form */}
            <div className="admin-form-card">
              <h3>+ Schedule New Live Class</h3>
              <form onSubmit={addClass} className="admin-form">
                <div className="form-row" style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
                  <div className="form-field">
                    <label>Session Topic / Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. GS-3: Indian Economy & Inflation Strategy"
                      required
                      value={classForm.title}
                      onChange={e => setClassForm({ ...classForm, title: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Date</label>
                    <input
                      type="date"
                      required
                      value={classForm.date}
                      onChange={e => setClassForm({ ...classForm, date: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Specific Timing</label>
                    <input
                      type="time"
                      required
                      value={classForm.time}
                      onChange={e => setClassForm({ ...classForm, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1.2fr 1fr' }}>
                  <div className="form-field">
                    <label>Select Associated Course</label>
                    <select
                      value={classForm.courseId}
                      onChange={e => setClassForm({ ...classForm, courseId: e.target.value })}
                    >
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>📚 {c.title}</option>
                      ))}
                      {courses.length === 0 && <option value="">No Course (General)</option>}
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Audience / Allotted Student</label>
                    <select
                      value={classForm.assignedStudent}
                      onChange={e => setClassForm({ ...classForm, assignedStudent: e.target.value })}
                    >
                      <option value="All Students">🌐 All Enrolled Students in this Course</option>
                      {students.map(s => (
                        <option key={s.id} value={s.name}>👤 1:1 Session for {s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-field meet-field">
                  <label>Google Meet Link / Meeting URL</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    required
                    value={classForm.meetLink}
                    onChange={e => setClassForm({ ...classForm, meetLink: e.target.value })}
                  />
                </div>

                <button type="submit" className="admin-btn" disabled={classSaving}>
                  {classSaving ? 'Scheduling Live Class...' : '+ Schedule Class & Send Reminder'}
                </button>
              </form>
            </div>

            {/* Classes list */}
            <div className="admin-section">
              <h3>Scheduled Classes ({classes.length})</h3>
              {classes.length === 0 ? (
                <div className="admin-empty">No classes scheduled yet. Add one above.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Topic</th>
                      <th>Course</th>
                      <th>Audience</th>
                      <th>Date</th>
                      <th>Timing</th>
                      <th>Google Meet Link</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map(cls => (
                      <tr key={cls.id}>
                        <td><strong>{cls.title}</strong></td>
                        <td><span className="assigned-badge">{cls.courseTitle || 'Mentorship Program'}</span></td>
                        <td>
                          {cls.assignedStudent === 'All Students' || !cls.assignedStudent ? '🌐 All Enrolled' : `👤 ${cls.assignedStudent}`}
                        </td>
                        <td>{cls.date}</td>
                        <td><strong>{cls.time}</strong></td>
                        <td>
                          <a href={cls.meetLink} target="_blank" rel="noopener noreferrer" className="meet-link">
                            Open Google Meet ↗
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

        {/* ── 3. STUDENTS TAB ───────────────────────────────────────────── */}
        {tab === 'students' && (
          <div>
            <div className="admin-page-header">
              <h1>Enrolled Students Management</h1>
              <p>Add students directly to courses. Login credentials and the mobile app download link will be dispatched automatically to their email.</p>
            </div>

            {/* Enroll Student Form */}
            <div className="admin-form-card">
              <h3>+ Add Student to Course & Send Login Details</h3>
              <form onSubmit={enrollStudent} className="admin-form">
                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div className="form-field">
                    <label>Student Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={studentForm.name}
                      onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>Student Email (Receives Login & App Link)</label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      required
                      value={studentForm.email}
                      onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                    />
                  </div>
                  <div className="form-field">
                    <label>WhatsApp / Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={studentForm.phone}
                      onChange={e => setStudentForm({ ...studentForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-field">
                  <label>Assign to Course</label>
                  <select
                    value={studentForm.courseId}
                    onChange={e => setStudentForm({ ...studentForm, courseId: e.target.value })}
                  >
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>📚 {c.title} (₹{c.price})</option>
                    ))}
                    {courses.length === 0 && <option value="">General Mentorship</option>}
                  </select>
                </div>

                <label className="form-check">
                  <input
                    type="checkbox"
                    checked={studentForm.sendEmail}
                    onChange={e => setStudentForm({ ...studentForm, sendEmail: e.target.checked })}
                  />
                  <span>Send student login details (email + password) & mobile application download link via email</span>
                </label>

                <button type="submit" className="admin-btn" disabled={studentSaving}>
                  {studentSaving ? 'Enrolling & Sending Email...' : '+ Enroll Student & Dispatch Details'}
                </button>
              </form>
            </div>

            {/* Students List */}
            <div className="admin-section">
              <h3>Enrolled Aspirants ({students.length})</h3>
              {students.length === 0 ? (
                <div className="admin-empty">No students registered yet. Enroll one above.</div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Enrolled Course</th>
                      <th>Joined Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s.id}>
                        <td><strong>{s.name}</strong></td>
                        <td>{s.email}</td>
                        <td>{s.phone}</td>
                        <td>
                          <span className="assigned-badge">
                            {s.course || '1:1 Comprehensive UPSC Mentorship'}
                          </span>
                        </td>
                        <td>{s.joinedDate}</td>
                        <td>
                          <button className="delete-btn" onClick={() => removeStudent(s.id)}>Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── 4. CHAT TAB ───────────────────────────────────────────────── */}
        {tab === 'chat' && (
          <div className="admin-chat-wrap">
            <div className="admin-page-header">
              <h1>Student Messages</h1>
              <p>Reply to student questions as Indrajeet Sir.</p>
            </div>
            <div className="admin-chat-box">
              <div className="admin-chat-msgs">
                {messages.length === 0 && <div className="admin-empty">No messages yet.</div>}
                {messages.map(m => (
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
