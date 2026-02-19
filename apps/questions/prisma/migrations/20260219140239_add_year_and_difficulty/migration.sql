-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "difficulty" "Difficulty",
ADD COLUMN     "year" INTEGER;

-- CreateIndex
CREATE INDEX "questions_year_idx" ON "questions"("year");

-- CreateIndex
CREATE INDEX "questions_difficulty_idx" ON "questions"("difficulty");
