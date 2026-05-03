export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const userFeeds = await prisma.userRssFeed.findMany({
    where: { userId: user.id },
    include: {
      feed: {
        include: {
          rssFeedItems: {
            orderBy: { pubDate: "desc" },
            take: 20,
            select: {
              id: true,
              title: true,
              link: true,
              pubDate: true,
              description: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return userFeeds
    .flatMap((uf) =>
      uf.feed.rssFeedItems.map((item) => ({
        id: item.id,
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        description: item.description,
        feedId: uf.feed.id,
        feedUrl: uf.feed.url,
        feedTitle: uf.feed.title,
      })),
    )
    .sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime())
    .slice(0, 20);
});
