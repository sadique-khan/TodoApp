-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "assignedToUserEmail" TEXT;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_assignedToUserEmail_fkey" FOREIGN KEY ("assignedToUserEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
