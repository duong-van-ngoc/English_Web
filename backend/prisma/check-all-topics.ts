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
  const topics = await prisma.vocabularyTopic.findMany({});
  console.log('Total Topics in Database:', topics.length);
  console.log('Topics detail:', topics.map(t => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    deletedAt: t.deletedAt,
    status: t.status
  })));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
