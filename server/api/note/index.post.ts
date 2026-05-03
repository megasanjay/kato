import { z } from "zod";

const schema = z.object({
  title: z.string().trim().max(120).optional(),
  content: z.string().min(1).max(500),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, schema.parse);
  const content = body.content.trim();
  const title = body.title?.trim() || "Untitled note";

  const count = await prisma.note.count({ where: { userId: user.id } });

  if (count >= 100) {
    throw createError({
      statusCode: 429,
      statusMessage: "Note limit reached",
    });
  }

  return prisma.note.create({
    data: {
      userId: user.id,
      title,
      content,
    },
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
});
