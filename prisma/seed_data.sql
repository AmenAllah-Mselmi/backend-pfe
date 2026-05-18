-- Seeding Script for CRM Database (MySQL)
-- Reusable: Truncates existing tables and inserts complete mock datasets

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Truncate all tables in proper reverse-relationship order
TRUNCATE TABLE `Notification`;
TRUNCATE TABLE `Activity`;
TRUNCATE TABLE `LeadContact`;
TRUNCATE TABLE `Ticket`;
TRUNCATE TABLE `Note`;
TRUNCATE TABLE `Task`;
TRUNCATE TABLE `Deal`;
TRUNCATE TABLE `Lead`;
TRUNCATE TABLE `Contact`;
TRUNCATE TABLE `Company`;
TRUNCATE TABLE `Pipeline`;
TRUNCATE TABLE `Message`;
TRUNCATE TABLE `Chat`;
TRUNCATE TABLE `User`;

SET FOREIGN_KEY_CHECKS = 1;

-- 2. Insert Users
-- Roles: ADMIN, REP
-- Passwords are set to bcrypt hash of 'password123'
INSERT INTO `User` (`id`, `name`, `email`, `password`, `role`, `company`, `createdAt`, `updatedAt`, `managerId`) VALUES
(1, 'Alice Admin', 'alice@crm.com', '$2b$10$KyC1mMLH.qN.fQ0g3yvU7e32c1J3k389O.CjT.3B5N.eE7E3c2P7a', 'ADMIN', 'Schneider Electric', '2026-01-10 09:00:00.000', '2026-01-10 09:00:00.000', NULL),
(2, 'Bob Rep', 'bob@crm.com', '$2b$10$KyC1mMLH.qN.fQ0g3yvU7e32c1J3k389O.CjT.3B5N.eE7E3c2P7a', 'REP', 'Schneider Electric', '2026-01-11 10:00:00.000', '2026-01-11 10:00:00.000', 1),
(3, 'Clara Rep', 'clara@crm.com', '$2b$10$KyC1mMLH.qN.fQ0g3yvU7e32c1J3k389O.CjT.3B5N.eE7E3c2P7a', 'REP', 'Schneider Electric', '2026-01-12 11:00:00.000', '2026-01-12 11:00:00.000', 1),
(4, 'David Rep', 'david@crm.com', '$2b$10$KyC1mMLH.qN.fQ0g3yvU7e32c1J3k389O.CjT.3B5N.eE7E3c2P7a', 'REP', 'Schneider Electric', '2026-01-13 14:00:00.000', '2026-01-13 14:00:00.000', 1),
(5, 'Emma Rep', 'emma@crm.com', '$2b$10$KyC1mMLH.qN.fQ0g3yvU7e32c1J3k389O.CjT.3B5N.eE7E3c2P7a', 'REP', 'Schneider Electric', '2026-01-14 09:30:00.000', '2026-01-14 09:30:00.000', 1);

-- 3. Insert Pipelines
-- Pipeline Stages: NOUVEAU, CONTACTE, QUALIFIE, PROPOSITION, NEGOCIATION, GAGNE, PERDU
INSERT INTO `Pipeline` (`id`, `name`, `stage`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, 'Sales Pipeline East', 'NOUVEAU', '2026-01-15 10:00:00.000', '2026-01-15 10:00:00.000', 2),
(2, 'Enterprise Deals', 'PROPOSITION', '2026-01-16 11:00:00.000', '2026-01-16 11:00:00.000', 2),
(3, 'SME Pipeline North', 'CONTACTE', '2026-01-17 09:00:00.000', '2026-01-17 09:00:00.000', 3),
(4, 'Govt Contracts', 'NEGOCIATION', '2026-01-18 14:00:00.000', '2026-01-18 14:00:00.000', 3),
(5, 'Direct Sales West', 'QUALIFIE', '2026-01-19 15:30:00.000', '2026-01-19 15:30:00.000', 4),
(6, 'Partner Channel', 'GAGNE', '2026-01-20 16:00:00.000', '2026-01-20 16:00:00.000', 4),
(7, 'Global Accounts', 'PROPOSITION', '2026-01-21 10:45:00.000', '2026-01-21 10:45:00.000', 5),
(8, 'Inbound Leads', 'NOUVEAU', '2026-01-22 11:15:00.000', '2026-01-22 11:15:00.000', 5),
(9, 'Outbound Campaign 2026', 'CONTACTE', '2026-01-23 09:45:00.000', '2026-01-23 09:45:00.000', 2),
(10, 'Renewals Pipeline', 'GAGNE', '2026-01-24 13:20:00.000', '2026-01-24 13:20:00.000', 3);

-- 4. Insert Companies
-- Industries: TECHNOLOGY, FINANCE, HEALTHCARE, EDUCATION, OTHER
-- Sizes: SMALL, MEDIUM, LARGE
INSERT INTO `Company` (`id`, `name`, `email`, `phone`, `createdAt`, `updatedAt`, `companyIndustry`, `companySize`, `location`, `revenue`, `userId`) VALUES
(1, 'TechGlobal Corp', 'contact@techglobal.com', '+1-555-0199', '2026-02-01 08:00:00.000', '2026-02-01 08:00:00.000', 'TECHNOLOGY', 'LARGE', 'San Francisco', 5400000.00, 2),
(2, 'FinancePulse', 'info@financepulse.com', '+44-20-7946-0192', '2026-02-02 09:30:00.000', '2026-02-02 09:30:00.000', 'FINANCE', 'LARGE', 'London', 12500000.00, 2),
(3, 'MediCare Solutions', 'admin@medicaresolutions.com', '+33-1-4227-7890', '2026-02-03 10:15:00.000', '2026-02-03 10:15:00.000', 'HEALTHCARE', 'MEDIUM', 'Paris', 2300000.00, 3),
(4, 'EduLearn Academy', 'hello@edulearn.org', '+216-71-123456', '2026-02-04 11:00:00.000', '2026-02-04 11:00:00.000', 'EDUCATION', 'SMALL', 'Tunis', 450000.00, 3),
(5, 'Apex Retailers', 'support@apexretail.com', '+49-30-1234567', '2026-02-05 14:20:00.000', '2026-02-05 14:20:00.000', 'OTHER', 'MEDIUM', 'Berlin', 3800000.00, 4),
(6, 'Future Solutions', 'partners@futuresolutions.io', '+1-555-0245', '2026-02-06 15:45:00.000', '2026-02-06 15:45:00.000', 'TECHNOLOGY', 'SMALL', 'Boston', 890000.00, 4),
(7, 'Quantum Capital', 'deals@quantumcapital.com', '+81-3-5555-0143', '2026-02-07 09:10:00.000', '2026-02-07 09:10:00.000', 'FINANCE', 'LARGE', 'Tokyo', 45000000.00, 5),
(8, 'BioHealth Lab', 'research@biohealth.net', '+41-22-789-0123', '2026-02-08 10:40:00.000', '2026-02-08 10:40:00.000', 'HEALTHCARE', 'SMALL', 'Geneva', 1200000.00, 5),
(9, 'SmartEdu Group', 'contact@smartedugroup.com', '+86-10-8230-1234', '2026-02-09 11:25:00.000', '2026-02-09 11:25:00.000', 'EDUCATION', 'LARGE', 'Beijing', 8200000.00, 2),
(10, 'GreenEnergy Co', 'info@greenenergy.com', '+31-20-555-0199', '2026-02-10 13:50:00.000', '2026-02-10 13:50:00.000', 'OTHER', 'LARGE', 'Amsterdam', 15600000.00, 3),
(11, 'DevStudio Inc', 'hello@devstudio.com', '+1-555-0123', '2026-02-11 16:10:00.000', '2026-02-11 16:10:00.000', 'TECHNOLOGY', 'MEDIUM', 'Austin', 2100000.00, 4),
(12, 'SafeFinance', 'support@safefinance.ca', '+1-416-555-0144', '2026-02-12 10:30:00.000', '2026-02-12 10:30:00.000', 'FINANCE', 'SMALL', 'Toronto', 950000.00, 5),
(13, 'Novartis Pharma', 'contact@novartispharma.com', '+41-61-324-1111', '2026-02-13 14:15:00.000', '2026-02-13 14:15:00.000', 'HEALTHCARE', 'LARGE', 'Basel', 52000000.00, 2),
(14, 'LearnOnline', 'info@learnonline.fr', '+33-1-5555-6677', '2026-02-14 15:20:00.000', '2026-02-14 15:20:00.000', 'EDUCATION', 'SMALL', 'Lyon', 300000.00, 3),
(15, 'Global Logistics', 'sales@globallogistics.com', '+65-6789-0123', '2026-02-15 09:05:00.000', '2026-02-15 09:05:00.000', 'OTHER', 'LARGE', 'Singapore', 18400000.00, 4);

-- 5. Insert Contacts
-- Statuses: ACTIVE, INACTIVE
INSERT INTO `Contact` (`id`, `name`, `email`, `phone`, `companyId`, `createdAt`, `updatedAt`, `status`, `userId`) VALUES
(1, 'John Doe', 'john.doe@techglobal.com', '+1-555-0101', 1, '2026-02-10 10:00:00.000', '2026-02-10 10:00:00.000', 'ACTIVE', 2),
(2, 'Jane Smith', 'jane.smith@techglobal.com', '+1-555-0102', 1, '2026-02-10 10:30:00.000', '2026-02-10 10:30:00.000', 'ACTIVE', 2),
(3, 'Michael Brown', 'm.brown@financepulse.com', '+44-20-7946-0200', 2, '2026-02-11 11:00:00.000', '2026-02-11 11:00:00.000', 'ACTIVE', 2),
(4, 'Sarah Davis', 's.davis@financepulse.com', '+44-20-7946-0201', 2, '2026-02-11 11:30:00.000', '2026-02-11 11:30:00.000', 'ACTIVE', 2),
(5, 'Pierre Martin', 'p.martin@medicaresolutions.com', '+33-1-4227-1111', 3, '2026-02-12 09:00:00.000', '2026-02-12 09:00:00.000', 'ACTIVE', 3),
(6, 'Sophie Dubois', 's.dubois@medicaresolutions.com', '+33-1-4227-2222', 3, '2026-02-12 09:45:00.000', '2026-02-12 09:45:00.000', 'ACTIVE', 3),
(7, 'Amine Ben Youssef', 'amine.by@edulearn.org', '+216-98-123456', 4, '2026-02-13 14:00:00.000', '2026-02-13 14:00:00.000', 'ACTIVE', 3),
(8, 'Leila Trabelsi', 'leila.t@edulearn.org', '+216-98-654321', 4, '2026-02-13 14:30:00.000', '2026-02-13 14:30:00.000', 'ACTIVE', 3),
(9, 'Hans Schmidt', 'h.schmidt@apexretail.com', '+49-30-9988776', 5, '2026-02-14 15:00:00.000', '2026-02-14 15:00:00.000', 'ACTIVE', 4),
(10, 'Emma Mueller', 'e.mueller@apexretail.com', '+49-30-5544332', 5, '2026-02-14 15:20:00.000', '2026-02-14 15:20:00.000', 'ACTIVE', 4),
(11, 'Alex Johnson', 'alex@futuresolutions.io', '+1-555-0320', 6, '2026-02-15 10:15:00.000', '2026-02-15 10:15:00.000', 'ACTIVE', 4),
(12, 'Rachel Green', 'rachel@futuresolutions.io', '+1-555-0321', 6, '2026-02-15 10:45:00.000', '2026-02-15 10:45:00.000', 'ACTIVE', 4),
(13, 'Kenji Tanaka', 'tanaka@quantumcapital.com', '+81-3-5555-0210', 7, '2026-02-16 09:00:00.000', '2026-02-16 09:00:00.000', 'ACTIVE', 5),
(14, 'Yuki Sato', 'yuki.sato@quantumcapital.com', '+81-3-5555-0220', 7, '2026-02-16 09:40:00.000', '2026-02-16 09:40:00.000', 'ACTIVE', 5),
(15, 'Dr. Beat Voigt', 'voigt@biohealth.net', '+41-22-789-0200', 8, '2026-02-17 11:10:00.000', '2026-02-17 11:10:00.000', 'ACTIVE', 5),
(16, 'Helen Keller', 'h.keller@biohealth.net', '+41-22-789-0300', 8, '2026-02-17 11:30:00.000', '2026-02-17 11:30:00.000', 'ACTIVE', 5),
(17, 'Li Wei', 'li.wei@smartedugroup.com', '+86-10-8230-4321', 9, '2026-02-18 13:40:00.000', '2026-02-18 13:40:00.000', 'ACTIVE', 2),
(18, 'Wang Min', 'wang.m@smartedugroup.com', '+86-10-8230-5432', 9, '2026-02-18 14:05:00.000', '2026-02-18 14:05:00.000', 'ACTIVE', 2),
(19, 'Sven de Jong', 's.dejong@greenenergy.nl', '+31-20-555-0210', 10, '2026-02-19 14:50:00.000', '2026-02-19 14:50:00.000', 'ACTIVE', 3),
(20, 'Anika Visser', 'a.visser@greenenergy.nl', '+31-20-555-0220', 10, '2026-02-19 15:10:00.000', '2026-02-19 15:10:00.000', 'ACTIVE', 3),
(21, 'Kevin Costner', 'k.costner@devstudio.com', '+1-555-0155', 11, '2026-02-20 10:15:00.000', '2026-02-20 10:15:00.000', 'ACTIVE', 4),
(22, 'Julia Roberts', 'j.roberts@devstudio.com', '+1-555-0166', 11, '2026-02-20 10:45:00.000', '2026-02-20 10:45:00.000', 'ACTIVE', 4),
(23, 'Jim Carrey', 'j.carrey@safefinance.ca', '+1-416-555-0255', 12, '2026-02-21 09:20:00.000', '2026-02-21 09:20:00.000', 'ACTIVE', 5),
(24, 'Mary Poppins', 'mary.poppins@safefinance.ca', '+1-416-555-0266', 12, '2026-02-21 09:50:00.000', '2026-02-21 09:50:00.000', 'ACTIVE', 5),
(25, 'Thomas Mueller', 't.mueller@novartispharma.com', '+41-61-324-2222', 13, '2026-02-22 14:20:00.000', '2026-02-22 14:20:00.000', 'ACTIVE', 2),
(26, 'Ursula Andress', 'ursula@novartispharma.com', '+41-61-324-3333', 13, '2026-02-22 14:50:00.000', '2026-02-22 14:50:00.000', 'ACTIVE', 2),
(27, 'Jean Dupont', 'j.dupont@learnonline.fr', '+33-1-5555-9900', 14, '2026-02-23 15:30:00.000', '2026-02-23 15:30:00.000', 'ACTIVE', 3),
(28, 'Claire Chazal', 'claire@learnonline.fr', '+33-1-5555-9911', 14, '2026-02-23 15:55:00.000', '2026-02-23 15:55:00.000', 'ACTIVE', 3),
(29, 'Lee Kuan Yew', 'leeky@globallogistics.com', '+65-6789-0210', 15, '2026-02-24 10:00:00.000', '2026-02-24 10:00:00.000', 'ACTIVE', 4),
(30, 'Halimah Yacob', 'halimah@globallogistics.com', '+65-6789-0220', 15, '2026-02-24 10:30:00.000', '2026-02-24 10:30:00.000', 'INACTIVE', 4);

-- 6. Insert Leads
-- Statuses: NEW, CONTACTED, QUALIFIED, LOST
INSERT INTO `Lead` (`id`, `name`, `email`, `phone`, `status`, `createdAt`, `updatedAt`, `isDeleted`, `probability`, `expectedCloseDate`, `currency`, `dealValue`, `companyId`, `pipelineId`, `userId`) VALUES
(1, 'Lead - ERP Implementation', 'lead.erp@techglobal.com', '+1-555-0150', 'NEW', '2026-03-01 09:00:00.000', '2026-03-01 09:00:00.000', 0, 10.0, '2026-07-15 12:00:00.000', 'USD', 25000.00, 1, 1, 2),
(2, 'Lead - Cloud Migration', 'lead.cloud@techglobal.com', '+1-555-0151', 'CONTACTED', '2026-03-02 10:30:00.000', '2026-03-10 14:00:00.000', 0, 30.0, '2026-08-30 12:00:00.000', 'USD', 48000.00, 1, 1, 2),
(3, 'Lead - Big Data Analytics', 'lead.data@financepulse.com', '+44-20-7946-0300', 'QUALIFIED', '2026-03-03 11:15:00.000', '2026-03-15 16:30:00.000', 0, 60.0, '2026-06-30 12:00:00.000', 'USD', 85000.00, 2, 2, 2),
(4, 'Lead - Cyber Security Audit', 'lead.cyber@financepulse.com', '+44-20-7946-0301', 'NEW', '2026-03-04 14:00:00.000', '2026-03-04 14:00:00.000', 0, 5.0, '2026-09-15 12:00:00.000', 'USD', 15000.00, 2, 9, 2),
(5, 'Lead - Medical Equip Procurement', 'lead.med@medicaresolutions.com', '+33-1-4227-3333', 'QUALIFIED', '2026-03-05 09:30:00.000', '2026-03-20 10:00:00.000', 0, 70.0, '2026-06-15 12:00:00.000', 'EUR', 120000.00, 3, 3, 3),
(6, 'Lead - Patient Management System', 'lead.pms@medicaresolutions.com', '+33-1-4227-4444', 'LOST', '2026-03-06 10:45:00.000', '2026-04-05 11:00:00.000', 0, 0.0, '2026-05-01 12:00:00.000', 'EUR', 35000.00, 3, 3, 3),
(7, 'Lead - Interactive Whiteboards', 'lead.whiteboard@edulearn.org', '+216-98-111111', 'CONTACTED', '2026-03-07 14:15:00.000', '2026-03-25 15:30:00.000', 0, 25.0, '2026-08-01 12:00:00.000', 'USD', 8000.00, 4, 10, 3),
(8, 'Lead - LMS Customization', 'lead.lms@edulearn.org', '+216-98-222222', 'QUALIFIED', '2026-03-08 15:00:00.000', '2026-04-10 16:00:00.000', 0, 50.0, '2026-07-01 12:00:00.000', 'USD', 18000.00, 4, 3, 3),
(9, 'Lead - POS System Rollout', 'lead.pos@apexretail.com', '+49-30-1112223', 'NEW', '2026-03-09 10:00:00.000', '2026-03-09 10:00:00.000', 0, 10.0, '2026-10-31 12:00:00.000', 'EUR', 65000.00, 5, 5, 4),
(10, 'Lead - Inventory Optimization', 'lead.inv@apexretail.com', '+49-30-3334445', 'CONTACTED', '2026-03-10 11:20:00.000', '2026-03-28 13:40:00.000', 0, 40.0, '2026-09-30 12:00:00.000', 'EUR', 42000.00, 5, 5, 4),
(11, 'Lead - Custom App Development', 'lead.app@futuresolutions.io', '+1-555-0450', 'QUALIFIED', '2026-03-11 13:00:00.000', '2026-04-12 14:15:00.000', 0, 65.0, '2026-06-25 12:00:00.000', 'USD', 30000.00, 6, 5, 4),
(12, 'Lead - AI Chatbot Integration', 'lead.bot@futuresolutions.io', '+1-555-0451', 'NEW', '2026-03-12 14:45:00.000', '2026-03-12 14:45:00.000', 0, 5.0, '2026-11-30 12:00:00.000', 'USD', 12000.00, 6, 5, 4),
(13, 'Lead - Wealth Mgmt Platform', 'lead.wealth@quantumcapital.com', '+81-3-5555-0310', 'QUALIFIED', '2026-03-13 09:15:00.000', '2026-04-18 10:20:00.000', 0, 80.0, '2026-06-20 12:00:00.000', 'USD', 250000.00, 7, 7, 5),
(14, 'Lead - Risk Analysis Tool', 'lead.risk@quantumcapital.com', '+81-3-5555-0320', 'NEW', '2026-03-14 10:30:00.000', '2026-03-14 10:30:00.000', 0, 10.0, '2026-12-15 12:00:00.000', 'USD', 95000.00, 7, 8, 5),
(15, 'Lead - LIMS Software License', 'lead.lims@biohealth.net', '+41-22-789-0400', 'CONTACTED', '2026-03-15 11:00:00.000', '2026-04-02 12:30:00.000', 0, 35.0, '2026-08-15 12:00:00.000', 'CHF', 55000.00, 8, 8, 5),
(16, 'Lead - Lab Automation IoT', 'lead.lab@biohealth.net', '+41-22-789-0500', 'QUALIFIED', '2026-03-16 15:20:00.000', '2026-04-20 16:40:00.000', 0, 60.0, '2026-07-31 12:00:00.000', 'CHF', 110000.00, 8, 7, 5),
(17, 'Lead - Virtual Classroom Licenses', 'lead.virtual@smartedugroup.com', '+86-10-8230-6543', 'NEW', '2026-03-17 16:00:00.000', '2026-03-17 16:00:00.000', 0, 15.0, '2026-10-15 12:00:00.000', 'USD', 40000.00, 9, 8, 2),
(18, 'Lead - School ERP Upgrade', 'lead.school@smartedugroup.com', '+86-10-8230-7654', 'CONTACTED', '2026-03-18 10:15:00.000', '2026-04-08 11:30:00.000', 0, 45.0, '2026-09-01 12:00:00.000', 'USD', 32000.00, 9, 9, 2),
(19, 'Lead - Wind Turbine Monitoring', 'lead.wind@greenenergy.nl', '+31-20-555-0310', 'QUALIFIED', '2026-03-19 11:00:00.000', '2026-04-22 13:15:00.000', 0, 70.0, '2026-07-10 12:00:00.000', 'EUR', 140000.00, 10, 4, 3),
(20, 'Lead - Smart Grid Integration', 'lead.grid@greenenergy.nl', '+31-20-555-0320', 'NEW', '2026-03-20 14:30:00.000', '2026-03-20 14:30:00.000', 0, 10.0, '2026-11-15 12:00:00.000', 'EUR', 95000.00, 10, 3, 3),
(21, 'Lead - Dedicated Dev Team', 'lead.team@devstudio.com', '+1-555-0250', 'QUALIFIED', '2026-03-21 15:45:00.000', '2026-04-25 16:50:00.000', 0, 75.0, '2026-06-30 12:00:00.000', 'USD', 75000.00, 11, 5, 4),
(22, 'Lead - DevOps Automation', 'lead.devops@devstudio.com', '+1-555-0260', 'LOST', '2026-03-22 09:10:00.000', '2026-04-15 10:30:00.000', 0, 0.0, '2026-05-01 12:00:00.000', 'USD', 28000.00, 11, 5, 4),
(23, 'Lead - Security Auditing Tool', 'lead.audit@safefinance.ca', '+1-416-555-0350', 'CONTACTED', '2026-03-23 10:20:00.000', '2026-04-10 11:45:00.000', 0, 30.0, '2026-08-31 12:00:00.000', 'USD', 36000.00, 12, 8, 5),
(24, 'Lead - Penetration Testing Service', 'lead.pen@safefinance.ca', '+1-416-555-0360', 'NEW', '2026-03-24 11:40:00.000', '2026-03-24 11:40:00.000', 0, 5.0, '2026-12-01 12:00:00.000', 'USD', 18000.00, 12, 8, 5),
(25, 'Lead - SAP Integration Phase 2', 'lead.sap@novartispharma.com', '+41-61-324-4444', 'QUALIFIED', '2026-03-25 13:50:00.000', '2026-04-28 15:20:00.000', 0, 85.0, '2026-06-15 12:00:00.000', 'CHF', 180000.00, 13, 2, 2),
(26, 'Lead - Pharma Analytics Dashboard', 'lead.pharma@novartispharma.com', '+41-61-324-5555', 'NEW', '2026-03-26 14:15:00.000', '2026-03-26 14:15:00.000', 0, 10.0, '2027-01-15 12:00:00.000', 'CHF', 92000.00, 13, 1, 2),
(27, 'Lead - LMS Hosting and Support', 'lead.hosting@learnonline.fr', '+33-1-5555-0011', 'CONTACTED', '2026-03-27 15:30:00.000', '2026-04-12 16:45:00.000', 0, 40.0, '2026-07-31 12:00:00.000', 'EUR', 15000.00, 14, 10, 3),
(28, 'Lead - Course Digitization Service', 'lead.digit@learnonline.fr', '+33-1-5555-0022', 'QUALIFIED', '2026-03-28 09:20:00.000', '2026-05-02 10:15:00.000', 0, 60.0, '2026-06-30 12:00:00.000', 'EUR', 22000.00, 14, 3, 3),
(29, 'Lead - Fleet Management System', 'lead.fleet@globallogistics.com', '+65-6789-0310', 'NEW', '2026-03-29 10:45:00.000', '2026-03-29 10:45:00.000', 0, 10.0, '2026-10-31 12:00:00.000', 'USD', 70000.00, 15, 5, 4),
(30, 'Lead - Warehouse Automation IoT', 'lead.warehouse@globallogistics.com', '+65-6789-0320', 'QUALIFIED', '2026-03-30 11:30:00.000', '2026-05-05 13:45:00.000', 0, 75.0, '2026-07-15 12:00:00.000', 'USD', 135000.00, 15, 6, 4),
(31, 'Lead - Office Office 365 Setup', 'lead.o365@techglobal.com', '+1-555-0155', 'CONTACTED', '2026-03-31 14:00:00.000', '2026-04-18 15:10:00.000', 0, 20.0, '2026-08-15 12:00:00.000', 'USD', 12000.00, 1, 1, 2),
(32, 'Lead - Enterprise Firewall Upgrade', 'lead.firewall@financepulse.com', '+44-20-7946-0310', 'LOST', '2026-04-01 09:15:00.000', '2026-05-01 10:30:00.000', 0, 0.0, '2026-05-15 12:00:00.000', 'USD', 24000.00, 2, 2, 2),
(33, 'Lead - Patient Data Encryption', 'lead.encrypt@medicaresolutions.com', '+33-1-4227-5555', 'NEW', '2026-04-02 10:40:00.000', '2026-04-02 10:40:00.000', 0, 15.0, '2026-11-15 12:00:00.000', 'EUR', 45000.00, 3, 3, 3),
(34, 'Lead - Mobile Learning App', 'lead.mobile@edulearn.org', '+216-98-333333', 'CONTACTED', '2026-04-03 11:20:00.000', '2026-04-28 13:00:00.000', 0, 30.0, '2026-09-15 12:00:00.000', 'USD', 26000.00, 4, 3, 3),
(35, 'Lead - E-Commerce Hosting Upgrade', 'lead.ecom@apexretail.com', '+49-30-5556667', 'QUALIFIED', '2026-04-04 14:10:00.000', '2026-05-10 15:40:00.000', 0, 80.0, '2026-06-30 12:00:00.000', 'EUR', 18000.00, 5, 5, 4);

-- 7. Insert Deals
-- Statuses: PENDING, ACTIVE, WON, LOST, CLOSED, ON_HOLD
INSERT INTO `Deal` (`id`, `name`, `amount`, `probability`, `status`, `expectedCloseDate`, `leadId`, `createdAt`, `updatedAt`, `userId`, `pipelineId`) VALUES
(1, 'ERP Rollout Deal', 25000.00, 10.0, 'PENDING', '2026-07-15 12:00:00.000', 1, '2026-03-01 09:15:00.000', '2026-03-01 09:15:00.000', 2, 1),
(2, 'Cloud Migration Deal', 48000.00, 30.0, 'PENDING', '2026-08-30 12:00:00.000', 2, '2026-03-10 14:10:00.000', '2026-03-10 14:10:00.000', 2, 1),
(3, 'Big Data Platform Deal', 85000.00, 60.0, 'ACTIVE', '2026-06-30 12:00:00.000', 3, '2026-03-15 16:45:00.000', '2026-03-15 16:45:00.000', 2, 2),
(4, 'Medical Procurement Deal', 120000.00, 70.0, 'ACTIVE', '2026-06-15 12:00:00.000', 5, '2026-03-20 10:15:00.000', '2026-03-20 10:15:00.000', 3, 3),
(5, 'Patient Mgmt System Deal', 35000.00, 0.0, 'LOST', '2026-05-01 12:00:00.000', 6, '2026-04-05 11:15:00.000', '2026-04-05 11:15:00.000', 3, 3),
(6, 'LMS Customization Deal', 18000.00, 50.0, 'ACTIVE', '2026-07-01 12:00:00.000', 8, '2026-04-10 16:15:00.000', '2026-04-10 16:15:00.000', 3, 3),
(7, 'Inventory Optimization Deal', 42000.00, 40.0, 'PENDING', '2026-09-30 12:00:00.000', 10, '2026-03-28 13:50:00.000', '2026-03-28 13:50:00.000', 4, 5),
(8, 'Custom App Dev Deal', 30000.00, 65.0, 'ACTIVE', '2026-06-25 12:00:00.000', 11, '2026-04-12 14:30:00.000', '2026-04-12 14:30:00.000', 4, 5),
(9, 'Wealth Platform Deal', 250000.00, 80.0, 'ACTIVE', '2026-06-20 12:00:00.000', 13, '2026-04-18 10:35:00.000', '2026-04-18 10:35:00.000', 5, 7),
(10, 'LIMS License Deal', 55000.00, 35.0, 'PENDING', '2026-08-15 12:00:00.000', 15, '2026-04-02 12:45:00.000', '2026-04-02 12:45:00.000', 5, 8),
(11, 'Lab Automation IoT Deal', 110000.00, 60.0, 'ACTIVE', '2026-07-31 12:00:00.000', 16, '2026-04-20 16:55:00.000', '2026-04-20 16:55:00.000', 5, 7),
(12, 'School ERP Upgrade Deal', 32000.00, 45.0, 'ACTIVE', '2026-09-01 12:00:00.000', 18, '2026-04-08 11:45:00.000', '2026-04-08 11:45:00.000', 2, 9),
(13, 'Wind Turbine Monitoring Deal', 140000.00, 70.0, 'WON', '2026-07-10 12:00:00.000', 19, '2026-04-22 13:30:00.000', '2026-05-15 09:00:00.000', 3, 4),
(14, 'Dedicated Dev Team Deal', 75000.00, 75.0, 'ACTIVE', '2026-06-30 12:00:00.000', 21, '2026-04-25 17:00:00.000', '2026-04-25 17:00:00.000', 4, 5),
(15, 'DevOps Automation Deal', 28000.00, 0.0, 'LOST', '2026-05-01 12:00:00.000', 22, '2026-04-15 10:45:00.000', '2026-04-15 10:45:00.000', 4, 5),
(16, 'Security Auditing Deal', 36000.00, 30.0, 'PENDING', '2026-08-31 12:00:00.000', 23, '2026-04-10 12:00:00.000', '2026-04-10 12:00:00.000', 5, 8),
(17, 'SAP Integration Deal', 180000.00, 85.0, 'WON', '2026-06-15 12:00:00.000', 25, '2026-04-28 15:35:00.000', '2026-05-16 10:00:00.000', 2, 2),
(18, 'LMS Hosting Support Deal', 15000.00, 40.0, 'ACTIVE', '2026-07-31 12:00:00.000', 27, '2026-04-12 17:00:00.000', '2026-04-12 17:00:00.000', 3, 10),
(19, 'Course Digitization Deal', 22000.00, 60.0, 'ACTIVE', '2026-06-30 12:00:00.000', 28, '2026-05-02 10:30:00.000', '2026-05-02 10:30:00.000', 3, 3),
(20, 'Warehouse Automation Deal', 135000.00, 75.0, 'ACTIVE', '2026-07-15 12:00:00.000', 30, '2026-05-05 14:00:00.000', '2026-05-05 14:00:00.000', 4, 6),
(21, 'Office 365 Setup Deal', 12000.00, 20.0, 'PENDING', '2026-08-15 12:00:00.000', 31, '2026-04-18 15:25:00.000', '2026-04-18 15:25:00.000', 2, 1),
(22, 'Enterprise Firewall Deal', 24000.00, 0.0, 'LOST', '2026-05-15 12:00:00.000', 32, '2026-05-01 10:45:00.000', '2026-05-01 10:45:00.000', 2, 2),
(23, 'Mobile Learning Deal', 26000.00, 30.0, 'PENDING', '2026-09-15 12:00:00.000', 34, '2026-04-28 13:15:00.000', '2026-04-28 13:15:00.000', 3, 3),
(24, 'Ecom Hosting Upgrade Deal', 18000.00, 80.0, 'WON', '2026-06-30 12:00:00.000', 35, '2026-05-10 15:55:00.000', '2026-05-17 11:00:00.000', 4, 5);

-- 8. Insert Tasks
-- Statuses: PENDING, IN_PROGRESS, COMPLETED, CANCELLED, OVERDUE
-- Priorities: LOW, MEDIUM, HIGH, CRITICAL
INSERT INTO `Task` (`id`, `title`, `dueDate`, `status`, `priority`, `createdAt`, `updatedAt`, `userId`, `leadId`) VALUES
(1, 'Send initial quote for ERP', '2026-03-15 17:00:00.000', 'COMPLETED', 'HIGH', '2026-03-01 09:30:00.000', '2026-03-12 10:00:00.000', 2, 1),
(2, 'Schedule discovery call', '2026-03-10 10:00:00.000', 'COMPLETED', 'MEDIUM', '2026-03-02 11:00:00.000', '2026-03-08 15:00:00.000', 2, 2),
(3, 'Follow up after proposal', '2026-03-25 15:00:00.000', 'COMPLETED', 'HIGH', '2026-03-15 17:00:00.000', '2026-03-24 14:00:00.000', 2, 3),
(4, 'Review security requirements', '2026-03-12 16:00:00.000', 'COMPLETED', 'MEDIUM', '2026-03-04 14:30:00.000', '2026-03-10 11:00:00.000', 2, 4),
(5, 'Organize onsite medical demo', '2026-04-10 11:00:00.000', 'COMPLETED', 'CRITICAL', '2026-03-05 10:00:00.000', '2026-04-09 16:00:00.000', 3, 5),
(6, 'Send tech specification sheets', '2026-03-18 12:00:00.000', 'COMPLETED', 'LOW', '2026-03-06 11:00:00.000', '2026-03-17 09:30:00.000', 3, 6),
(7, 'Follow up regarding whiteboards', '2026-04-15 10:00:00.000', 'COMPLETED', 'LOW', '2026-03-07 14:30:00.000', '2026-04-12 11:00:00.000', 3, 7),
(8, 'Draft LMS customization spec', '2026-04-20 17:00:00.000', 'COMPLETED', 'HIGH', '2026-03-08 15:30:00.000', '2026-04-18 13:00:00.000', 3, 8),
(9, 'Conduct store inventory tour', '2026-04-05 10:00:00.000', 'COMPLETED', 'MEDIUM', '2026-03-10 11:30:00.000', '2026-04-02 15:00:00.000', 4, 10),
(10, 'Introduce technical lead', '2026-04-25 11:00:00.000', 'COMPLETED', 'HIGH', '2026-03-11 13:30:00.000', '2026-04-24 10:00:00.000', 4, 11),
(11, 'Review pricing models with VP', '2026-04-28 14:00:00.000', 'COMPLETED', 'CRITICAL', '2026-03-13 09:30:00.000', '2026-04-26 16:30:00.000', 5, 13),
(12, 'Send LIMS quote', '2026-04-15 12:00:00.000', 'COMPLETED', 'MEDIUM', '2026-03-15 11:15:00.000', '2026-04-12 09:00:00.000', 5, 15),
(13, 'Discuss IoT hardware setup', '2026-05-02 15:00:00.000', 'COMPLETED', 'HIGH', '2026-03-16 15:30:00.000', '2026-04-30 11:00:00.000', 5, 16),
(14, 'Follow up with School Board', '2026-04-25 10:00:00.000', 'COMPLETED', 'MEDIUM', '2026-03-18 10:30:00.000', '2026-04-20 15:30:00.000', 2, 18),
(15, 'Negotiate service contract', '2026-05-10 11:00:00.000', 'COMPLETED', 'CRITICAL', '2026-03-19 11:15:00.000', '2026-05-08 14:00:00.000', 3, 19),
(16, 'Provide reference contacts', '2026-05-05 16:00:00.000', 'COMPLETED', 'MEDIUM', '2026-03-21 16:00:00.000', '2026-05-03 10:00:00.000', 4, 21),
(17, 'Final contract signature SAP', '2026-05-15 12:00:00.000', 'COMPLETED', 'CRITICAL', '2026-03-25 14:00:00.000', '2026-05-14 17:00:00.000', 2, 25),
(18, 'Draft Course Digitization contract', '2026-05-10 12:00:00.000', 'COMPLETED', 'HIGH', '2026-03-28 09:30:00.000', '2026-05-08 11:00:00.000', 3, 28),
(19, 'Final contract signature Warehouse', '2026-05-15 10:00:00.000', 'COMPLETED', 'HIGH', '2026-03-30 11:45:00.000', '2026-05-13 16:30:00.000', 4, 30),
(20, 'Follow up Office 365 migration', '2026-05-20 15:00:00.000', 'PENDING', 'MEDIUM', '2026-03-31 14:15:00.000', '2026-03-31 14:15:00.000', 2, 31),
(21, 'Call to schedule medical demo follow up', '2026-05-22 10:00:00.000', 'IN_PROGRESS', 'HIGH', '2026-04-02 10:50:00.000', '2026-04-02 10:50:00.000', 3, 33),
(22, 'Prepare presentation slide deck', '2026-05-25 14:00:00.000', 'PENDING', 'HIGH', '2026-04-03 11:30:00.000', '2026-04-03 11:30:00.000', 3, 34),
(23, 'Initiate database migration', '2026-05-21 16:00:00.000', 'IN_PROGRESS', 'HIGH', '2026-04-04 14:20:00.000', '2026-04-04 14:20:00.000', 4, 35),
(24, 'Send NDA for signing', '2026-05-24 10:00:00.000', 'PENDING', 'LOW', '2026-04-02 10:45:00.000', '2026-04-02 10:45:00.000', 3, 33),
(25, 'Contact legal department', '2026-05-26 11:00:00.000', 'PENDING', 'MEDIUM', '2026-03-01 09:30:00.000', '2026-03-01 09:30:00.000', 2, 1);

-- 9. Insert Notes
INSERT INTO `Note` (`id`, `content`, `createdAt`, `updatedAt`, `userId`, `leadId`) VALUES
(1, 'Spoke with CTO, they want to start with a core ERP implementation first before doing CRM.', '2026-03-01 09:45:00.000', '2026-03-01 09:45:00.000', 2, 1),
(2, 'Sent brochure and general pricing information. They will review in their next tech board meeting.', '2026-03-02 11:30:00.000', '2026-03-02 11:30:00.000', 2, 2),
(3, 'Very positive feedback on the big data analytics demo. They requested a deep-dive security review.', '2026-03-15 17:15:00.000', '2026-03-15 17:15:00.000', 2, 3),
(4, 'Left voicemail for the IT security manager. Will try calling again next week.', '2026-03-20 14:45:00.000', '2026-03-20 14:45:00.000', 2, 4),
(5, 'Onsite demo was successful. Head of radiology is championing our platform.', '2026-04-09 16:30:00.000', '2026-04-09 16:30:00.000', 3, 5),
(6, 'Lost this lead. The hospital board decided to freeze all patient database upgrades until next fiscal year.', '2026-04-05 11:30:00.000', '2026-04-05 11:30:00.000', 3, 6),
(7, 'School is interested but budgets are constrained. Sent them a discounted educational proposal.', '2026-04-12 11:15:00.000', '2026-04-12 11:15:00.000', 3, 7),
(8, 'Finalized the custom requirements for the LMS. Awaiting their CIO review.', '2026-04-18 13:30:00.000', '2026-04-18 13:30:00.000', 3, 8),
(9, 'Store tour completed. Identified 5 key areas for automated inventory optimization.', '2026-04-02 15:30:00.000', '2026-04-02 15:30:00.000', 4, 10),
(10, 'Technical presentation went great. They like our flexible team scaling model.', '2026-04-24 10:30:00.000', '2026-04-24 10:30:00.000', 4, 11),
(11, 'Drafted contract and reviewed terms with their VP. They requested minor changes to the SLA clause.', '2026-04-26 17:00:00.000', '2026-04-26 17:00:00.000', 5, 13),
(12, 'Pricing is slightly higher than their current provider, but our compliance features are superior.', '2026-04-12 09:30:00.000', '2026-04-12 09:30:00.000', 5, 15),
(13, 'IoT demo successfully verified. They confirmed the sensor hardware integration model.', '2026-04-30 11:30:00.000', '2026-04-30 11:30:00.000', 5, 16),
(14, 'Presented proposal to the school management. They are comparing with 2 other vendor systems.', '2026-04-20 16:00:00.000', '2026-04-20 16:00:00.000', 2, 18),
(15, 'Signed contract! Deployment scheduled to begin in early June.', '2026-05-15 09:30:00.000', '2026-05-15 09:30:00.000', 3, 19),
(16, 'Client requested 3 reference contacts of current logistics companies using our CRM.', '2026-05-03 10:30:00.000', '2026-05-03 10:30:00.000', 4, 21),
(17, 'Contract signed for SAP Integration! This is a massive win for our European branch.', '2026-05-14 17:30:00.000', '2026-05-14 17:30:00.000', 2, 25),
(18, 'Sent drafted contract for digitization services. Expecting feedback by end of week.', '2026-05-08 11:30:00.000', '2026-05-08 11:30:00.000', 3, 28),
(19, 'Warehouse automation contract finalized and signed. Highly enthusiastic about this project.', '2026-05-13 17:00:00.000', '2026-05-13 17:00:00.000', 4, 30),
(20, 'Initial call done. They are migrating from an on-prem exchange server to O365.', '2026-03-31 14:30:00.000', '2026-03-31 14:30:00.000', 2, 31),
(21, 'Patient data encryption requirements drafted. Waiting for security guidelines.', '2026-04-02 11:15:00.000', '2026-04-02 11:15:00.000', 3, 33),
(22, 'Initial slides for the learning app presentation are done. Focus on UI/UX.', '2026-04-03 12:00:00.000', '2026-04-03 12:00:00.000', 3, 34),
(23, 'Testing environment setup. Database migration script validated.', '2026-04-04 14:45:00.000', '2026-04-04 14:45:00.000', 4, 35),
(24, 'Sent NDA to their legal representative for sign-off.', '2026-04-02 11:00:00.000', '2026-04-02 11:00:00.000', 3, 33),
(25, 'Connected with their regional counsel. Standard software SLA terms accepted.', '2026-03-01 10:00:00.000', '2026-03-01 10:00:00.000', 2, 1);

-- 10. Insert Tickets
-- Statuses: NEW, OPEN, PENDING, RESOLVED, CLOSED
-- Priorities: LOW, MEDIUM, HIGH, CRITICAL
INSERT INTO `Ticket` (`id`, `title`, `description`, `status`, `priority`, `userId`, `leadId`, `contactId`, `createdAt`, `updatedAt`) VALUES
(1, 'Billing discrepancy Q1', 'Client says they were double billed for the implementation phase.', 'RESOLVED', 'HIGH', 2, 1, 1, '2026-03-05 10:00:00.000', '2026-03-12 14:00:00.000'),
(2, 'Login issue on dev portal', 'Cannot access the shared AWS sandbox environment. Access denied.', 'CLOSED', 'MEDIUM', 2, 2, 2, '2026-03-12 09:00:00.000', '2026-03-13 11:00:00.000'),
(3, 'API documentation request', 'Need details on the webhook format for real-time contact sync.', 'CLOSED', 'LOW', 2, 3, 3, '2026-03-18 10:30:00.000', '2026-03-19 15:30:00.000'),
(4, 'SSO configuration failure', 'Okta integration fails with a SAML signature mismatch error.', 'RESOLVED', 'CRITICAL', 2, 3, 4, '2026-03-22 14:00:00.000', '2026-03-24 16:30:00.000'),
(5, 'SLA compliance clarification', 'Client wants to know the exact penalty terms for downtime.', 'OPEN', 'MEDIUM', 3, 5, 5, '2026-04-10 11:00:00.000', '2026-04-10 11:00:00.000'),
(6, 'Database export request', 'Need a full export of contact records for internal audit.', 'RESOLVED', 'LOW', 3, 7, 7, '2026-04-15 10:00:00.000', '2026-04-17 12:00:00.000'),
(7, 'Course upload error 500', 'Video uploads failing with a standard server 500 response code.', 'RESOLVED', 'HIGH', 3, 8, 8, '2026-04-20 14:00:00.000', '2026-04-22 09:00:00.000'),
(8, 'Mobile app crash on iOS 17', 'App crashes immediately on opening on iPhone 15 Pro.', 'OPEN', 'CRITICAL', 4, 11, 11, '2026-04-26 09:30:00.000', '2026-04-26 09:30:00.000'),
(9, 'Custom report generation error', 'CSV download button in reports dashboard does not trigger.', 'PENDING', 'MEDIUM', 4, 10, 10, '2026-04-28 15:00:00.000', '2026-04-28 15:00:00.000'),
(10, 'Onboarding invite link expired', 'Welcome email link expired before user could set password.', 'CLOSED', 'LOW', 5, 13, 13, '2026-04-22 11:00:00.000', '2026-04-23 10:00:00.000'),
(11, 'Custom dashboard layout reset', 'User metrics tiles disappeared after system update yesterday.', 'NEW', 'MEDIUM', 5, 15, 15, '2026-05-02 10:00:00.000', '2026-05-02 10:00:00.000'),
(12, 'Slow dashboard load times', 'Main leads grid page takes up to 8 seconds to fetch records.', 'OPEN', 'HIGH', 5, 16, 16, '2026-05-05 14:30:00.000', '2026-05-05 14:30:00.000'),
(13, 'Integration with Zoom fails', 'OAuth token expires in 10 minutes instead of the configured 1 hour.', 'RESOLVED', 'HIGH', 2, 18, 17, '2026-04-28 11:00:00.000', '2026-04-30 16:00:00.000'),
(14, 'Missing translation files', 'Several admin buttons show dynamic translation placeholders in FR.', 'CLOSED', 'LOW', 3, 19, 19, '2026-05-12 10:00:00.000', '2026-05-14 15:00:00.000'),
(15, 'Account locked out', 'User locked out after 5 unsuccessful password attempts.', 'RESOLVED', 'MEDIUM', 4, 21, 21, '2026-05-14 09:00:00.000', '2026-05-14 10:30:00.000');

-- 11. Insert LeadContacts (Relationship mapping)
INSERT INTO `LeadContact` (`id`, `role`, `createdAt`, `updatedAt`, `contactId`, `leadId`) VALUES
(1, 'Primary Contact', '2026-03-01 09:05:00.000', '2026-03-01 09:05:00.000', 1, 1),
(2, 'Technical Evaluator', '2026-03-01 09:10:00.000', '2026-03-01 09:10:00.000', 2, 1),
(3, 'Primary Contact', '2026-03-02 10:35:00.000', '2026-03-02 10:35:00.000', 1, 2),
(4, 'Executive Sponsor', '2026-03-03 11:20:00.000', '2026-03-03 11:20:00.000', 3, 3),
(5, 'Primary Contact', '2026-03-03 11:25:00.000', '2026-03-03 11:25:00.000', 4, 3),
(6, 'Technical Buyer', '2026-03-04 14:05:00.000', '2026-03-04 14:05:00.000', 3, 4),
(7, 'Primary Contact', '2026-03-05 09:35:00.000', '2026-03-05 09:35:00.000', 5, 5),
(8, 'Influencer', '2026-03-05 09:40:00.000', '2026-03-05 09:40:00.000', 6, 5),
(9, 'Primary Contact', '2026-03-06 10:50:00.000', '2026-03-06 10:50:00.000', 5, 6),
(10, 'Executive Sponsor', '2026-03-07 14:20:00.000', '2026-03-07 14:20:00.000', 7, 7),
(11, 'Primary Contact', '2026-03-08 15:05:00.000', '2026-03-08 15:05:00.000', 8, 8),
(12, 'Primary Contact', '2026-03-09 10:05:00.000', '2026-03-09 10:05:00.000', 9, 9),
(13, 'Influencer', '2026-03-10 11:25:00.000', '2026-03-10 11:25:00.000', 10, 10),
(14, 'Primary Contact', '2026-03-11 13:05:00.000', '2026-03-11 13:05:00.000', 11, 11),
(15, 'Technical Buyer', '2026-03-11 13:10:00.000', '2026-03-11 13:10:00.000', 12, 11),
(16, 'Primary Contact', '2026-03-12 14:50:00.000', '2026-03-12 14:50:00.000', 11, 12),
(17, 'Executive Sponsor', '2026-03-13 09:20:00.000', '2026-03-13 09:20:00.000', 13, 13),
(18, 'Primary Contact', '2026-03-13 09:25:00.000', '2026-03-13 09:25:00.000', 14, 13),
(19, 'Primary Contact', '2026-03-14 10:35:00.000', '2026-03-14 10:35:00.000', 13, 14),
(20, 'Primary Contact', '2026-03-15 11:05:00.000', '2026-03-15 11:05:00.000', 15, 15),
(21, 'Technical Evaluator', '2026-03-16 15:25:00.000', '2026-03-16 15:25:00.000', 16, 16),
(22, 'Primary Contact', '2026-03-17 16:05:00.000', '2026-03-17 16:05:00.000', 17, 17),
(23, 'Primary Contact', '2026-03-18 10:20:00.000', '2026-03-18 10:20:00.000', 18, 18),
(24, 'Primary Contact', '2026-03-19 11:05:00.000', '2026-03-19 11:05:00.000', 19, 19),
(25, 'Technical Buyer', '2026-03-19 11:10:00.000', '2026-03-19 11:10:00.000', 20, 19),
(26, 'Primary Contact', '2026-03-21 15:50:00.000', '2026-03-21 15:50:00.000', 21, 21),
(27, 'Primary Contact', '2026-03-25 13:55:00.000', '2026-03-25 13:55:00.000', 25, 25),
(28, 'Primary Contact', '2026-03-28 09:25:00.000', '2026-03-28 09:25:00.000', 27, 28),
(29, 'Primary Contact', '2026-03-30 11:35:00.000', '2026-03-30 11:35:00.000', 29, 30),
(30, 'Influencer', '2026-03-30 11:40:00.000', '2026-03-30 11:40:00.000', 30, 30);

-- 12. Insert Activities
INSERT INTO `Activity` (`id`, `type`, `title`, `description`, `entity`, `entityId`, `metadata`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, 'CALL', 'Discovery Call Conducted', 'Discussed cloud migration strategy and timeline with CTO.', 'Lead', 2, '{}', '2026-03-08 15:00:00.000', '2026-03-08 15:00:00.000', 2),
(2, 'MEETING', 'Onsite Presentation', 'Demoed our patient management system to the board of directors.', 'Lead', 5, '{}', '2026-04-09 16:00:00.000', '2026-04-09 16:00:00.000', 3),
(3, 'EMAIL', 'Proposal Sent', 'Emailed detailed LMS customization requirements and final pricing.', 'Lead', 8, '{}', '2026-04-18 13:00:00.000', '2026-04-18 13:00:00.000', 3),
(4, 'NOTE', 'Added internal feedback', 'CTO mentioned that compliance features are highly important.', 'Lead', 15, '{}', '2026-04-12 09:30:00.000', '2026-04-12 09:30:00.000', 5),
(5, 'MEETING', 'IoT Proof of Concept', 'Verified the sensor communication protocol and gateway integrations.', 'Lead', 16, '{}', '2026-04-30 11:00:00.000', '2026-04-30 11:00:00.000', 5),
(6, 'SYSTEM', 'Lead Qualified', 'Lead score recalculated to 85 due to budget confirmation.', 'Lead', 25, '{}', '2026-04-28 15:20:00.000', '2026-04-28 15:20:00.000', 2),
(7, 'CALL', 'Initial Outreach', 'Spoke to their regional HR director regarding school digitization options.', 'Lead', 28, '{}', '2026-05-02 10:15:00.000', '2026-05-02 10:15:00.000', 3),
(8, 'MEETING', 'Technical Deep-dive', 'Walked their operations architect through our warehouse automation API.', 'Lead', 30, '{}', '2026-05-05 13:45:00.000', '2026-05-05 13:45:00.000', 4),
(9, 'SYSTEM', 'Contract Signed', 'Contract value of $140,000 officially approved.', 'Deal', 13, '{}', '2026-05-15 09:00:00.000', '2026-05-15 09:00:00.000', 3),
(10, 'SYSTEM', 'Lead Won', 'Lead officially converted to high-value active customer account.', 'Lead', 35, '{}', '2026-05-17 11:00:00.000', '2026-05-17 11:00:00.000', 4);

-- 13. Insert Notifications
-- Priorities: LOW, MEDIUM, HIGH, CRITICAL
INSERT INTO `Notification` (`id`, `userId`, `type`, `message`, `isRead`, `degree`, `relatedId`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'TASK', 'Your task "Send initial quote for ERP" has been completed successfully.', 0, 'MEDIUM', 1, '2026-03-12 10:00:00.000', '2026-03-12 10:00:00.000'),
(2, 3, 'LEAD', 'New qualified lead "LMS Customization" has been assigned to you.', 0, 'HIGH', 8, '2026-04-10 16:00:00.000', '2026-04-10 16:00:00.000'),
(3, 4, 'TASK', 'URGENT: Task "Conduct store inventory tour" is overdue!', 0, 'CRITICAL', 9, '2026-04-06 09:00:00.000', '2026-04-06 09:00:00.000'),
(4, 5, 'MEETING', 'Upcoming sync scheduled tomorrow for Wealth Mgmt Platform.', 0, 'LOW', 13, '2026-04-17 17:00:00.000', '2026-04-17 17:00:00.000'),
(5, 2, 'SYSTEM', 'Deal "SAP Integration Deal" has been won! Congratulations!', 0, 'CRITICAL', 17, '2026-05-16 10:00:00.000', '2026-05-16 10:00:00.000');
