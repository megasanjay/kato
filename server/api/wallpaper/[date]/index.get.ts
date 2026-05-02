export default defineEventHandler(async (event) => {
  const { date } = event.context.params as { date: string };

  if (!date) {
    throw createError({
      message: "Invalid date",
      statusCode: 400,
    });
  }

  const image = await prisma.background.findFirst({
    select: {
      username: true,
      city: true,
      country: true,
      date: true,
      description: true,
      url: true,
      unsplashUrl: true,
      authorName: true,
      portfolioUrl: true,
    },
    where: {
      date,
    },
  });

  if (!image) {
    throw createError({
      message: "No image found for the specified date",
      statusCode: 404,
    });
  }

  return JSON.stringify(image);
});
