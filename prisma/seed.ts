import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const user = await prisma.user.findFirst();

  if (!user) {
    console.error(
      "❌ No user found. Seed a user first or create one in the app.",
    );
    return;
  }

  const priorities = [
    { level: "Emergency", value: 4, icon: "🚨", bgColor: "#ffe5e5" },
    { level: "High", value: 3, icon: "🔴", bgColor: "#ffe6cc" },
    { level: "Medium", value: 2, icon: "🟠", bgColor: "#fff2bf" },
    { level: "Low", value: 1, icon: "🔵", bgColor: "#e0f0ff" },
  ];

  const categories = [
    {
      name: "Work",
      iconCategory: "💼",
      color: "#3b82f6",
      userId: user.id,
    },
    {
      name: "Personal",
      iconCategory: "🏠",
      color: "#10b981",
      userId: user.id,
    },
    {
      name: "Health",
      iconCategory: "🏋️",
      color: "#ef4444",
      userId: user.id,
    },
    {
      name: "Learning",
      iconCategory: "📚",
      color: "#8b5cf6",
      userId: user.id,
    },
  ];

  console.log("Start seeding priority ...");

  for (const p of priorities) {
    const priority = await prisma.priority.upsert({
      // Ensure 'level' is marked as @unique in your schema.prisma
      where: { level: p.level },
      update: {
        bgColor: p.bgColor,
      },
      create: p,
    });
    console.log(`Created priority: ${priority.level}`);
  }

  console.log("Seeding finished priority.");

  console.log("Start seeding categories.");

  for (const c of categories) {
    const category = await prisma.category.upsert({
      where: {
        // Prisma expects the composite unique fields here
        name_userId: {
          name: c.name,
          userId: user.id,
        },
      },
      update: {}, // No changes if it exists
      create: {
        ...c,
        userId: user.id, // Ensure the relation is set on create
      },
    });
    console.log(`Created category: ${category.name}`);
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
