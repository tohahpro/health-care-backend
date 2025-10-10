/*
  Warnings:

  - Added the required column `password` to the `admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `doctors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "doctors" ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "password" TEXT NOT NULL;
