-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Course"
  ADD COLUMN "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Lesson"
  ADD COLUMN "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Question"
  ADD COLUMN "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;

-- Keep existing learning content visible after the phase 6 migration.
UPDATE "Course"
SET "status" = 'PUBLISHED', "publishedAt" = CURRENT_TIMESTAMP;

UPDATE "Lesson"
SET "status" = 'PUBLISHED', "publishedAt" = CURRENT_TIMESTAMP;

UPDATE "Question"
SET "status" = 'PUBLISHED', "publishedAt" = CURRENT_TIMESTAMP;
