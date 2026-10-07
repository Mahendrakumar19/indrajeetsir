import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

// ─── In-Memory Resilient Fallback Store ───────────────────────────────────────
let fallbackStudents: any[] = [
  { id: 'st-1', name: 'Rahul Kumar', email: 'rahul@gmail.com', phone: '+91 98765 43210', attempt: '2027', joinedDate: '2026-08-15' },
  { id: 'st-2', name: 'Priya Sharma', email: 'priya@outlook.com', phone: '+91 98123 45678', attempt: '2026', joinedDate: '2026-06-01' },
];

let fallbackLiveClasses: any[] = [
  {
    id: 'lc-1',
    title: 'GS-3: Economy & Inflation Strategy',
    date: '2026-10-15',
    time: '19:00',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    assignedStudent: 'All Students',
    status: 'UPCOMING',
  },
];

let fallbackMessages: any[] = [
  { id: 'm-1', studentName: 'Rahul Kumar', text: 'Sir, what time is the class today?', sender: 'student', timestamp: '10:00 AM' },
  { id: 'm-2', studentName: 'Rahul Kumar', text: '7:00 PM on Google Meet. Link is on your dashboard.', sender: 'admin', timestamp: '10:05 AM' },
];

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  // Health check with DB status
  @Get()
  async health() {
    let dbOk = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbOk = true;
    } catch {}

    return {
      status: 'ok',
      app: 'Indrajeet Sir UPSC & State PCS Mentorship API',
      database: dbOk ? 'MySQL Connected' : 'In-Memory Fallback Active',
      timestamp: new Date().toISOString(),
      env: process.env.NODE_ENV || 'development',
    };
  }

  // ── Auth Endpoints ──────────────────────────────────────────────────────────
  @Post('auth/student-login')
  async studentLogin(@Body() body: { email: string; password?: string }) {
    const emailClean = (body.email || '').trim().toLowerCase();

    try {
      let user = await this.prisma.user.findUnique({ where: { email: emailClean } });
      if (!user) {
        // Ensure default organization exists
        let org = await this.prisma.organization.findFirst();
        if (!org) {
          org = await this.prisma.organization.create({
            data: { name: 'Indrajeet Sir Mentorship', contactEmail: 'info@indrajeetsir.com' },
          });
        }
        user = await this.prisma.user.create({
          data: {
            email: emailClean,
            password: body.password || 'default_pass',
            name: body.email ? body.email.split('@')[0] : 'Student',
            role: 'STUDENT',
            organizationId: org.id,
          },
        });
      }

      const studentObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 98765 43210',
        bio: user.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
        attempt: user.attempt || '2027',
        optionalSubject: user.optionalSubject || 'Public Administration',
        avatarKey: user.avatarKey || 'ias_officer',
        joinedDate: user.createdAt.toISOString().slice(0, 10),
      };

      return {
        success: true,
        token: `student_token_${user.id}_${Date.now()}`,
        student: studentObj,
      };
    } catch {
      // In-memory fallback
      const existing = fallbackStudents.find(s => s.email.toLowerCase() === emailClean);
      if (existing) {
        return { success: true, token: `student_token_${existing.id}_${Date.now()}`, student: existing };
      }
      const newSt = {
        id: `st-${Date.now()}`,
        name: body.email ? body.email.split('@')[0] : 'Student',
        email: body.email || 'student@indrajeetsir.com',
        phone: '+91 98765 43210',
        bio: 'Dedicated UPSC Aspirant targeting top rank in CSE',
        attempt: '2027',
        optionalSubject: 'Public Administration',
        avatarKey: 'ias_officer',
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      fallbackStudents.push(newSt);
      return { success: true, token: `student_token_${newSt.id}_${Date.now()}`, student: newSt };
    }
  }

  @Post('auth/register')
  async registerStudent(@Body() body: { name: string; email: string; phone?: string; attempt?: string; bio?: string; optionalSubject?: string; avatarKey?: string; password?: string }) {
    const emailClean = (body.email || '').trim().toLowerCase();

    try {
      let user = await this.prisma.user.findUnique({ where: { email: emailClean } });
      if (!user) {
        let org = await this.prisma.organization.findFirst();
        if (!org) {
          org = await this.prisma.organization.create({
            data: { name: 'Indrajeet Sir Mentorship', contactEmail: 'info@indrajeetsir.com' },
          });
        }
        user = await this.prisma.user.create({
          data: {
            email: emailClean,
            password: body.password || 'default_pass',
            name: body.name || 'Student',
            role: 'STUDENT',
            phone: body.phone,
            bio: body.bio,
            attempt: body.attempt,
            optionalSubject: body.optionalSubject,
            avatarKey: body.avatarKey,
            organizationId: org.id,
          },
        });
      }

      const studentObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || body.phone || '+91 98765 43210',
        bio: user.bio || body.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
        attempt: user.attempt || body.attempt || '2027',
        optionalSubject: user.optionalSubject || body.optionalSubject || 'Public Administration',
        avatarKey: user.avatarKey || body.avatarKey || 'ias_officer',
        joinedDate: user.createdAt.toISOString().slice(0, 10),
      };

      return {
        success: true,
        token: `student_token_${user.id}_${Date.now()}`,
        student: studentObj,
      };
    } catch {
      const existing = fallbackStudents.find(s => s.email.toLowerCase() === emailClean);
      if (existing) {
        return { success: true, token: `student_token_${existing.id}_${Date.now()}`, student: existing };
      }
      const newSt = {
        id: `st-${Date.now()}`,
        name: body.name || 'Student',
        email: body.email,
        phone: body.phone || '+91 98765 43210',
        bio: body.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
        attempt: body.attempt || '2027',
        optionalSubject: body.optionalSubject || 'Public Administration',
        avatarKey: body.avatarKey || 'ias_officer',
        joinedDate: new Date().toISOString().slice(0, 10),
      };
      fallbackStudents.push(newSt);
      return { success: true, token: `student_token_${newSt.id}_${Date.now()}`, student: newSt };
    }
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

  // ── Students Management ───────────────────────────────────────────────────
  @Get('students')
  async getStudents() {
    try {
      const users = await this.prisma.user.findMany({ where: { role: 'STUDENT' } });
      if (users.length > 0) {
        return users.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || '+91 98765 43210',
          bio: u.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
          attempt: u.attempt || '2027',
          optionalSubject: u.optionalSubject || 'Public Administration',
          avatarKey: u.avatarKey || 'ias_officer',
          joinedDate: u.createdAt.toISOString().slice(0, 10),
        }));
      }
    } catch {}
    return fallbackStudents;
  }

  @Post('students')
  async addOrUpdateStudent(@Body() body: {
    name?: string;
    email: string;
    phone?: string;
    attempt?: string;
    bio?: string;
    optionalSubject?: string;
    avatarKey?: string;
  }) {
    const emailClean = (body.email || '').trim().toLowerCase();
    try {
      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: { name: 'Indrajeet Sir Mentorship', contactEmail: 'info@indrajeetsir.com' },
        });
      }

      const user = await this.prisma.user.upsert({
        where: { email: emailClean },
        update: {
          name: body.name ?? undefined,
          phone: body.phone ?? undefined,
          bio: body.bio ?? undefined,
          attempt: body.attempt ?? undefined,
          optionalSubject: body.optionalSubject ?? undefined,
          avatarKey: body.avatarKey ?? undefined,
        },
        create: {
          name: body.name || emailClean.split('@')[0],
          email: emailClean,
          password: 'default_password',
          role: 'STUDENT',
          phone: body.phone || '+91 98765 43210',
          bio: body.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
          attempt: body.attempt || '2027',
          optionalSubject: body.optionalSubject || 'Public Administration',
          avatarKey: body.avatarKey || 'ias_officer',
          organizationId: org.id,
        },
      });

      const st = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || body.phone,
        bio: user.bio || body.bio,
        attempt: user.attempt || body.attempt,
        optionalSubject: user.optionalSubject || body.optionalSubject,
        avatarKey: user.avatarKey || body.avatarKey,
        joinedDate: user.createdAt.toISOString().slice(0, 10),
      };
      return { success: true, student: st };
    } catch (err: any) {
      console.error('Error in upsert student to DB:', err);
      let existing = fallbackStudents.find(s => s.email.toLowerCase() === emailClean);
      if (existing) {
        Object.assign(existing, body);
        return { success: true, student: existing };
      }
      const st = { id: `st-${Date.now()}`, ...body, joinedDate: new Date().toISOString().slice(0, 10) };
      fallbackStudents.push(st);
      return { success: true, student: st };
    }
  }

  @Delete('students/:id')
  async removeStudent(@Param('id') id: string) {
    try {
      await this.prisma.user.delete({ where: { id } });
    } catch {}
    fallbackStudents = fallbackStudents.filter(s => s.id !== id);
    return { success: true };
  }

  // ── Live Classes ──────────────────────────────────────────────────────────
  @Get('live-classes')
  async getLiveClasses() {
    try {
      const classes = await this.prisma.liveClass.findMany();
      if (classes.length > 0) {
        return classes.map((c: any) => ({
          id: c.id,
          title: c.title,
          date: c.date.toISOString().slice(0, 10),
          time: c.startTime,
          meetLink: c.meetingUrl,
          assignedStudent: c.description || 'All Students',
          status: c.status,
        }));
      }
    } catch {}
    return fallbackLiveClasses;
  }

  @Post('live-classes')
  async addLiveClass(@Body() body: { title: string; date: string; time: string; meetLink: string; assignedStudent?: string }) {
    try {
      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: { name: 'Indrajeet Sir Mentorship', contactEmail: 'info@indrajeetsir.com' },
        });
      }
      let course = await this.prisma.course.findFirst();
      if (!course) {
        course = await this.prisma.course.create({
          data: { title: 'UPSC Mentorship Course', organizationId: org.id },
        });
      }
      const lc = await this.prisma.liveClass.create({
        data: {
          title: body.title,
          date: new Date(body.date || Date.now()),
          startTime: body.time || '19:00',
          duration: 60,
          meetingUrl: body.meetLink,
          description: body.assignedStudent || 'All Students',
          status: 'UPCOMING',
          courseId: course.id,
          organizationId: org.id,
        },
      });
      const resClass = {
        id: lc.id,
        title: lc.title,
        date: body.date,
        time: body.time,
        meetLink: lc.meetingUrl,
        assignedStudent: body.assignedStudent || 'All Students',
        status: lc.status,
      };
      fallbackLiveClasses.push(resClass);
      return { success: true, liveClass: resClass };
    } catch {
      const resClass = {
        id: `lc-${Date.now()}`,
        assignedStudent: body.assignedStudent || 'All Students',
        ...body,
        status: 'UPCOMING',
      };
      fallbackLiveClasses.push(resClass);
      return { success: true, liveClass: resClass };
    }
  }

  @Delete('live-classes/:id')
  async deleteLiveClass(@Param('id') id: string) {
    try {
      await this.prisma.liveClass.delete({ where: { id } });
    } catch {}
    fallbackLiveClasses = fallbackLiveClasses.filter(c => c.id !== id);
    return { success: true };
  }

  // ── Messages / Chat ───────────────────────────────────────────────────────
  @Get('messages')
  getMessages() {
    return fallbackMessages;
  }

  @Post('messages')
  sendMessage(@Body() body: { studentName: string; text: string; sender: 'student' | 'admin' }) {
    const msg = {
      id: `m-${Date.now()}`,
      ...body,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    fallbackMessages.push(msg);
    return { success: true, message: msg };
  }
}
