/*
  Warnings:

  - You are about to drop the column `delivered` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `seen` on the `messages` table. All the data in the column will be lost.
  - Added the required column `isOnline` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastSeenAt` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "messages_conversationId_idx";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "delivered",
DROP COLUMN "seen",
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "seenAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "isOnline" BOOLEAN NOT NULL,
ADD COLUMN     "lastSeenAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt" ASC);
