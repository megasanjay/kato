/**
 * Fetches fresh wallpaper candidates from Unsplash and stores them by date.
 */

// Import the required modules.
import "dotenv/config";
import dayjs from "dayjs";
import { PrismaClient } from "../shared/generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Read the API key from the environment.
const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Capture the current date once so generation stays consistent within a run.
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

  if (images.length >= imageThemes.length) {
    console.log(`Already have images for ${searchDate}`);

    return;
  }

  const index = images.length;

  const usedThemes = images.map((image) => image.theme);

  console.log(`Used themes: ${usedThemes.map((theme) => theme).join(", ")}`);

  const unusedThemes = imageThemes.filter(
    (theme) => !usedThemes.includes(theme),
  );

  const randomTheme =
    unusedThemes[Math.floor(Math.random() * unusedThemes.length)];

  console.log(`Using theme ${randomTheme}`);

  // Get the images from the Unsplash API
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${randomTheme}&orientation=landscape&order_by=latest&per_page=30`,
    {
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    },
  );

  // check for errors
  if (!response.ok) {
    console.error(
      `Error while fetching images from Unsplash API: ${response.status} ${response.statusText}`,
    );

    return;
  }

  const responseImagesData = (await response.json()).results;

  for (const responseImage of responseImagesData) {
    // check if image already exists
    const existingImage = await prisma.background.findFirst({
      where: {
        imageID: responseImage.id,
      },
    });

    console.log(`Checking image ${responseImage.id}`);

    if (existingImage) {
      console.log(`Image ${responseImage.id} already exists`);
      continue;
    } else {
      // get location of image
      const imageDetailsResponse = await fetch(
        `https://api.unsplash.com/photos/${responseImage.id}`,
        {
          headers: {
            Authorization: `Client-ID ${ACCESS_KEY}`,
          },
        },
      );

      // check for errors
      if (!imageDetailsResponse.ok) {
        console.error(
          `Error while fetching image details from Unsplash API: ${imageDetailsResponse.status} ${imageDetailsResponse.statusText}`,
        );

        return;
      }

      const imageDetails = await imageDetailsResponse.json();
      const imageLocation = imageDetails.location;

      const { city, country } = imageLocation;

      let { description } = responseImage;

      if (!description) {
        if (responseImage.alt_description) {
          description = responseImage.alt_description;
        } else {
          description = "None provided";
        }
      }

      const unsplashUrl = responseImage.links.html;

      const { username } = responseImage.user;
      const authorName = responseImage.user.name;
      const portfolioUrl =
        responseImage.user.portfolio_url || `https://unsplash.com/@${username}`;

      console.log(`Image ${responseImage.id} is from ${city}, ${country}`);

      // save image to database
      await prisma.background.create({
        data: {
          username,
          authorName,
          portfolioUrl,
          city: city || "Unknown",
          country: country || "Unknown",
          date: searchDate,
          description,
          imageID: responseImage.id,
          index,
          theme: randomTheme,
          url: `${responseImage.urls.raw}&auto=format`,
          unsplashUrl,
        },
      });

      console.log(`Saved image ${responseImage.id} to database`);

      break;
    }
  }
};

const main = async () => {
  const today = now.format("YYYY-MM-DD");
  const tomorrow = now.add(1, "day").format("YYYY-MM-DD");
  const dayAfterTomorrow = now.add(2, "day").format("YYYY-MM-DD");

  await generateImage(today);
  await generateImage(tomorrow);
  await generateImage(dayAfterTomorrow);

  // Delete old images from database (older than 30 days)

  console.log("Deleting old images");

  const thirtyDaysAgo = now.subtract(30, "day").format("YYYY-MM-DD");

  const oldImages = await prisma.background.findMany({
    where: {
      date: { lt: thirtyDaysAgo },
    },
  });

  console.log(`Found ${oldImages.length} old images`);

  for (const oldImage of oldImages) {
    await prisma.background.delete({
      where: {
        id: oldImage.id,
      },
    });

    console.log(`Deleted image ${oldImage.id}`);
  }

  // Exit the script
  process.exit(0);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
