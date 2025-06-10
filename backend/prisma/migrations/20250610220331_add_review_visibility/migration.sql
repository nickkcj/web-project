-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC';
