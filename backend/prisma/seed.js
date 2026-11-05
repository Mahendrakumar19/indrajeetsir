import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with Admin details...');

  // 1. Ensure Organization
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: 'Indrajeet Sir UPSC Mentorship',
        contactEmail: 'indrajeet.visionias@gmail.com',
        primaryColor: '#3b82f6',
        secondaryColor: '#0f172a',
      },
    });
    console.log('Created organization:', org.name);
  } else {
    console.log('Existing organization found:', org.name);
  }

  // 2. Hash admin password
  const adminEmail = 'admin@indrajeetsir.com';
  const adminPasswordPlain = 'Admin@Indrajeet2026';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPasswordPlain, salt);

  // 3. Upsert Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Indrajeet Sir',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 98734 86158',
      bio: 'Founder & Lead UPSC Mentor at Indrajeet Sir UPSC Mentorship Academy',
      avatarKey: 'ias_officer',
      organizationId: org.id,
    },
    create: {
      email: adminEmail,
      name: 'Indrajeet Sir',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 98765 00001',
      bio: 'Founder & Lead UPSC Mentor at Indrajeet Sir UPSC Mentorship Academy',
      avatarKey: 'ias_officer',
      organizationId: org.id,
    },
  });

  // 4. Clean up legacy dummy courses
  await prisma.course.deleteMany({
    where: {
      OR: [
        { title: { contains: 'GS Paper 3' } },
        { title: { contains: 'Ethics Special' } },
        { price: 4999 },
        { price: 2999 },
      ],
    },
  });

  // 5. Ensure All 5 Authentic UPSC Mentorship Batches
  const fiveCourses = [
    {
      title: '1 Year Full Mentorship for UPSC 2027 (After Foundation Course)',
      description: 'Complete 3-Stage Prelims, Mains, and Interview guidance with 1-on-1 personal mentorship by Indrajeet Sir.',
      price: 24000,
    },
    {
      title: 'UPSC Mains 2027 Comprehensive Mentorship',
      description: 'Targeted Mains score maximization with personal copy evaluation and structure improvement by Indrajeet Sir.',
      price: 18000,
    },
    {
      title: 'UPSC Prelims 2027 Targeted Program',
      description: 'Build rigorous elimination skills, concise revision notes, and solve 5,000+ targeted practice questions.',
      price: 10000,
    },
    {
      title: '1 Year Full Mentorship for UPSC 2027 / 2028 (Parallel with Foundation Course)',
      description: 'Align and strengthen your preparation alongside your ongoing foundation course (Note: We do not provide foundation lectures).',
      price: 30000,
    },
    {
      title: 'UPSC Mains Short Notes Making',
      description: 'Master the methodology of condensing vast GS 1–4 syllabus into high-yield micro notes.',
      price: 4500,
    },
  ];

  for (const c of fiveCourses) {
    const existing = await prisma.course.findFirst({ where: { title: c.title } });
    if (!existing) {
      await prisma.course.create({
        data: {
          title: c.title,
          description: c.description,
          price: c.price,
          instructor: 'Indrajeet Sir',
          published: true,
          organizationId: org.id,
        },
      });
      console.log('Seeded batch:', c.title);
    }
  }
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
