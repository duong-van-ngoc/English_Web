-- CreateEnum
CREATE TYPE "FileKind" AS ENUM ('AUDIO', 'IMAGE');

-- CreateTable
CREATE TABLE "FileAsset" (
  "id" TEXT NOT NULL,
  "originalName" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "kind" "FileKind" NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "FileAsset_pkey" PRIMARY KEY ("id")
);
