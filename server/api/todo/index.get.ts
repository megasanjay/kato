export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  return prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      content: true,
      isCompleted: true,
    },
  });
});
