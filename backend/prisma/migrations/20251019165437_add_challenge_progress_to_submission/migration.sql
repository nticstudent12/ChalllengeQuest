-- AlterTable
ALTER TABLE "submissions" ADD COLUMN     "challengeProgressId" TEXT;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_challengeProgressId_fkey" FOREIGN KEY ("challengeProgressId") REFERENCES "challenge_progress"("id") ON DELETE CASCADE ON UPDATE CASCADE;
