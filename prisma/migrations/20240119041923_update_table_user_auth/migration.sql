/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `profileUsername` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `username`;

-- AlterTable
ALTER TABLE `UserAuth` ADD COLUMN `profileUsername` VARCHAR(191) NOT NULL;
