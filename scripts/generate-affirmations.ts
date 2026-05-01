/**
 * Generates short-term affirmation records and prunes stale entries.
 */

// Import the required modules.
import "dotenv/config";
import dayjs from "dayjs";
import { PrismaClient } from "../shared/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

import AFFIRMATIONJSON from "../assets/data/affirmations.json";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Capture the current date once so generation stays consistent within a run.
const now = dayjs();

const generateAffirmation = async (searchDate: string) => {
  const affirmation = await prisma.affirmation.findFirst({
    where: {
      date: searchDate,
    },
  });

  if (affirmation) {
    console.log(`Already have affirmation for ${searchDate}`);

    return;
  }

  const allAffirmations = await prisma.affirmation.findMany({
    select: {
      affirmation: true,
    },
  });

  const unusedAffirmations = AFFIRMATIONJSON.filter(
    (affirmation: string) =>
      !allAffirmations
        .map((affirmation) => affirmation.affirmation)
        .includes(affirmation),
  );

  const randomAffirmation =
    unusedAffirmations[Math.floor(Math.random() * unusedAffirmations.length)];

  console.log(`Using affirmation ${randomAffirmation}`);

  await prisma.affirmation.create({
    data: {
      affirmation: randomAffirmation,
      date: searchDate,
    },
  });
};

const main = async () => {
  const today = now.format("YYYY-MM-DD");
  const tomorrow = now.add(1, "day").format("YYYY-MM-DD");
  const dayAfterTomorrow = now.add(2, "day").format("YYYY-MM-DD");

  await generateAffirmation(today);
  await generateAffirmation(tomorrow);
  await generateAffirmation(dayAfterTomorrow);

  // Delete old affirmations from database (older than 60 days)

  console.log("Deleting old affirmations...");

  const sixtyDaysAgo = now.subtract(60, "day").format("YYYY-MM-DD");

  const oldAffirmations = await prisma.affirmation.deleteMany({
    where: {
      date: {
        lt: sixtyDaysAgo,
      },
    },
  });

  console.log(`Deleted ${oldAffirmations.count} affirmations`);

  // Exit the script
  process.exit(0);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
