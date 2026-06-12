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
  const words = await prisma.vocabulary.findMany({
    where: { deletedAt: null }
  });
  console.log('Words count:', words.length);
  console.log('Words:', words.map(w => ({ word: w.word, meaning: w.meaning, topicId: w.topicId, status: w.status })));

  const topics = await prisma.vocabularyTopic.findMany({
    where: { deletedAt: null }
  });
  console.log('Topics count:', topics.length);
  console.log('Topics:', topics.map(t => ({ id: t.id, name: t.name, slug: t.slug })));
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
