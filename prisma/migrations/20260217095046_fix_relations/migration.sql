/*
  Warnings:

  - You are about to drop the column `company` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `expectedCloseDtae` on the `deal` table. All the data in the column will be lost.
  - Added the required column `expectedCloseDate` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadId` to the `Deal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactId` to the `LeadContact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `leadId` to the `LeadContact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `contact` DROP COLUMN `company`,
    ADD COLUMN `companyId` INTEGER NULL;

-- AlterTable
ALTER TABLE `deal` DROP COLUMN `expectedCloseDtae`,
    ADD COLUMN `expectedCloseDate` DATETIME(3) NOT NULL,
    ADD COLUMN `leadId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `lead` ADD COLUMN `pipelineId` INTEGER NULL;

-- AlterTable
ALTER TABLE `leadcontact` ADD COLUMN `contactId` INTEGER NOT NULL,
    ADD COLUMN `leadId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ticket` ADD COLUMN `contactId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_pipelineId_fkey` FOREIGN KEY (`pipelineId`) REFERENCES `Pipeline`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contact` ADD CONSTRAINT `Contact_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Ticket` ADD CONSTRAINT `Ticket_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Deal` ADD CONSTRAINT `Deal_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadContact` ADD CONSTRAINT `LeadContact_contactId_fkey` FOREIGN KEY (`contactId`) REFERENCES `Contact`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeadContact` ADD CONSTRAINT `LeadContact_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
