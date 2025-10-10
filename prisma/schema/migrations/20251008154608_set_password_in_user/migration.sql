/*
  Warnings:

  - You are about to drop the column `password` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `doctors` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `patients` table. All the data in the column will be lost.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "admins" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "password";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL;
