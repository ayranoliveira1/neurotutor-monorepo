-- CreateEnum
CREATE TYPE "ExerciseListStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'FINISHED');

-- CreateTable
CREATE TABLE "exercise_lists" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shuffle_questions" BOOLEAN NOT NULL DEFAULT false,
    "ignore_answered" BOOLEAN NOT NULL DEFAULT false,
    "sections" JSONB NOT NULL,
    "question_ids" JSONB NOT NULL,
    "total_questions" INTEGER NOT NULL,
    "status" "ExerciseListStatus" NOT NULL DEFAULT 'PENDING',
    "correct_count" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exercise_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercise_answers" (
    "id" TEXT NOT NULL,
    "exercise_list_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "selected_answer" INTEGER NOT NULL,
    "is_correct" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "exercise_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "exercise_lists_user_id_idx" ON "exercise_lists"("user_id");

-- CreateIndex
CREATE INDEX "exercise_answers_exercise_list_id_idx" ON "exercise_answers"("exercise_list_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercise_answers_exercise_list_id_question_id_key" ON "exercise_answers"("exercise_list_id", "question_id");

-- AddForeignKey
ALTER TABLE "exercise_lists" ADD CONSTRAINT "exercise_lists_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercise_answers" ADD CONSTRAINT "exercise_answers_exercise_list_id_fkey" FOREIGN KEY ("exercise_list_id") REFERENCES "exercise_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
