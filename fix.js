const fs = require('fs');
const files = [
  'src/tasks/tasks.service.ts',
  'src/pipelines/pipelines.service.ts',
  'src/notes/notes.service.ts',
  'src/leads/leads.service.ts',
  'src/emails/emails.service.ts',
  'src/deals/deals.service.ts'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const updated = content.replace(/[ \t]*timestamp:\s*new\s*Date\(\),?\r?\n/g, '');
  fs.writeFileSync(f, updated);
});
console.log('Fixed timestamps.');
