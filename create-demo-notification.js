const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'rep1@gmail.com' }
  });
  if (!user) {
    console.error('User rep1@gmail.com not found');
    return;
  }
  
  const notification = await prisma.notification.create({
    data: {
      userId: user.id,
      type: 'AI',
      message: 'AI Analysis: Nous avons détecté 3 leads à fort potentiel qui nécessitent votre attention immédiate. (Demo)',
      degree: 'HIGH',
    }
  });
  console.log('Notification created:', notification);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
