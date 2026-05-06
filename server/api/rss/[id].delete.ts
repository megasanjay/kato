export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = event.context.params as { id: string };

  const userFeed = await prisma.userRssFeed.findUnique({
    where: {
      userId_feedId: {
        userId: user.id,
        feedId: id,
      },
    },
  });

  if (!userFeed) {
    throw createError({
      statusCode: 404,
      statusMessage: "Subscription not found",
    });
  }

  await prisma.userRssFeed.delete({
    where: {
      userId_feedId: {
        userId: user.id,
        feedId: id,
      },
    },
  });

  const remainingSubscribers = await prisma.userRssFeed.count({
    where: { feedId: id },
  });

  if (remainingSubscribers === 0) {
    await prisma.rssFeed.delete({
      where: { id },
    });
  }

  return { success: true };
});
