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

  console.log('Admin user seeded successfully:');
  console.log('  ID:      ', adminUser.id);
  console.log('  Name:    ', adminUser.name);
  console.log('  Email:   ', adminUser.email);
  console.log('  Role:    ', adminUser.role);
  console.log('  Password: [PROTECTED BCRYPT HASH]');
}

main()
  .catch((e) => {
    console.error('Error seeding admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
