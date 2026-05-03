const FEED_ITEM_LIMIT = 20;
const STALE_HOURS = 6;

export default defineEventHandler(async (event) => {
  await isAdmin(event);

  const staleBefore = new Date(Date.now() - STALE_HOURS * 60 * 60 * 1000);

  const [
    totalFeeds,
    subscribedFeeds,
    staleFeeds,
    feedsWithNoItems,
    totalItems,
    feeds,
  ] = await prisma.$transaction([
    prisma.rssFeed.count(),
    prisma.rssFeed.count({ where: { userRssFeeds: { some: {} } } }),
    prisma.rssFeed.count({
      where: {
        userRssFeeds: { some: {} },
        OR: [{ lastFetchedAt: null }, { lastFetchedAt: { lt: staleBefore } }],
      },
    }),
    prisma.rssFeed.count({
      where: {
        userRssFeeds: { some: {} },
        rssFeedItems: { none: {} },
      },
    }),
    prisma.rssFeedItem.count(),
    prisma.rssFeed.findMany({
      where: { userRssFeeds: { some: {} } },
      orderBy: [{ lastFetchedAt: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        url: true,
        lastFetchedAt: true,
        createdAt: true,
        _count: {
          select: {
            userRssFeeds: true,
            rssFeedItems: true,
          },
        },
        rssFeedItems: {
          orderBy: { pubDate: "desc" },
          take: 1,
          select: { pubDate: true },
        },
      },
    }),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      feedItemLimit: FEED_ITEM_LIMIT,
      staleAfterHours: STALE_HOURS,
      totalFeeds,
      subscribedFeeds,
      staleFeeds,
      feedsWithNoItems,
      totalItems,
    },
    feeds: feeds.map((feed) => ({
      id: feed.id,
      title: feed.title,
      url: feed.url,
      subscriberCount: feed._count.userRssFeeds,
      itemCount: feed._count.rssFeedItems,
      overLimitBy: Math.max(0, feed._count.rssFeedItems - FEED_ITEM_LIMIT),
      lastFetchedAt: feed.lastFetchedAt,
      latestItemDate: feed.rssFeedItems[0]?.pubDate ?? null,
      createdAt: feed.createdAt,
      isStale: !feed.lastFetchedAt || feed.lastFetchedAt < staleBefore,
    })),
  };
});
