-- CreateEnum
CREATE TYPE "StudyPlanStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "study_plans" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "StudyPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "study_plan_goals" (
    "id" TEXT NOT NULL,
    "study_plan_id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "weekly_questions_target" INTEGER NOT NULL,
    "target_accuracy_percent" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "study_plan_goals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "study_plans_user_id_idx" ON "study_plans"("user_id");

-- CreateIndex
CREATE INDEX "study_plans_user_id_status_idx" ON "study_plans"("user_id", "status");

-- CreateIndex
CREATE INDEX "study_plan_goals_study_plan_id_idx" ON "study_plan_goals"("study_plan_id");

-- CreateIndex
CREATE UNIQUE INDEX "study_plan_goals_study_plan_id_subject_key" ON "study_plan_goals"("study_plan_id", "subject");

-- AddForeignKey
ALTER TABLE "study_plans" ADD CONSTRAINT "study_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "study_plan_goals" ADD CONSTRAINT "study_plan_goals_study_plan_id_fkey" FOREIGN KEY ("study_plan_id") REFERENCES "study_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
