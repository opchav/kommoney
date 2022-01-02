import { PrismaClient } from '@prisma/client';
import { userData } from '../src/utils/seed';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const usersCount = await prisma.user.count();
  if (usersCount > 0) {
    console.log(`Users already seeded.`);
    return;
  }

  for (const u of userData) {
    const user = await prisma.user.upsert({ where: { email: u.email }, create: u, update: {} });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
