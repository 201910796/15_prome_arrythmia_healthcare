-- AlterTable
ALTER TABLE `chat_comments` ADD COLUMN `is_diag` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `is_recommend` BOOLEAN NULL DEFAULT false;
