import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';

// ─── In-Memory Data Store ─────────────────────────────────────────────────────
let students: any[] = [
  { id: 'st-1', name: 'Rahul Kumar', email: 'rahul@gmail.com', phone: '+91 98765 43210', attempt: '2027', joinedDate: '2026-08-15' },
  { id: 'st-2', name: 'Priya Sharma', email: 'priya@outlook.com', phone: '+91 98123 45678', attempt: '2026', joinedDate: '2026-06-01' },
];

let liveClasses: any[] = [
  {
    id: 'lc-1',
    title: 'GS-3: Economy & Inflation Strategy',
    date: '2026-10-15',
    time: '19:00',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    status: 'UPCOMING',
  },
];

let messages: any[] = [
  { id: 'm-1', studentName: 'Rahul Kumar', text: 'Sir, what time is the class today?', sender: 'student', timestamp: '10:00 AM' },
  { id: 'm-2', studentName: 'Rahul Kumar', text: '7:00 PM on Google Meet. Link is on your dashboard.', sender: 'admin', timestamp: '10:05 AM' },
];

// ─── Controller ───────────────────────────────────────────────────────────────
@Controller()
export class AppController {

  // Health check
  @Get()
  health() {
    return {
      status: 'ok',
      app: 'Indrajeet Sir UPSC & State PCS Mentorship API',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    };
  }

  // ── Auth Endpoints ──────────────────────────────────────────────────────────
  @Post('auth/student-login')
  studentLogin(@Body() body: { email: string; password?: string }) {
    const emailClean = (body.email || '').trim().toLowerCase();
    const existing = students.find(s => s.email.toLowerCase() === emailClean);

    if (existing) {
      return {
        success: true,
        token: `student_token_${existing.id}_${Date.now()}`,
        student: existing,
      };
    }

    const newStudent = {
      id: `st-${Date.now()}`,
      name: body.email ? body.email.split('@')[0] : 'Student',
      email: body.email || 'student@indrajeetsir.com',
      phone: '+91 98765 43210',
      attempt: '2027',
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    students.push(newStudent);

    return {
      success: true,
      token: `student_token_${newStudent.id}_${Date.now()}`,
      student: newStudent,
    };
  }

  @Post('auth/register')
  registerStudent(@Body() body: { name: string; email: string; phone?: string; attempt?: string }) {
    const emailClean = (body.email || '').trim().toLowerCase();
    const existing = students.find(s => s.email.toLowerCase() === emailClean);

    if (existing) {
      return {
        success: true,
        token: `student_token_${existing.id}_${Date.now()}`,
        student: existing,
      };
    }

    const newStudent = {
      id: `st-${Date.now()}`,
      name: body.name || 'Student',
      email: body.email,
      phone: body.phone || '+91 98765 43210',
      attempt: body.attempt || '2027',
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    students.push(newStudent);

    return {
      success: true,
      token: `student_token_${newStudent.id}_${Date.now()}`,
      student: newStudent,
    };
  }

  @Post('auth/admin-login')
  adminLogin(@Body() body: { passcode: string }) {
    const code = (body.passcode || '').trim().toLowerCase();
    const configuredPass = (process.env.ADMIN_PASSCODE || 'admin123').toLowerCase();
    const validCodes = ['admin123', 'admin', 'indrajeet', '1234', configuredPass];

    if (validCodes.includes(code)) {
      return {
        success: true,
        token: `admin_token_secure_${Date.now()}`,
        role: 'admin',
      };
    }

    return {
      success: false,
      message: 'Invalid admin passcode. Please try again.',
    };
  }

  // ── Students ─────────────────────────────────────────────────────────────
  @Get('students')
  getStudents() {
    return students;
  }

  @Post('students')
  addStudent(@Body() body: { name: string; email: string; phone: string; attempt: string }) {
    const student = {
      id: `st-${Date.now()}`,
      ...body,
      joinedDate: new Date().toISOString().slice(0, 10),
    };
    students.push(student);
    return { success: true, student };
  }

  @Delete('students/:id')
  removeStudent(@Param('id') id: string) {
    students = students.filter(s => s.id !== id);
    return { success: true };
  }

  // ── Live Classes ──────────────────────────────────────────────────────────
  @Get('live-classes')
  getLiveClasses() {
    return liveClasses;
  }

  @Post('live-classes')
  addLiveClass(@Body() body: { title: string; date: string; time: string; meetLink: string; assignedStudent?: string }) {
    const cls = {
      id: `lc-${Date.now()}`,
      assignedStudent: body.assignedStudent || 'All Students',
      ...body,
      status: 'UPCOMING',
    };
    liveClasses.push(cls);
    return { success: true, liveClass: cls };
  }

  @Delete('live-classes/:id')
  deleteLiveClass(@Param('id') id: string) {
    liveClasses = liveClasses.filter(c => c.id !== id);
    return { success: true };
  }

  // ── Messages / Chat ───────────────────────────────────────────────────────
  @Get('messages')
  getMessages() {
    return messages;
  }

  @Post('messages')
  sendMessage(@Body() body: { studentName: string; text: string; sender: 'student' | 'admin' }) {
    const msg = {
      id: `m-${Date.now()}`,
      ...body,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    messages.push(msg);
    return { success: true, message: msg };
  }
}
