export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const userFeeds = await prisma.userRssFeed.findMany({
    where: { userId: user.id },
    include: {
      feed: {
        include: {
          _count: {
            select: {
              rssFeedItems: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return userFeeds.map((entry) => ({
    id: entry.feed.id,
    title: entry.feed.title,
    url: entry.feed.url,
    subscribedAt: entry.createdAt,
    itemCount: entry.feed._count.rssFeedItems,
    lastFetchedAt: entry.feed.lastFetchedAt,
  }));
});
