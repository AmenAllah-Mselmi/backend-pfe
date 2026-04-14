/*
  Warnings:

  - Added the required column `numberOfRows` to the `CsvImport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `csvimport` ADD COLUMN `numberOfRows` INTEGER NOT NULL;
