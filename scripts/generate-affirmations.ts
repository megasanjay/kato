/**
 * This script is used to generate affirmations for the next 3 days.
 * It uses a list of affirmations present in the affirmations.json file.
 * It then saves the affirmations to the database for the specified date.
 * It also deletes affirmations older than 60 days.
 */

// Import the required modules
import dayjs from "dayjs";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

import AFFIRMATIONJSON from "../assets/data/affirmations.json" assert { type: "json" };

const prisma = new PrismaClient();

// Get the current date
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
        .includes(affirmation)
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
