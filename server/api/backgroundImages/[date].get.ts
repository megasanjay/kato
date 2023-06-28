import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { date } = event.context.params as { date: string };

  if (!date) {
    throw createError({
      message: "Invalid date",
      statusCode: 400,
    });
  }

  const images = await prisma.background.findMany({
    orderBy: {
      index: "asc",
    },

    select: {
      username: true,
      city: true,
      country: true,
      date: true,
      description: true,
      index: true,
      url: true,
    },
    where: {
      date,
    },
  });

  return JSON.stringify(images);
});
