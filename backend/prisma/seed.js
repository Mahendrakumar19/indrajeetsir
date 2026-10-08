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
        name: 'Indrajeet Sir IAS Mentorship',
        contactEmail: 'admin@indrajeetsir.com',
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
      phone: '+91 98765 00001',
      bio: 'Founder & Lead UPSC Mentor at Indrajeet Sir IAS Mentorship Academy',
      avatarKey: 'ias_officer',
      organizationId: org.id,
    },
    create: {
      email: adminEmail,
      name: 'Indrajeet Sir',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '+91 98765 00001',
      bio: 'Founder & Lead UPSC Mentor at Indrajeet Sir IAS Mentorship Academy',
      avatarKey: 'ias_officer',
      organizationId: org.id,
    },
  });

  // 4. Ensure Official Course from Brochure
  let officialCourse = await prisma.course.findFirst({
    where: { title: '1:1 Mentorship Program — UPSC 2027 Complete Guidance' },
  });
  if (!officialCourse) {
    officialCourse = await prisma.course.create({
      data: {
        title: '1:1 Mentorship Program — UPSC 2027 Complete Guidance',
        description: 'Complete 1:1 guidance by Indrajeet Sir covering Prelims foundation, Mains answer writing edge (600+ short notes topics, 16 tests), and Personality Test interview preparation with live Google Meet sessions.',
        price: 4999,
        instructor: 'Indrajeet Sir',
        published: true,
        organizationId: org.id,
      },
    });
    console.log('Seeded official course:', officialCourse.title);
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
