import { z } from "zod";

export default defineEventHandler(async (event) => {
  const {
    public: { limits },
  } = useRuntimeConfig(event);
  const schema = z.object({
    title: z.string().trim().max(limits.text.titleMaxLength).optional(),
    content: z.string().min(1).max(limits.text.noteMaxLength),
  });
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, schema.parse);
  const content = body.content.trim();
  const title = body.title?.trim() || "Untitled note";

  const count = await prisma.note.count({ where: { userId: user.id } });

  if (count >= limits.itemLimit) {
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
