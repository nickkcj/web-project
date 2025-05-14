/*
  Warnings:

  - You are about to drop the `Movie` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_movieId_fkey";

-- DropTable
DROP TABLE "Movie";
