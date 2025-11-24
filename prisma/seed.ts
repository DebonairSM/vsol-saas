import { PrismaClient, type users } from '@prisma/client';
import { faker } from '@faker-js/faker';
import logger from '../src/lib/logger';
import { HR } from '../src/utils/helper';

const prisma = new PrismaClient();
const seedUsers = async (): Promise<void> => {
  const fakeUsers = faker.helpers.uniqueArray<users>(
    () => ({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    }),
    3
  );

  // SQLite doesn't support createMany, so we create users one by one
  let count = 0;
  for (const user of fakeUsers) {
    await prisma.users.create({ data: user });
    count++;
  }

  logger.info(`
    \r${HR('white', '-', 30)}
    \rSeed completed for model: user
    \rcount: ${count}
    \r${HR('white', '-', 30)}
  `);
};

async function seed(): Promise<void> {
  await Promise.all([seedUsers()]);
}

async function main(): Promise<void> {
  let isError: boolean = false;
  try {
    await seed();
  } catch (e) {
    isError = true;
    logger.error(e);
  } finally {
    await prisma.$disconnect();
    process.exit(isError ? 1 : 0);
  }
}

void main();
