import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

async function main() {
  await prisma.category.create({ data: { name: "Natural" } });
}

main()
  .then(() => console.log("Seeding done!"))
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
