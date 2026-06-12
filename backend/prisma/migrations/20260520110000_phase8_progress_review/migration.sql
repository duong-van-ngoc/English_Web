-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DUE', 'LEARNING', 'MASTERED');

-- CreateTable
CREATE TABLE "VocabularyReview" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "vocabularyId" TEXT NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'DUE',
  "easeLevel" INTEGER NOT NULL DEFAULT 2,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "lastReviewedAt" TIMESTAMP(3),
  "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "VocabularyReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyReview_userId_vocabularyId_key" ON "VocabularyReview"("userId", "vocabularyId");

-- CreateIndex
CREATE INDEX "VocabularyReview_userId_status_nextReviewAt_idx" ON "VocabularyReview"("userId", "status", "nextReviewAt");

-- AddForeignKey
ALTER TABLE "VocabularyReview" ADD CONSTRAINT "VocabularyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyReview" ADD CONSTRAINT "VocabularyReview_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
