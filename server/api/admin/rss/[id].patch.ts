import { z } from "zod";

const schema = z.object({
  bypassCache: z.boolean(),
});

export default defineEventHandler(async (event) => {
  await isAdmin(event);

  const { id } = event.context.params as { id: string };
  const body = await readValidatedBody(event, schema.parse);

  const feed = await prisma.rssFeed.findUnique({ where: { id } });

  if (!feed) {
    throw createError({ statusCode: 404, statusMessage: "Feed not found" });
  }

  return prisma.rssFeed.update({
    where: { id },
    data: {
      bypassCache: body.bypassCache,
    },
    select: {
      id: true,
      bypassCache: true,
    },
  });
});
