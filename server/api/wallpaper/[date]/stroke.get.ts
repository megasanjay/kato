export default defineEventHandler(async (event) => {
  const { date } = event.context.params as { date: string };

  // Validate the date format (YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw createError({
      message: "Invalid date format. Expected YYYY-MM-DD.",
      statusCode: 400,
    });
  }

  const wallpaper = await prisma.background.findFirst({
    where: {
      date,
    },
    select: {
      addTextStroke: true,
    },
  });

  if (!wallpaper) {
    throw createError({
      message: "No wallpaper found for the specified date",
      statusCode: 404,
    });
  }

  return { addTextStroke: wallpaper.addTextStroke };
});
