-- CreateEnum
CREATE TYPE "FocusedStudySessionStatus" AS ENUM ('COMPLETED', 'ABANDONED');

-- CreateTable
CREATE TABLE "focused_study_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "FocusedStudySessionStatus" NOT NULL,
    "pomodoro_interval_mins" INTEGER NOT NULL,
    "break_duration_mins" INTEGER NOT NULL,
    "pomodoros_completed" INTEGER NOT NULL,
    "total_time_spent_seconds" INTEGER NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "focused_study_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "focused_study_sessions_user_id_idx" ON "focused_study_sessions"("user_id");

-- CreateIndex
CREATE INDEX "focused_study_sessions_user_id_created_at_idx" ON "focused_study_sessions"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "focused_study_sessions" ADD CONSTRAINT "focused_study_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
