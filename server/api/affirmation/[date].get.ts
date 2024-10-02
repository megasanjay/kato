import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { date } = event.context.params as { date: string };

  if (!date) {
    throw createError({
      message: "Invalid date",
      statusCode: 400,
    });
  }

  console.log(`Fetching affirmation for ${date}`);

  const affirmation = await prisma.affirmation.findFirst({
    select: {
      affirmation: true,
      date: true,
    },
    where: {
      date,
    },
  });

  console.log(affirmation);

  if (!affirmation) {
    throw createError({
      message: "No affirmation found for the specified date",
      statusCode: 404,
    });
  }

  return JSON.stringify(affirmation);
});
