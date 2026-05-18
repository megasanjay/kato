const DEFAULT_INTERVAL_NAME = "minute";

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  const { user } = session;

  const staticCountdownInterval =
    await prisma.staticCountdownInterval.findUnique({
      where: { userId: user.id },
      select: {
        intervalName: true,
      },
    });

  if (!staticCountdownInterval) {
    return await prisma.staticCountdownInterval.create({
      data: {
        intervalName: DEFAULT_INTERVAL_NAME,
        userId: user.id,
      },
      select: {
        intervalName: true,
      },
    });
  }

  console.log("Found existing static countdown interval for user:", {
    userId: user.id,
    intervalName: staticCountdownInterval.intervalName,
  });

  return staticCountdownInterval;
});
