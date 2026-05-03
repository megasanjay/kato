export default defineEventHandler(async (event) => {
  await isAdmin(event);

  const { id } = event.context.params as { id: string };

  if (!id) {
    throw createError({ statusCode: 400, message: "Invalid wallpaper id" });
  }

  const wallpaper = await prisma.background.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!wallpaper) {
    throw createError({ statusCode: 404, message: "Wallpaper not found" });
  }

  await prisma.background.delete({ where: { id } });

  return { success: true };
});
