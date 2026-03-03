-- CreateTable
CREATE TABLE "notification_recipients" (
    "id" TEXT NOT NULL,
    "notification_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_recipients_user_id_idx" ON "notification_recipients"("user_id");

-- CreateIndex
CREATE INDEX "notification_recipients_notification_id_idx" ON "notification_recipients"("notification_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_recipients_notification_id_user_id_key" ON "notification_recipients"("notification_id", "user_id");

-- Data migration: extract JSON destination to normalized table
INSERT INTO "notification_recipients" ("id", "notification_id", "user_id", "read_at", "created_at")
SELECT
  gen_random_uuid(),
  n.id,
  (r->>'userId')::text,
  CASE
    WHEN r->>'readAt' IS NOT NULL AND r->>'readAt' != 'null'
    THEN (r->>'readAt')::timestamp
    ELSE NULL
  END,
  n."createdAt"
FROM "notifications" n,
     jsonb_array_elements(n."destination"->'sendIds') AS r
WHERE EXISTS (
  SELECT 1 FROM "users" u WHERE u.id = (r->>'userId')::text
);

-- AlterTable: drop old JSON column
ALTER TABLE "notifications" DROP COLUMN "destination";

-- AddForeignKey
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
