export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  return prisma.note.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
});
