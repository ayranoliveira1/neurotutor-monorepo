-- AlterTable
ALTER TABLE "exercise_lists" ADD COLUMN     "question_subject_map" JSONB NOT NULL DEFAULT '{}';

-- CreateTable
CREATE TABLE "study_plan_goal_progress" (
    "id" TEXT NOT NULL,
    "study_plan_id" TEXT NOT NULL,
    "goal_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "total_answered" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_goal_progress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "study_plan_goal_progress_study_plan_id_idx" ON "study_plan_goal_progress"("study_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_plan_goal_progress_study_plan_id_subject_key" ON "study_plan_goal_progress"("study_plan_id", "subject");

-- AddForeignKey
ALTER TABLE "study_plan_goal_progress" ADD CONSTRAINT "study_plan_goal_progress_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
