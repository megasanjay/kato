export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = event.context.params as { id: string };

  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo || todo.userId !== user.id) {
    throw createError({ statusCode: 404, message: "Todo not found" });
  }

  await prisma.todo.delete({ where: { id } });

  return { success: true };
});
