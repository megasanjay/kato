import { z } from "zod";

const ALLOWED_INTERVALS = [
  "minute",
  "hour",
  "day",
  "day-minute",
  "week",
  "month",
  "quarter",
  "year",
  "year-month",
  "workday",
] as const;

const schema = z.object({
  intervalName: z.enum(ALLOWED_INTERVALS),
});

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const { user } = session;

  const body = await readValidatedBody(event, schema.parse);

  // upsert static countdown interval for the user with the new interval name
  const updateInterval = await prisma.staticCountdownInterval.upsert({
    where: {
      userId: user.id,
    },
    update: {
      intervalName: body.intervalName,
    },
    create: {
      userId: user.id,
      intervalName: body.intervalName,
    },
  });

  if (!updateInterval) {
    throw createError({
      statusCode: 500,
      message: "Failed to update static countdown interval",
    });
  }

  return updateInterval;
});
