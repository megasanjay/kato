export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = event.context.params as { id: string };

  const note = await prisma.note.findUnique({ where: { id } });

  if (!note || note.userId !== user.id) {
    throw createError({ statusCode: 404, message: "Note not found" });
  }

  await prisma.note.delete({ where: { id } });

  return { success: true };
});
