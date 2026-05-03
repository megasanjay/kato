import { z } from "zod";

const schema = z.object({
  content: z.string().min(1).max(500),
});

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const body = await readValidatedBody(event, schema.parse);

  const count = await prisma.todo.count({ where: { userId: user.id } });

  if (count >= 100) {
    throw createError({
      statusCode: 429,
      statusMessage: "Todo limit reached",
    });
  }

  return prisma.todo.create({
    data: {
      userId: user.id,
      content: body.content,
    },
    select: {
      id: true,
      content: true,
      isCompleted: true,
    },
  });
});
