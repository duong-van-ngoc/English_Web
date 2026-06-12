import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Xóa cứng các topic đã bị soft delete để giải phóng slug trùng lặp
  const result = await prisma.vocabularyTopic.deleteMany({
    where: {
      deletedAt: { not: null }
    }
  });
  console.log(`Successfully hard-deleted ${result.count} soft-deleted topics from database.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
