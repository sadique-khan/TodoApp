/*
  Warnings:

  - Added the required column `userEmail` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "userEmail" TEXT NOT NULL;
