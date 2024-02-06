/*
  Warnings:

  - You are about to alter the column `authType` on the `UserAuth` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Int`.
  - Added the required column `accessToken` to the `UserAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authId` to the `UserAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `data` to the `UserAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secretToken` to the `UserAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserAuth` ADD COLUMN `accessToken` VARCHAR(191) NOT NULL,
    ADD COLUMN `authId` VARCHAR(191) NOT NULL,
    ADD COLUMN `data` JSON NOT NULL,
    ADD COLUMN `secretToken` VARCHAR(191) NOT NULL,
    MODIFY `authType` INTEGER NOT NULL;
