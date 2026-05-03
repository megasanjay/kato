import { z } from "zod";

const schema = z.object({
  isCompleted: z.boolean().optional(),
  content: z.string().min(1).max(500).optional(),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { id } = event.context.params as { id: string };

  const body = await readValidatedBody(event, schema.parse);

  const todo = await prisma.todo.findUnique({ where: { id } });

  if (!todo || todo.userId !== user.id) {
    throw createError({ statusCode: 404, message: "Todo not found" });
  }

  return prisma.todo.update({
    where: { id },
    data: body,
    select: {
      id: true,
      content: true,
      isCompleted: true,
    },
  });
});
