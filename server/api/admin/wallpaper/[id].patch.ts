import { z } from "zod";

const schema = z.object({
  addTextStroke: z.boolean(),
});

export default defineEventHandler(async (event) => {
  await isAdmin(event);

  const { id } = event.context.params as { id: string };

  if (!id) {
    throw createError({ statusCode: 400, message: "Invalid wallpaper id" });
  }

  const body = await readValidatedBody(event, schema.parse);

  const wallpaper = await prisma.background.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!wallpaper) {
    throw createError({ statusCode: 404, message: "Wallpaper not found" });
  }

  return prisma.background.update({
    where: { id },
    data: { addTextStroke: body.addTextStroke },
    select: {
      id: true,
      addTextStroke: true,
    },
  });
});
