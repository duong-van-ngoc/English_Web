-- AlterEnum
ALTER TYPE "ContentStatus" ADD VALUE 'ARCHIVED';

-- DropIndex
DROP INDEX "VocabularyReview_userId_status_nextReviewAt_idx";

-- AlterTable
ALTER TABLE "Vocabulary" ADD COLUMN     "collocations" TEXT[],
ADD COLUMN     "commonMistakes" TEXT[],
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "difficulty" TEXT,
ADD COLUMN     "exampleVi" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "level" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "partOfSpeech" TEXT,
ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "synonyms" TEXT[],
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "topicId" TEXT,
ADD COLUMN     "updatedBy" TEXT,
ADD COLUMN     "wordFamily" TEXT[],
ALTER COLUMN "lessonId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VocabularyReview" ADD COLUMN     "isFavorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "masteredAt" TIMESTAMP(3),
ADD COLUMN     "note" TEXT,
ALTER COLUMN "status" SET DEFAULT 'LEARNING',
ALTER COLUMN "easeLevel" SET DEFAULT 0,
ALTER COLUMN "nextReviewAt" DROP NOT NULL,
ALTER COLUMN "nextReviewAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "VocabularyTopic" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "icon" TEXT,
    "level" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VocabularyTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VocabularyTopic_courseId_idx" ON "VocabularyTopic"("courseId");

-- CreateIndex
CREATE INDEX "VocabularyTopic_status_idx" ON "VocabularyTopic"("status");

-- CreateIndex
CREATE INDEX "VocabularyTopic_deletedAt_idx" ON "VocabularyTopic"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "VocabularyTopic_courseId_slug_key" ON "VocabularyTopic"("courseId", "slug");

-- CreateIndex
CREATE INDEX "Vocabulary_lessonId_idx" ON "Vocabulary"("lessonId");

-- CreateIndex
CREATE INDEX "Vocabulary_topicId_idx" ON "Vocabulary"("topicId");

-- CreateIndex
CREATE INDEX "Vocabulary_status_idx" ON "Vocabulary"("status");

-- CreateIndex
CREATE INDEX "Vocabulary_deletedAt_idx" ON "Vocabulary"("deletedAt");

-- CreateIndex
CREATE INDEX "VocabularyReview_userId_idx" ON "VocabularyReview"("userId");

-- CreateIndex
CREATE INDEX "VocabularyReview_vocabularyId_idx" ON "VocabularyReview"("vocabularyId");

-- CreateIndex
CREATE INDEX "VocabularyReview_status_idx" ON "VocabularyReview"("status");

-- AddForeignKey
ALTER TABLE "Vocabulary" ADD CONSTRAINT "Vocabulary_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "VocabularyTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VocabularyTopic" ADD CONSTRAINT "VocabularyTopic_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
