/*
  Warnings:

  - A unique constraint covering the columns `[directKey]` on the table `conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "directKey" TEXT;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "delivered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "conversations_directKey_key" ON "conversations"("directKey");
