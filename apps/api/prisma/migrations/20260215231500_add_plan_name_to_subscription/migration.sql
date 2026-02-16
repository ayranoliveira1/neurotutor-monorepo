-- AlterTable: Add planName column with default for existing rows
ALTER TABLE "subscriptions" ADD COLUMN "planName" TEXT;

-- Backfill existing rows with the plan name from the plans table
UPDATE "subscriptions" SET "planName" = (
  SELECT "name" FROM "plans" WHERE "plans"."id" = "subscriptions"."planId"
);

-- Now make the column required
ALTER TABLE "subscriptions" ALTER COLUMN "planName" SET NOT NULL;
