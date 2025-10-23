/*
  Warnings:

  - The values [Scheduled] on the enum `AppointmentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AppointmentStatus_new" AS ENUM ('SCHEDULE', 'InProgress', 'Completed', 'Cancelled');
ALTER TABLE "appointments" ALTER COLUMN "status" TYPE "AppointmentStatus_new" USING ("status"::text::"AppointmentStatus_new");
ALTER TYPE "AppointmentStatus" RENAME TO "AppointmentStatus_old";
ALTER TYPE "AppointmentStatus_new" RENAME TO "AppointmentStatus";
DROP TYPE "public"."AppointmentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "appointments" ALTER COLUMN "status" SET DEFAULT 'SCHEDULE',
ALTER COLUMN "paymentStatus" SET DEFAULT 'Unpaid';
