-- CreateEnum
CREATE TYPE "ToeicQuestionSetType" AS ENUM ('PRACTICE', 'MOCK_TEST');

-- CreateEnum
CREATE TYPE "ToeicAttemptStatus" AS ENUM ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "ToeicQuestionSet" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "part" INTEGER NOT NULL,
  "type" "ToeicQuestionSetType" NOT NULL DEFAULT 'PRACTICE',
  "duration" INTEGER,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ToeicQuestionSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToeicQuestionGroup" (
  "id" TEXT NOT NULL,
  "questionSetId" TEXT NOT NULL,
  "title" TEXT,
  "audioUrl" TEXT,
  "imageUrl" TEXT,
  "passageContent" TEXT,
  "transcript" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ToeicQuestionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToeicQuestion" (
  "id" TEXT NOT NULL,
  "questionGroupId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "explanation" TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ToeicQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToeicChoice" (
  "id" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ToeicChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToeicAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "questionSetId" TEXT NOT NULL,
  "questionSetVersion" INTEGER NOT NULL,
  "status" "ToeicAttemptStatus" NOT NULL DEFAULT 'IN_PROGRESS',
  "totalQuestions" INTEGER NOT NULL DEFAULT 0,
  "correctAnswers" INTEGER NOT NULL DEFAULT 0,
  "wrongAnswers" INTEGER NOT NULL DEFAULT 0,
  "score" INTEGER NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "submittedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ToeicAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToeicAttemptAnswer" (
  "id" TEXT NOT NULL,
  "attemptId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "selectedChoiceId" TEXT,
  "isCorrect" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "ToeicAttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToeicUserWrongQuestion" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "lastAttemptId" TEXT NOT NULL,
  "wrongCount" INTEGER NOT NULL DEFAULT 1,
  "lastWrongAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ToeicUserWrongQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ToeicQuestionSet_part_type_idx" ON "ToeicQuestionSet"("part", "type");

-- CreateIndex
CREATE UNIQUE INDEX "ToeicQuestionGroup_questionSetId_order_key" ON "ToeicQuestionGroup"("questionSetId", "order");

-- CreateIndex
CREATE INDEX "ToeicQuestionGroup_questionSetId_order_idx" ON "ToeicQuestionGroup"("questionSetId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ToeicQuestion_questionGroupId_order_key" ON "ToeicQuestion"("questionGroupId", "order");

-- CreateIndex
CREATE INDEX "ToeicQuestion_questionGroupId_order_idx" ON "ToeicQuestion"("questionGroupId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ToeicChoice_questionId_label_key" ON "ToeicChoice"("questionId", "label");

-- CreateIndex
CREATE INDEX "ToeicAttempt_userId_submittedAt_idx" ON "ToeicAttempt"("userId", "submittedAt");

-- CreateIndex
CREATE INDEX "ToeicAttempt_questionSetId_idx" ON "ToeicAttempt"("questionSetId");

-- CreateIndex
CREATE UNIQUE INDEX "ToeicAttemptAnswer_attemptId_questionId_key" ON "ToeicAttemptAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "ToeicUserWrongQuestion_userId_questionId_key" ON "ToeicUserWrongQuestion"("userId", "questionId");

-- CreateIndex
CREATE INDEX "ToeicUserWrongQuestion_userId_lastWrongAt_idx" ON "ToeicUserWrongQuestion"("userId", "lastWrongAt");

-- AddForeignKey
ALTER TABLE "ToeicQuestionGroup" ADD CONSTRAINT "ToeicQuestionGroup_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "ToeicQuestionSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicQuestion" ADD CONSTRAINT "ToeicQuestion_questionGroupId_fkey" FOREIGN KEY ("questionGroupId") REFERENCES "ToeicQuestionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicChoice" ADD CONSTRAINT "ToeicChoice_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ToeicQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicAttempt" ADD CONSTRAINT "ToeicAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicAttempt" ADD CONSTRAINT "ToeicAttempt_questionSetId_fkey" FOREIGN KEY ("questionSetId") REFERENCES "ToeicQuestionSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicAttemptAnswer" ADD CONSTRAINT "ToeicAttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "ToeicAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicAttemptAnswer" ADD CONSTRAINT "ToeicAttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ToeicQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicAttemptAnswer" ADD CONSTRAINT "ToeicAttemptAnswer_selectedChoiceId_fkey" FOREIGN KEY ("selectedChoiceId") REFERENCES "ToeicChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicUserWrongQuestion" ADD CONSTRAINT "ToeicUserWrongQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicUserWrongQuestion" ADD CONSTRAINT "ToeicUserWrongQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "ToeicQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ToeicUserWrongQuestion" ADD CONSTRAINT "ToeicUserWrongQuestion_lastAttemptId_fkey" FOREIGN KEY ("lastAttemptId") REFERENCES "ToeicAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
