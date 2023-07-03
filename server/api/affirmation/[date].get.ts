import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  const { date } = event.context.params as { date: string };

  if (!date) {
    throw createError({
      message: "Invalid date",
      statusCode: 400,
    });
  }

  const affirmation = await prisma.affirmation.findFirst({
    select: {
      affirmation: true,
      date: true,
    },
    where: {
      date,
    },
  });

  return JSON.stringify(affirmation);
});
