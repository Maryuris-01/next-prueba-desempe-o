import "dotenv/config";
import { PrismaClient, Role } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email: "admin@cospace.com" },
    update: {},
    create: {
      email: "admin@cospace.com",
      name: "Admin CoSpace",
      password: hashedPassword,
      role: Role.ADMIN,   // usa el enum, no el string
    },
  });

  const spaces = [
    { name: "Escritorio Individual A1", description: "...", price: 5.0, image: "https://..." },
    // ... resto con price y image
  ];

  for (const space of spaces) {
    await prisma.space.upsert({
      where: { name: space.name },   // requiere @@unique([name]) en el modelo
      update: {},
      create: space,
    });
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });