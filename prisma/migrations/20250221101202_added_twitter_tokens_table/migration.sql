-- CreateTable
CREATE TABLE `twitter_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `oauth_token` LONGTEXT NULL,
    `oauth_token_secret` LONGTEXT NULL,
    `accesstoken` LONGTEXT NULL,
    `expiry` DATETIME(3) NULL,
    `refresh_token` LONGTEXT NULL,
    `token_type` VARCHAR(191) NULL,
    `accesssecret` LONGTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `twitter_tokens_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `twitter_tokens` ADD CONSTRAINT `twitter_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
