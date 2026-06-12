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
  // Cập nhật tất cả từ vựng đang ở DRAFT thuộc chủ đề office (hoặc tất cả các chủ đề) thành PUBLISHED
  const result = await prisma.vocabulary.updateMany({
    where: {
      status: 'DRAFT',
      deletedAt: null,
    },
    data: {
      status: 'PUBLISHED',
    },
  });
  console.log(`Successfully updated ${result.count} words to PUBLISHED.`);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
