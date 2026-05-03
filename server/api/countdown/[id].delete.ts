export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = event.context.params as { id: string };

  const countdown = await prisma.countdown.findUnique({ where: { id } });

  if (!countdown || countdown.userId !== user.id) {
    throw createError({ statusCode: 404, message: "Countdown not found" });
  }

  await prisma.countdown.delete({ where: { id } });

  return { success: true };
});
