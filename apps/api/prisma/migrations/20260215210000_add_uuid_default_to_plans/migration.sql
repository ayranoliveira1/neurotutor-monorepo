-- AlterTable: add database-level UUID default to plans.id
ALTER TABLE "plans" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
