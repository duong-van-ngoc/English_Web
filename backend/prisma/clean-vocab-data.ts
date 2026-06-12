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
  console.log('Starting cleanup of vocabulary data...');

  // 1. Delete all VocabularyQuizAttempt records
  const quizAttemptsResult = await prisma.vocabularyQuizAttempt.deleteMany({});
  console.log(`Deleted ${quizAttemptsResult.count} VocabularyQuizAttempt records.`);

  // 2. Delete all VocabularyTopic records.
  // Note: Due to cascade deletes configured in schema.prisma, deleting topics
  // will cascade delete related Vocabulary and VocabularyReview records.
  const topicsResult = await prisma.vocabularyTopic.deleteMany({});
  console.log(`Deleted ${topicsResult.count} VocabularyTopic records.`);

  console.log('Cleanup completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error executing cleanup script:', e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
