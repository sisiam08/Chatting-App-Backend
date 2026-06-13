/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "password",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "isOnline" SET DEFAULT false,
ALTER COLUMN "lastSeenAt" DROP NOT NULL;
