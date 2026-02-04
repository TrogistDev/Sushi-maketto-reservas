// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

// Se o construtor vazio falhar na v7, passamos a URL explicitamente
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL as string,
});

async function main() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD não definida no .env");

  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("⏳ A verificar Admin...");
  
  await prisma.admin.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin pronto para o Sushi Maketto!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });