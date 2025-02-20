/*
  Warnings:

  - Made the column `featureLimit` on table `subscription_features` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `subscription_features` MODIFY `featureLimit` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `linkedin_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `access_token` LONGTEXT NULL,
    `expiry` DATETIME(3) NULL,
    `refresh_token` LONGTEXT NULL,
    `token_type` VARCHAR(191) NULL,
    `id_token` LONGTEXT NULL,
    `scope` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `linkedin_tokens` ADD CONSTRAINT `linkedin_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
