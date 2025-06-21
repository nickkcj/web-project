/*
  # Add favorites table

  1. New Tables
    - `Favorite`
      - `id` (int, primary key, auto increment)
      - `userId` (int, foreign key to User)
      - `movieId` (int, foreign key to Movie)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)

  2. Security
    - Enable RLS on `Favorite` table
    - Add unique constraint on userId and movieId
    - Add foreign key constraints

  3. Changes
    - Users can now favorite movies
    - Each user can only favorite a movie once
*/

CREATE TABLE IF NOT EXISTS "Favorite" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "movieId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- Create unique constraint to prevent duplicate favorites
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_movieId_key" ON "Favorite"("userId", "movieId");

-- Add foreign key constraints
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;