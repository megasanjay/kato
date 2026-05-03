export default defineEventHandler(async (event) => {
  await isAdmin(event);

  return prisma.background.findMany({
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      date: true,
      url: true,
      description: true,
      authorName: true,
      username: true,
      unsplashUrl: true,
      portfolioUrl: true,
      city: true,
      country: true,
      addTextStroke: true,
      createdAt: true,
    },
  });
});
