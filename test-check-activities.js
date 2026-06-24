const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const acts = await prisma.activity.findMany({
    where: { type: 'note_added' },
    orderBy: { id: 'desc' },
    take: 5
  });
  console.log(acts);
  await prisma.$disconnect();
}
main();
