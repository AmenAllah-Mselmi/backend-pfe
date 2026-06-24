const fs = require('fs');

const firstNames = ['Jean', 'Marie', 'Luc', 'Sophie', 'Thomas', 'Julie', 'Emma', 'Paul', 'Antoine', 'Claire', 'Nicolas', 'Celine'];
const lastNames = ['Dupont', 'Martin', 'Bernard', 'Petit', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David'];
const industries = ['TECHNOLOGY', 'FINANCE', 'HEALTHCARE', 'EDUCATION', 'OTHER'];
const sizes = ['SMALL', 'MEDIUM', 'LARGE'];
const leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST'];
const contactStatuses = ['ACTIVE', 'INACTIVE'];

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

// Contacts
let contacts = 'name,email,phone,status\n';
for (let i = 1; i <= 120; i++) {
    const fn = random(firstNames);
    const ln = random(lastNames);
    const phone = `06${String(randInt(10000000, 99999999))}`;
    contacts += `${fn} ${ln},${fn.toLowerCase()}.${ln.toLowerCase()}${i}@example.com,${phone},${random(contactStatuses)}\n`;
}
fs.writeFileSync('contacts.csv', contacts);

// Leads
let leads = 'name,email,phone,status,probability,dealValue,currency,scoreIA\n';
for (let i = 1; i <= 120; i++) {
    const fn = random(firstNames);
    const ln = random(lastNames);
    const phone = `07${String(randInt(10000000, 99999999))}`;
    const score = randInt(10, 95); // Ensure many are > 40
    leads += `${fn} ${ln},${fn.toLowerCase()}.${ln.toLowerCase()}${i}@leads.com,${phone},${random(leadStatuses)},${randInt(10, 90)},${randInt(1000, 50000)},USD,${score}\n`;
}
fs.writeFileSync('leads.csv', leads);

// Companies
let companies = 'name,email,phone,companyIndustry,companySize,location,revenue\n';
for (let i = 1; i <= 120; i++) {
    const name = `Entreprise ${i}`;
    companies += `${name},contact@entreprise${i}.com,01${String(randInt(10000000, 99999999))},${random(industries)},${random(sizes)},Paris,${randInt(50000, 5000000)}\n`;
}
fs.writeFileSync('companies.csv', companies);

console.log('Succès : Les fichiers CSV ont été mis à jour avec les colonnes exactes de la base de données !');
