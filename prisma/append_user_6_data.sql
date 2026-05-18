-- SQL Script to Append Multiple Deals, Leads, Contacts, Tickets, Activities, etc., for User ID 6
-- Designed to be run safely without deleting or truncating any existing database records.

-- 1. Ensure User 6 exists before inserting related records
INSERT INTO `User` (`id`, `name`, `email`, `password`, `role`, `company`, `createdAt`, `updatedAt`, `managerId`) VALUES
(6, 'Frank Rep', 'frank@crm.com', '$2b$10$KyC1mMLH.qN.fQ0g3yvU7e32c1J3k389O.CjT.3B5N.eE7E3c2P7a', 'REP', 'Schneider Electric', '2026-05-18 10:00:00.000', '2026-05-18 10:00:00.000', 1)
ON DUPLICATE KEY UPDATE `email` = `email`;

-- 2. Insert Pipelines for User 6
-- Pipeline Stages: NOUVEAU, CONTACTE, QUALIFIE, PROPOSITION, NEGOCIATION, GAGNE, PERDU
INSERT INTO `Pipeline` (`id`, `name`, `stage`, `createdAt`, `updatedAt`, `userId`) VALUES
(101, 'Mid-Market Pipeline South', 'NOUVEAU', '2026-05-18 10:05:00.000', '2026-05-18 10:05:00.000', 6),
(102, 'Key Accounts East', 'PROPOSITION', '2026-05-18 10:05:00.000', '2026-05-18 10:05:00.000', 6)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 3. Insert Companies for User 6
-- Industries: TECHNOLOGY, FINANCE, HEALTHCARE, EDUCATION, OTHER
-- Sizes: SMALL, MEDIUM, LARGE
INSERT INTO `Company` (`id`, `name`, `email`, `phone`, `createdAt`, `updatedAt`, `companyIndustry`, `companySize`, `location`, `revenue`, `userId`) VALUES
(101, 'Nova Solutions', 'contact@novasolutions.io', '+1-555-8080', '2026-05-18 10:10:00.000', '2026-05-18 10:10:00.000', 'TECHNOLOGY', 'MEDIUM', 'Chicago', 4200000.00, 6),
(102, 'Sovereign Bancorp', 'info@sovereignb.com', '+1-555-9090', '2026-05-18 10:10:00.000', '2026-05-18 10:10:00.000', 'FINANCE', 'LARGE', 'New York', 78000000.00, 6)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 4. Insert Contacts for User 6
-- Statuses: ACTIVE, INACTIVE
INSERT INTO `Contact` (`id`, `name`, `email`, `phone`, `companyId`, `createdAt`, `updatedAt`, `status`, `userId`) VALUES
(101, 'Marcus Vance', 'marcus.v@novasolutions.io', '+1-555-8081', 101, '2026-05-18 10:15:00.000', '2026-05-18 10:15:00.000', 'ACTIVE', 6),
(102, 'Elena Rostova', 'elena.r@sovereignb.com', '+1-555-9091', 102, '2026-05-18 10:15:00.000', '2026-05-18 10:15:00.000', 'ACTIVE', 6)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 5. Insert Leads for User 6
-- Statuses: NEW, CONTACTED, QUALIFIED, LOST
INSERT INTO `Lead` (`id`, `name`, `email`, `phone`, `status`, `createdAt`, `updatedAt`, `isDeleted`, `probability`, `expectedCloseDate`, `currency`, `dealValue`, `companyId`, `pipelineId`, `userId`) VALUES
(101, 'Lead - Cloud Infrastructure Upgrade', 'lead.cloud@novasolutions.io', '+1-555-8082', 'NEW', '2026-05-18 10:20:00.000', '2026-05-18 10:20:00.000', 0, 10.0, '2026-11-30 12:00:00.000', 'USD', 65000.00, 101, 101, 6),
(102, 'Lead - Core Banking Integration', 'lead.banking@sovereignb.com', '+1-555-9092', 'QUALIFIED', '2026-05-18 10:20:00.000', '2026-05-18 10:25:00.000', 0, 75.0, '2026-10-15 12:00:00.000', 'USD', 320000.00, 102, 102, 6)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 6. Insert LeadContacts Relationship Mapping
INSERT INTO `LeadContact` (`id`, `role`, `createdAt`, `updatedAt`, `contactId`, `leadId`) VALUES
(101, 'Primary Contact', '2026-05-18 10:30:00.000', '2026-05-18 10:30:00.000', 101, 101),
(102, 'Executive Sponsor', '2026-05-18 10:30:00.000', '2026-05-18 10:30:00.000', 102, 102)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 7. Insert Deals for User 6
-- Statuses: PENDING, ACTIVE, WON, LOST, CLOSED, ON_HOLD
INSERT INTO `Deal` (`id`, `name`, `amount`, `probability`, `status`, `expectedCloseDate`, `leadId`, `createdAt`, `updatedAt`, `userId`, `pipelineId`) VALUES
(101, 'Nova Cloud Deal', 65000.00, 10.0, 'PENDING', '2026-11-30 12:00:00.000', 101, '2026-05-18 10:35:00.000', '2026-05-18 10:35:00.000', 6, 101),
(102, 'Sovereign Core Banking Deal', 320000.00, 75.0, 'ACTIVE', '2026-10-15 12:00:00.000', 102, '2026-05-18 10:35:00.000', '2026-05-18 10:35:00.000', 6, 102)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 8. Insert Tasks assigned to / created by User 6
-- Statuses: PENDING, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE
-- Priorities: LOW, MEDIUM, HIGH, CRITICAL
INSERT INTO `Task` (`id`, `title`, `dueDate`, `status`, `priority`, `createdAt`, `updatedAt`, `userId`, `leadId`) VALUES
(101, 'Send Cloud Proposal', '2026-06-01 17:00:00.000', 'PENDING', 'HIGH', '2026-05-18 10:40:00.000', '2026-05-18 10:40:00.000', 6, 101),
(102, 'Schedule technical architecture review', '2026-05-25 10:00:00.000', 'IN_PROGRESS', 'CRITICAL', '2026-05-18 10:40:00.000', '2026-05-18 10:40:00.000', 6, 102)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 9. Insert Notes written by User 6
INSERT INTO `Note` (`id`, `content`, `createdAt`, `updatedAt`, `userId`, `leadId`) VALUES
(101, 'CTO Marcus was highly interested in our hybrid-cloud security standards. Requested case studies.', '2026-05-18 10:45:00.000', '2026-05-18 10:45:00.000', 6, 101),
(102, 'Sovereign Bancorp board has approved budget allocation. Architecture review is a critical gate.', '2026-05-18 10:45:00.000', '2026-05-18 10:45:00.000', 6, 102)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 10. Insert Tickets managed by User 6
-- Statuses: NEW, OPEN, PENDING, RESOLVED, CLOSED
INSERT INTO `Ticket` (`id`, `title`, `description`, `status`, `priority`, `userId`, `leadId`, `contactId`, `createdAt`, `updatedAt`) VALUES
(101, 'Nova Sandbox Access Failure', 'Marcus cannot connect to the allocated AWS staging environment due to IAM permission limits.', 'OPEN', 'HIGH', 6, 101, 101, '2026-05-18 10:50:00.000', '2026-05-18 10:50:00.000'),
(102, 'Sovereign Bancorp SLA Draft request', 'Legal team requires custom high-availability clauses (99.99%) in the master service agreement.', 'NEW', 'MEDIUM', 6, 102, 102, '2026-05-18 10:50:00.000', '2026-05-18 10:50:00.000')
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 11. Insert Activities logged by User 6
INSERT INTO `Activity` (`id`, `type`, `title`, `description`, `entity`, `entityId`, `metadata`, `createdAt`, `updatedAt`, `userId`) VALUES
(101, 'CALL', 'Initial Cloud Discovery Call', 'Introduced our services and discussed their upcoming Azure/AWS infrastructure migration.', 'Lead', 101, '{}', '2026-05-18 10:55:00.000', '2026-05-18 10:55:00.000', 6),
(102, 'MEETING', 'Sovereign Architecture Board Sync', 'Aligned on integration patterns for core banking data flow.', 'Lead', 102, '{}', '2026-05-18 10:55:00.000', '2026-05-18 10:55:00.000', 6)
ON DUPLICATE KEY UPDATE `id` = `id`;

-- 12. Insert Notifications for User 6
INSERT INTO `Notification` (`id`, `userId`, `type`, `message`, `isRead`, `degree`, `relatedId`, `createdAt`, `updatedAt`) VALUES
(101, 6, 'LEAD', 'High priority lead "Core Banking Integration" assigned to you.', 0, 'HIGH', 102, '2026-05-18 11:00:00.000', '2026-05-18 11:00:00.000'),
(102, 6, 'TASK', 'Your task "Schedule technical architecture review" is starting soon.', 0, 'MEDIUM', 102, '2026-05-18 11:00:00.000', '2026-05-18 11:00:00.000')
ON DUPLICATE KEY UPDATE `id` = `id`;
