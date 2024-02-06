-- AlterTable
ALTER TABLE `UserAuth` MODIFY `accessToken` VARCHAR(191) NULL,
    MODIFY `data` JSON NULL,
    MODIFY `secretToken` VARCHAR(191) NULL;
