-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "external_id" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "image_url" TEXT,
    "alternatives" JSONB NOT NULL,
    "origin" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "categories" JSONB NOT NULL,
    "correct_answer" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "questions_external_id_key" ON "questions"("external_id");

-- CreateIndex
CREATE INDEX "questions_subject_idx" ON "questions"("subject");

-- CreateIndex
CREATE INDEX "questions_origin_idx" ON "questions"("origin");
