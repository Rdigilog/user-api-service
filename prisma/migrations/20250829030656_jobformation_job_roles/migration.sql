-- AlterTable
ALTER TABLE "job_information" ADD COLUMN     "jobRoleId" TEXT;

-- AddForeignKey
ALTER TABLE "job_information" ADD CONSTRAINT "job_information_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
