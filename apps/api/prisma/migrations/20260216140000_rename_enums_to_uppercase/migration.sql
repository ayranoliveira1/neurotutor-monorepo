-- Rename Roles enum values to uppercase
ALTER TYPE "Roles" RENAME VALUE 'Admin' TO 'ADMIN';
ALTER TYPE "Roles" RENAME VALUE 'Student' TO 'STUDENT';
ALTER TYPE "Roles" RENAME VALUE 'Teacher' TO 'TEACHER';

-- Rename BillingCycle enum values to uppercase
ALTER TYPE "BillingCycle" RENAME VALUE 'Weekly' TO 'WEEKLY';
ALTER TYPE "BillingCycle" RENAME VALUE 'Monthly' TO 'MONTHLY';
ALTER TYPE "BillingCycle" RENAME VALUE 'Yearly' TO 'YEARLY';
