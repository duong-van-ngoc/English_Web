import { PrismaClient, UserRole } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = 'admin@gmail.com';
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingUser) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        role: UserRole.ADMIN,
        password: hashedPassword
      }
    });
    console.log(`Updated user ${adminEmail} to ADMIN and set password to 'admin123'`);
  } else {
    const newAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'System Admin',
        role: UserRole.ADMIN
      }
    });
    console.log(`Created new admin user: ${newAdmin.email} with password 'admin123'`);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
