const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const activity = await prisma.activity.create({
      data: {
        type: 'note_added',
        title: 'Note Added',
        description: `Note added for Lead: Test`,
        entity: 'lead',
        entityId: 1,
        userId: 1,
        metadata: { entityName: 'Test' }
      }
    });
    console.log('Success:', activity);
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
