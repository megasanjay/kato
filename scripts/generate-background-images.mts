/**
 * This script is used to get new background images form the Unsplash API.
 * The images are then stored in the database.
 * 5 images are generated for the day.
 */

// Import the required modules
import dayjs from "dayjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const UNSPLASH_URL = "https://api.unsplash.com";

// Get the keys from the environment variables
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const SECRET_KEY = process.env.UNSPLASH_SECRET_KEY;

// Get the current date
const now = dayjs();

const imageThemes = [
  "nature",
  "mountain",
  "forest",
  "beach",
  "island",
  "waterfall",
  "galaxy",
  "astronomy",
  "astrophotography",
  "landscape",
  "lake",
  "scenery",
  "sculpture",
];

const generateImage = async (searchDate: string) => {
  const images = await prisma.background.findMany({
    where: {
      date: searchDate,
    },
  });

  console.log(`Found ${images.length} images for ${searchDate}`);

  const usedThemes = images.map((image) => image.theme);

  console.log(`Used themes: ${usedThemes.map((theme) => theme).join(", ")}`);

  const unusedThemes = imageThemes.filter(
    (theme) => !usedThemes.includes(theme)
  );

  const randomTheme =
    unusedThemes[Math.floor(Math.random() * unusedThemes.length)];

  console.log(`Using theme ${randomTheme}`);
};

const today = now.format("YYYY-MM-DD");
const tomorrow = now.add(1, "day").format("YYYY-MM-DD");
const dayAfterTomorrow = now.add(2, "day").format("YYYY-MM-DD");

generateImage(today);
generateImage(tomorrow);
generateImage(dayAfterTomorrow);
