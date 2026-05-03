export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const result = await prisma.todo.deleteMany({
    where: {
      userId: user.id,
      isCompleted: true,
    },
  });

  return {
    success: true,
    deletedCount: result.count,
  };
});
