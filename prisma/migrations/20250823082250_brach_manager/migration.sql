-- AlterTable
ALTER TABLE "branches" ADD COLUMN     "managerId" TEXT;

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "profiles"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
