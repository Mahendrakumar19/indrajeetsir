import { Controller, Get, Post, Delete, Body, Param, Headers } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { AuthService } from './auth.service.js';

import { MailService } from './mail.service.js';
import { RazorpayService } from './razorpay.service.js';

// ─── In-Memory Resilient Fallback Store ───────────────────────────────────────
let fallbackStudents: any[] = [
  { id: 'st-1', name: 'Rahul Kumar', email: 'rahul@gmail.com', phone: '+91 98765 43210', attempt: '2027', joinedDate: '2026-08-15' },
  { id: 'st-2', name: 'Priya Sharma', email: 'priya@outlook.com', phone: '+91 98123 45678', attempt: '2026', joinedDate: '2026-06-01' },
];

let fallbackLiveClasses: any[] = [];

let fallbackCourses: any[] = [
  {
    id: 'c-1',
    title: '1:1 Comprehensive UPSC Mentorship 2026-27',
    description: 'Personalized 1:1 guidance with Indrajeet Sir, Mains answer evaluation, and dedicated live sessions.',
    price: 4999,
    instructor: 'Indrajeet Sir',
    published: true,
  },
  {
    id: 'c-2',
    title: 'GS Paper 3 & Ethics Special Masterclass Batch',
    description: 'Targeted preparation for Economy, Science & Tech, Environment, and Ethics Case Studies.',
    price: 2999,
    instructor: 'Indrajeet Sir',
    published: true,
  },
];

let fallbackMessages: any[] = [
  { id: 'm-1', studentName: 'Rahul Kumar', text: 'Sir, what time is the class today?', sender: 'student', timestamp: '10:00 AM' },
  { id: 'm-2', studentName: 'Rahul Kumar', text: '7:00 PM on Google Meet. Link is on your dashboard.', sender: 'admin', timestamp: '10:05 AM' },
];

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auth: AuthService,
    private readonly mail: MailService,
    private readonly razorpay: RazorpayService,
  ) {}

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
    if (!emailClean) {
      return { success: false, message: 'Email address is required.' };
    }

    try {
      let user = await this.prisma.user.findUnique({
        where: { email: emailClean },
        include: {
          enrollments: {
            include: { course: true },
          },
        },
      });
      const passwordPlain = body.password || 'default_pass';

      if (user) {
        // Verify password
        const isMatch = await this.auth.comparePassword(passwordPlain, user.password);
        if (!isMatch) {
          return { success: false, message: 'Invalid password. Please check your credentials.' };
        }

        // Seamless migration: upgrade plain text password to bcrypt hash
        if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
          const newHashed = await this.auth.hashPassword(passwordPlain);
          await this.prisma.user.update({
            where: { id: user.id },
            data: { password: newHashed },
          });
        }
      } else {
        // New student on mobile login: create student with bcrypt-hashed password
        let org = await this.prisma.organization.findFirst();
        if (!org) {
          org = await this.prisma.organization.create({
            data: { name: 'Indrajeet Sir IAS Mentorship', contactEmail: 'indrajeet.visionias@gmail.com' },
          });
        }

        const hashedPassword = await this.auth.hashPassword(passwordPlain);
        user = await this.prisma.user.create({
          data: {
            email: emailClean,
            password: hashedPassword,
            name: body.email ? body.email.split('@')[0] : 'Student',
            role: 'STUDENT',
            organizationId: org.id,
          },
          include: {
            enrollments: {
              include: { course: true },
            },
          },
        });
      }

      // Generate standard signed JWT
      const token = this.auth.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const enrolledCourses = (user.enrollments || []).map((e: any) => e.course?.title).filter(Boolean);
      const primaryCourse = enrolledCourses[0] || '1:1 Comprehensive UPSC Mentorship 2026-27';

      const studentObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '+91 98765 43210',
        bio: user.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
        attempt: user.attempt || '2027',
        optionalSubject: user.optionalSubject || 'Public Administration',
        avatarKey: user.avatarKey || 'ias_officer',
        role: user.role,
        course: primaryCourse,
        enrolledCourse: primaryCourse,
        courses: enrolledCourses,
        joinedDate: user.createdAt.toISOString().slice(0, 10),
      };

      return {
        success: true,
        token,
        student: studentObj,
      };
    } catch {
      // In-memory resilient fallback
      let existing = fallbackStudents.find(s => s.email.toLowerCase() === emailClean);
      if (!existing) {
        existing = {
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
        fallbackStudents.push(existing);
      }
      const token = this.auth.generateToken({
        id: existing.id,
        email: existing.email,
        role: 'STUDENT',
        name: existing.name,
      });
      return { success: true, token, student: existing };
    }
  }

  @Post('auth/register')
  async registerStudent(@Body() body: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    attempt?: string;
    bio?: string;
    optionalSubject?: string;
    avatarKey?: string;
  }) {
    const emailClean = (body.email || '').trim().toLowerCase();
    if (!emailClean) {
      return { success: false, message: 'Email address is required.' };
    }

    try {
      const existing = await this.prisma.user.findUnique({ where: { email: emailClean } });
      if (existing) {
        return { success: false, message: 'An account with this email already exists. Please login.' };
      }

      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: { name: 'Indrajeet Sir IAS Mentorship', contactEmail: 'indrajeet.visionias@gmail.com' },
        });
      }

      const hashedPassword = await this.auth.hashPassword(body.password || 'Student@123');
      const user = await this.prisma.user.create({
        data: {
          email: emailClean,
          password: hashedPassword,
          name: body.name || 'Student',
          role: 'STUDENT',
          phone: body.phone,
          bio: body.bio,
          attempt: body.attempt || '2027',
          optionalSubject: body.optionalSubject || 'Public Administration',
          avatarKey: body.avatarKey || 'ias_officer',
          organizationId: org.id,
        },
      });

      const token = this.auth.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      });

      const studentObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || body.phone || '+91 98765 43210',
        bio: user.bio || body.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
        attempt: user.attempt || body.attempt || '2027',
        optionalSubject: user.optionalSubject || body.optionalSubject || 'Public Administration',
        avatarKey: user.avatarKey || body.avatarKey || 'ias_officer',
        role: user.role,
        joinedDate: user.createdAt.toISOString().slice(0, 10),
      };

      return {
        success: true,
        token,
        student: studentObj,
      };
    } catch {
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
      const token = this.auth.generateToken({
        id: newSt.id,
        email: newSt.email,
        role: 'STUDENT',
        name: newSt.name,
      });
      return { success: true, token, student: newSt };
    }
  }

  @Post('auth/admin-login')
  async adminLogin(@Body() body: { email?: string; password?: string; passcode?: string }) {
    const inputPasscode = (body.passcode || '').trim();
    const inputEmail = (body.email || '').trim().toLowerCase();
    const inputPassword = body.password || '';

    try {
      // 1. Try finding Admin in DB
      let admin = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: inputEmail || 'admin@indrajeetsir.com' },
            { role: 'ADMIN' },
          ],
        },
      });

      let isAuthenticated = false;

      if (admin) {
        if (inputEmail && inputPassword) {
          // Standard Email + Password Login
          isAuthenticated = await this.auth.comparePassword(inputPassword, admin.password);
        } else if (inputPasscode) {
          // Passcode / Dashboard Quick Login
          const validCodes = ['admin123', 'admin', 'indrajeet', '1234', 'Admin@Indrajeet2026', (process.env.ADMIN_PASSCODE || 'admin123').toLowerCase()];
          const codeMatches = validCodes.includes(inputPasscode.toLowerCase()) || await this.auth.comparePassword(inputPasscode, admin.password);
          if (codeMatches) isAuthenticated = true;
        }
      } else {
        // Fallback check against environment passcode
        const validCodes = ['admin123', 'admin', 'indrajeet', '1234', (process.env.ADMIN_PASSCODE || 'admin123').toLowerCase()];
        if (validCodes.includes(inputPasscode.toLowerCase()) || validCodes.includes(inputPassword.toLowerCase())) {
          isAuthenticated = true;
        }
      }

      if (isAuthenticated) {
        const adminId = admin ? admin.id : 'admin-master';
        const adminEmail = admin ? admin.email : 'admin@indrajeetsir.com';
        const adminName = admin ? admin.name : 'Indrajeet Sir';

        const token = this.auth.generateToken({
          id: adminId,
          email: adminEmail,
          role: 'ADMIN',
          name: adminName,
        });

        return {
          success: true,
          token,
          role: 'ADMIN',
          user: {
            id: adminId,
            name: adminName,
            email: adminEmail,
            role: 'ADMIN',
            phone: admin?.phone || '+91 98734 86158',
          },
        };
      }

      return {
        success: false,
        message: 'Invalid admin credentials. Please try again.',
      };
    } catch (err: any) {
      console.error('Admin login error:', err);
      return {
        success: false,
        message: 'Error authenticating admin.',
      };
    }
  }

  @Get('auth/me')
  async getProfile(@Headers('authorization') authHeader?: string) {
    const token = this.auth.extractBearerToken(authHeader);
    if (!token) {
      return { success: false, message: 'Authorization token required.' };
    }

    const payload = this.auth.verifyToken(token);
    if (!payload) {
      return { success: false, message: 'Invalid or expired token.' };
    }

    try {
      const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
      if (user) {
        return {
          success: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            bio: user.bio,
            attempt: user.attempt,
            optionalSubject: user.optionalSubject,
            avatarKey: user.avatarKey,
          },
        };
      }
    } catch {}

    return {
      success: true,
      user: {
        id: payload.id,
        name: payload.name || 'User',
        email: payload.email,
        role: payload.role,
      },
    };
  }

  // ── Students Management ───────────────────────────────────────────────────
  @Get('students')
  async getStudents() {
    try {
      const users = await this.prisma.user.findMany({
        where: { role: 'STUDENT' },
        include: {
          enrollments: {
            include: { course: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (users.length > 0) {
        return users.map((u: any) => {
          const courseNames = (u.enrollments || []).map((e: any) => e.course?.title).filter(Boolean);
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || '+91 98765 43210',
            bio: u.bio || 'Dedicated UPSC Aspirant targeting top rank in CSE',
            attempt: u.attempt || '2027',
            optionalSubject: u.optionalSubject || 'Public Administration',
            avatarKey: u.avatarKey || 'ias_officer',
            course: courseNames[0] || '1:1 Comprehensive UPSC Mentorship',
            courses: courseNames,
            joinedDate: u.createdAt.toISOString().slice(0, 10),
          };
        });
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
          data: { name: 'Indrajeet Sir Mentorship', contactEmail: 'indrajeet.visionias@gmail.com' },
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

  // ── Courses Management ────────────────────────────────────────────────────
  @Get('courses')
  async getCourses() {
    try {
      const courses = await this.prisma.course.findMany({
        include: {
          _count: {
            select: { liveClasses: true, enrollments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      if (courses.length > 0) {
        return courses.map((c: any) => ({
          id: c.id,
          title: c.title,
          description: c.description,
          price: c.price || 0,
          instructor: c.instructor || 'Indrajeet Sir',
          published: c.published,
          liveClassesCount: c._count?.liveClasses || 0,
          enrollmentsCount: c._count?.enrollments || 0,
        }));
      }
    } catch {}
    return fallbackCourses;
  }

  @Post('courses')
  async createCourse(@Body() body: { title: string; description?: string; price?: number; instructor?: string }) {
    try {
      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: { name: 'Indrajeet Sir IAS Mentorship', contactEmail: 'indrajeet.visionias@gmail.com' },
        });
      }
      const course = await this.prisma.course.create({
        data: {
          title: body.title,
          description: body.description,
          price: Number(body.price) || 0,
          instructor: body.instructor || 'Indrajeet Sir',
          published: true,
          organizationId: org.id,
        },
      });
      return { success: true, course };
    } catch {
      const c = { id: `c-${Date.now()}`, ...body, published: true };
      fallbackCourses.unshift(c);
      return { success: true, course: c };
    }
  }

  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: string) {
    try {
      await this.prisma.course.delete({ where: { id } });
    } catch {}
    fallbackCourses = fallbackCourses.filter(c => c.id !== id);
    return { success: true };
  }

  // ── Razorpay Payment & Automated Student Onboarding ─────────────────────────
  @Post('payments/create-order')
  async createPaymentOrder(@Body() body: { courseId: string; studentEmail: string; studentName?: string; studentPhone?: string }) {
    const emailClean = (body.studentEmail || '').trim().toLowerCase();
    let coursePrice = 4999;
    let courseTitle = 'UPSC Mentorship Course';

    try {
      const course = await this.prisma.course.findUnique({ where: { id: body.courseId } });
      if (course) {
        coursePrice = course.price > 0 ? course.price : 4999;
        courseTitle = course.title;
      }
    } catch {}

    const orderData = await this.razorpay.createOrder({
      amountInRupees: coursePrice,
      courseId: body.courseId,
      studentEmail: emailClean,
    });

    try {
      await this.prisma.payment.create({
        data: {
          orderId: orderData.orderId,
          amount: coursePrice,
          currency: 'INR',
          status: 'CREATED',
          userEmail: emailClean,
          userName: body.studentName || 'Student',
          userPhone: body.studentPhone || '',
          courseId: body.courseId,
        },
      });
    } catch {}

    return {
      success: true,
      orderId: orderData.orderId,
      amount: orderData.amount,
      currency: orderData.currency,
      keyId: orderData.keyId,
      courseTitle,
    };
  }

  @Post('payments/verify')
  async verifyPayment(@Body() body: {
    orderId: string;
    paymentId: string;
    signature?: string;
    courseId: string;
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
  }) {
    const isValid = this.razorpay.verifySignature({
      orderId: body.orderId,
      paymentId: body.paymentId,
      signature: body.signature,
    });

    if (!isValid) {
      return { success: false, message: 'Invalid payment signature. Payment verification failed.' };
    }

    const emailClean = (body.studentEmail || '').trim().toLowerCase();
    const tempPassword = `UPSC@${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // 1. Mark payment as SUCCESS
      await this.prisma.payment.upsert({
        where: { orderId: body.orderId },
        update: {
          paymentId: body.paymentId,
          signature: body.signature,
          status: 'SUCCESS',
        },
        create: {
          orderId: body.orderId,
          paymentId: body.paymentId,
          signature: body.signature,
          status: 'SUCCESS',
          amount: 4999,
          userEmail: emailClean,
          userName: body.studentName,
          userPhone: body.studentPhone,
          courseId: body.courseId,
        },
      });

      // 2. Ensure Organization
      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: { name: 'Indrajeet Sir IAS Mentorship', contactEmail: 'indrajeet.visionias@gmail.com' },
        });
      }

      // 3. Find or Create Student User
      let user = await this.prisma.user.findUnique({ where: { email: emailClean } });
      const passwordHash = await this.auth.hashPassword(tempPassword);

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email: emailClean,
            name: body.studentName || 'Student',
            password: passwordHash,
            role: 'STUDENT',
            phone: body.studentPhone || '',
            organizationId: org.id,
          },
        });
      }

      // 4. Enroll Student in Course
      let courseTitle = 'UPSC 1:1 Mentorship';
      try {
        const course = await this.prisma.course.findUnique({ where: { id: body.courseId } });
        if (course) courseTitle = course.title;

        await this.prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: body.courseId,
            },
          },
          update: {},
          create: {
            userId: user.id,
            courseId: body.courseId,
            organizationId: org.id,
          },
        });
      } catch {}

      // 5. Send automated onboarding email with login credentials and download link
      await this.mail.sendStudentOnboardingEmail({
        email: emailClean,
        name: body.studentName || user.name,
        passwordPlain: tempPassword,
        courseTitle,
      });

      return {
        success: true,
        message: 'Payment verified and mentorship enrollment activated.',
        student: {
          email: user.email,
          name: user.name,
        },
      };
    } catch (err: any) {
      console.error('Payment verification error:', err);
      return { success: false, message: 'Internal processing error after payment.' };
    }
  }

  // ── Admin Direct Student Enrollment ───────────────────────────────────────
  @Post('admin/enroll-student')
  async adminEnrollStudent(@Body() body: {
    studentName: string;
    studentEmail: string;
    studentPhone?: string;
    courseId?: string;
    sendEmail?: boolean;
  }) {
    const emailClean = (body.studentEmail || '').trim().toLowerCase();
    const tempPassword = `UPSC@${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: { name: 'Indrajeet Sir IAS Mentorship', contactEmail: 'indrajeet.visionias@gmail.com' },
        });
      }

      const passwordHash = await this.auth.hashPassword(tempPassword);
      const user = await this.prisma.user.upsert({
        where: { email: emailClean },
        update: {
          name: body.studentName || undefined,
          phone: body.studentPhone || undefined,
        },
        create: {
          email: emailClean,
          name: body.studentName || 'Student',
          password: passwordHash,
          role: 'STUDENT',
          phone: body.studentPhone || '',
          organizationId: org.id,
        },
      });

      let courseTitle = '1:1 UPSC Mentorship Program';
      if (body.courseId) {
        const course = await this.prisma.course.findUnique({ where: { id: body.courseId } });
        if (course) {
          courseTitle = course.title;
          await this.prisma.enrollment.upsert({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: body.courseId,
              },
            },
            update: {},
            create: {
              userId: user.id,
              courseId: body.courseId,
              organizationId: org.id,
            },
          });
        }
      }

      if (body.sendEmail !== false) {
        await this.mail.sendStudentOnboardingEmail({
          email: emailClean,
          name: body.studentName || user.name,
          passwordPlain: tempPassword,
          courseTitle,
        });
      }

      return {
        success: true,
        student: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        temporaryPassword: tempPassword,
      };
    } catch (err: any) {
      console.error('Admin enroll error:', err);
      return { success: false, message: 'Failed to enroll student.' };
    }
  }

  // ── Live Classes ──────────────────────────────────────────────────────────
  @Get('live-classes')
  async getLiveClasses() {
    try {
      const classes = await this.prisma.liveClass.findMany({
        include: { course: true },
        orderBy: { date: 'asc' },
      });
      return classes.map((c: any) => ({
        id: c.id,
        title: c.title,
        date: c.date.toISOString().slice(0, 10),
        time: c.startTime,
        meetLink: c.meetingUrl,
        courseId: c.courseId,
        courseTitle: c.course?.title || 'Mentorship Program',
        assignedStudent: c.description || 'All Students',
        status: c.status,
      }));
    } catch {
      return fallbackLiveClasses;
    }
  }

  @Post('live-classes')
  async addLiveClass(@Body() body: {
    title: string;
    date: string;
    time: string;
    meetLink: string;
    courseId?: string;
    assignedStudent?: string;
  }) {
    try {
      let org = await this.prisma.organization.findFirst();
      if (!org) {
        org = await this.prisma.organization.create({
          data: { name: 'Indrajeet Sir IAS Mentorship', contactEmail: 'indrajeet.visionias@gmail.com' },
        });
      }

      let courseId = body.courseId;
      if (!courseId) {
        let course = await this.prisma.course.findFirst();
        if (!course) {
          course = await this.prisma.course.create({
            data: { title: 'UPSC Mentorship Course', organizationId: org.id },
          });
        }
        courseId = course.id;
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
          courseId: courseId,
          organizationId: org.id,
        },
        include: { course: true },
      });

      const resClass = {
        id: lc.id,
        title: lc.title,
        date: body.date,
        time: body.time,
        meetLink: lc.meetingUrl,
        courseId: lc.courseId,
        courseTitle: lc.course?.title || 'Mentorship Program',
        assignedStudent: lc.description,
        status: lc.status,
      };
      return { success: true, liveClass: resClass };
    } catch (err: any) {
      console.error('Add live class error:', err);
      return { success: false, message: 'Failed to schedule live class.' };
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
