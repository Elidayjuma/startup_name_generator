-- CreateTable
CREATE TABLE `linkedin_profiles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `linkedin_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `given_name` VARCHAR(191) NULL,
    `family_name` VARCHAR(191) NULL,
    `picture` VARCHAR(191) NULL,
    `locale` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `linkedin_profiles_linkedin_id_key`(`linkedin_id`),
    UNIQUE INDEX `linkedin_profiles_email_key`(`email`),
    UNIQUE INDEX `linkedin_profiles_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `linkedin_profiles` ADD CONSTRAINT `linkedin_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
