import { z } from "zod";

const schema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    content: z.string().trim().min(1).max(500).optional(),
  })
  .refine((value) => value.title !== undefined || value.content !== undefined, {
    message: "At least one field must be provided",
  });

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = event.context.params as { id: string };

  const body = await readValidatedBody(event, schema.parse);

  const note = await prisma.note.findUnique({ where: { id } });

  if (!note || note.userId !== user.id) {
    throw createError({ statusCode: 404, message: "Note not found" });
  }

  const data: { title?: string; content?: string } = {};

  if (body.title !== undefined) {
    data.title = body.title;
  }

  if (body.content !== undefined) {
    data.content = body.content;
  }

  return prisma.note.update({
    where: { id },
    data,
    select: {
      id: true,
      title: true,
      content: true,
    },
  });
});
